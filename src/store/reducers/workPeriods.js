import moment from "moment";
import * as ACTION_TYPE from "store/actionTypes/workPeriods";
import {
  BILLING_ACCOUNTS_NONE,
  BILLING_ACCOUNTS_LOADING,
  BILLING_ACCOUNTS_ERROR,
  JOB_NAME_ERROR,
  JOB_NAME_LOADING,
  PAYMENT_STATUS,
  SORT_BY,
  SORT_BY_DEFAULT,
  SORT_ORDER,
  SORT_ORDER_DEFAULT,
  URL_QUERY_PARAM_MAP,
} from "constants/workPeriods";
import {
  filterPeriodsByStartDate,
  getWeekByDate,
  updateOptionMap,
} from "utils/misc";
import { createAssignedBillingAccountOption } from "utils/workPeriods";

const cancelSourceDummy = { cancel: () => {} };

const PAGE_SIZES = [10, 20, 50, 100];

const initPagination = () => ({
  totalCount: 0,
  pageCount: 0,
  pageNumber: 1,
  pageSize: +sessionStorage.getItem("workPeriods.pagination.pageSize") || 10,
});

const initFilters = () => ({
  dateRange: getWeekByDate(moment()),
  onlyFailedPayments: false,
  paymentStatuses: {}, // all disabled by default
  userHandle: "",
});

const initPeriodDetails = (
  periodId,
  rbId,
  billingAccountId = 0,
  cancelSource = cancelSourceDummy
) => ({
  periodId,
  rbId,
  cancelSource,
  jobName: JOB_NAME_LOADING,
  jobNameError: null,
  jobNameIsLoading: true,
  billingAccountId,
  billingAccounts: [
    { value: billingAccountId, label: BILLING_ACCOUNTS_LOADING },
  ],
  billingAccountsError: null,
  billingAccountsIsDisabled: true,
  billingAccountsIsLoading: true,
  hidePastPeriods: false,
  periods: [],
  periodsVisible: [],
  periodsIsLoading: true,
});

const initialState = updateStateFromQuery(window.location.search, {
  cancelSource: cancelSourceDummy,
  error: null,
  filters: initFilters(),
  isProcessingPayments: false,
  isSelectedPeriodsAll: false,
  isSelectedPeriodsVisible: false,
  pagination: initPagination(),
  periods: [],
  periodsData: [{}],
  periodsDetails: {},
  periodsFailed: {},
  periodsSelected: {},
  sorting: {
    criteria: SORT_BY_DEFAULT,
    order: SORT_ORDER_DEFAULT,
  },
});

const reducer = (state = initialState, action) => {
  if (action.type in actionHandlers) {
    return actionHandlers[action.type](state, action.payload);
  }
  return state;
};

const actionHandlers = {
  [ACTION_TYPE.WP_LOAD_PAGE_PENDING]: (state, cancelSource) => ({
    ...state,
    cancelSource,
    error: null,
    isSelectedPeriodsAll: false,
    isSelectedPeriodsVisible: false,
    periods: [],
    periodsData: [{}],
    periodsDetails: {},
    periodsFailed: {},
    periodsSelected: {},
  }),
  [ACTION_TYPE.WP_LOAD_PAGE_SUCCESS]: (
    state,
    { periods, totalCount, pageCount }
  ) => {
    const oldPagination = state.pagination;
    const pagination =
      oldPagination.totalCount !== totalCount ||
      oldPagination.pageCount !== pageCount
        ? { ...oldPagination, totalCount, pageCount }
        : oldPagination;
    const periodsData = {};
    for (let period of periods) {
      period.data.cancelSource = null;
      periodsData[period.id] = period.data;
      delete period.data;
    }
    return {
      ...state,
      cancelSource: null,
      error: null,
      pagination,
      periods,
      periodsData: [periodsData],
    };
  },
  [ACTION_TYPE.WP_LOAD_PAGE_ERROR]: (state, error) => {
    console.error(error.message);
    return {
      ...state,
      cancelSource: null,
      error: error.message,
      periods: [],
    };
  },
  [ACTION_TYPE.WP_HIDE_PERIOD_DETAILS]: (state, periodId) => {
    const periodsDetails = { ...state.periodsDetails };
    delete periodsDetails[periodId];
    return {
      ...state,
      periodsDetails,
    };
  },
  [ACTION_TYPE.WP_HIGHLIGHT_FAILED_PERIODS]: (state, periods) => {
    const periodIds = Object.keys(periods);
    if (!periodIds.length) {
      return state;
    }
    let isSelectedPeriodsAll = state.isSelectedPeriodsAll;
    let isSelectedPeriodsVisible = state.isSelectedPeriodsVisible;
    const periodsFailed = { ...state.periodsFailed };
    const periodsSelected = { ...state.periodsSelected };
    for (let periodId of periodIds) {
      if (periods[periodId]) {
        periodsFailed[periodId] = true;
        periodsSelected[periodId] = true;
      } else {
        isSelectedPeriodsAll = false;
        isSelectedPeriodsVisible = false;
        delete periodsSelected[periodId];
      }
    }
    return {
      ...state,
      isSelectedPeriodsAll,
      isSelectedPeriodsVisible,
      periodsFailed,
      periodsSelected,
    };
  },
  [ACTION_TYPE.WP_LOAD_PERIOD_DETAILS_PENDING]: (
    state,
    { periodId, rbId, billingAccountId, cancelSource }
  ) => {
    const periodsDetails = { ...state.periodsDetails };
    periodsDetails[periodId] = initPeriodDetails(
      periodId,
      rbId,
      billingAccountId,
      cancelSource
    );
    return {
      ...state,
      periodsDetails,
    };
  },
  [ACTION_TYPE.WP_LOAD_PERIOD_DETAILS_SUCCESS]: (
    state,
    { periodId, details }
  ) => {
    const periodsDetails = { ...state.periodsDetails };
    let periodDetails = periodsDetails[periodId];
    // period details object must already be initialized
    if (!periodDetails) {
      // This branch should not be reachable but just in case.
      return state;
    }
    const periodsData = state.periodsData[0];
    for (let period of details.periods) {
      period.data.cancelSource = null;
      periodsData[period.id] = period.data;
      delete period.data;
    }
    periodDetails = {
      ...periodDetails,
      periods: details.periods,
      periodsIsLoading: false,
    };
    if (periodDetails.hidePastPeriods) {
      periodDetails.periodsVisible = filterPeriodsByStartDate(
        periodDetails.periods,
        state.filters.dateRange[0]
      );
    } else {
      periodDetails.periodsVisible = periodDetails.periods;
    }
    periodsDetails[periodId] = periodDetails;
    return {
      ...state,
      periodsData: [periodsData],
      periodsDetails,
    };
  },
  [ACTION_TYPE.WP_LOAD_PERIOD_DETAILS_ERROR]: (
    state,
    { periodId, message }
  ) => {
    const periodsDetails = { ...state.periodsDetails };
    // No periods to show so we just hide period details.
    delete periodsDetails[periodId];
    console.error(message);
    return {
      ...state,
      periodsDetails,
    };
  },
  [ACTION_TYPE.WP_LOAD_JOB_NAME_SUCCESS]: (state, { periodId, jobName }) => {
    const periodsDetails = { ...state.periodsDetails };
    let periodDetails = periodsDetails[periodId];
    if (!periodDetails) {
      // Period details may be removed at this point so we must handle this case.
      return state;
    }
    periodDetails = {
      ...periodDetails,
      jobName,
      jobNameError: null,
      jobNameIsLoading: false,
    };
    if (!periodDetails.billingAccountsIsLoading) {
      periodDetails.cancelSource = null;
    }
    periodsDetails[periodId] = periodDetails;
    return {
      ...state,
      periodsDetails,
    };
  },
  [ACTION_TYPE.WP_LOAD_JOB_NAME_ERROR]: (state, { periodId, message }) => {
    const periodsDetails = { ...state.periodsDetails };
    let periodDetails = periodsDetails[periodId];
    if (!periodDetails) {
      return state;
    }
    periodDetails = {
      ...periodDetails,
      jobName: JOB_NAME_ERROR,
      jobNameError: message,
      jobNameIsLoading: false,
    };
    if (!periodDetails.billingAccountsIsLoading) {
      periodDetails.cancelSource = null;
    }
    periodsDetails[periodId] = periodDetails;
    return {
      ...state,
      periodsDetails,
    };
  },
  [ACTION_TYPE.WP_LOAD_BILLING_ACCOUNTS_SUCCESS]: (
    state,
    { periodId, accounts }
  ) => {
    const periodsDetails = { ...state.periodsDetails };
    let periodDetails = periodsDetails[periodId];
    if (!periodDetails) {
      // Period details may be removed at this point so we must handle this case.
      return state;
    }
    let billingAccountsIsDisabled = false;
    let accountId = periodDetails.billingAccountId;
    if (!accounts.length) {
      accounts.push({ value: accountId, label: BILLING_ACCOUNTS_NONE });
      billingAccountsIsDisabled = true;
    }
    periodDetails = {
      ...periodDetails,
      billingAccounts: accounts,
      billingAccountsError: null,
      billingAccountsIsDisabled,
      billingAccountsIsLoading: false,
    };
    if (!periodDetails.jobNameIsLoading) {
      periodDetails.cancelSource = null;
    }
    periodsDetails[periodId] = periodDetails;
    return {
      ...state,
      periodsDetails,
    };
  },
  [ACTION_TYPE.WP_LOAD_BILLING_ACCOUNTS_ERROR]: (
    state,
    { periodId, message }
  ) => {
    const periodsDetails = { ...state.periodsDetails };
    let periodDetails = periodsDetails[periodId];
    if (!periodDetails) {
      return state;
    }
    let billingAccounts = [];
    let billingAccountsIsDisabled = true;
    let accountId = periodDetails.billingAccountId;
    if (accountId) {
      billingAccounts.push(createAssignedBillingAccountOption(accountId));
      billingAccountsIsDisabled = false;
    } else {
      billingAccounts.push({ value: accountId, label: BILLING_ACCOUNTS_ERROR });
    }
    periodDetails = {
      ...periodDetails,
      billingAccounts,
      billingAccountsError: message,
      billingAccountsIsDisabled,
      billingAccountsIsLoading: false,
    };
    if (!periodDetails.jobNameIsLoading) {
      periodDetails.cancelSource = null;
    }
    periodsDetails[periodId] = periodDetails;
    return {
      ...state,
      periodsDetails,
    };
  },
  [ACTION_TYPE.WP_SET_BILLING_ACCOUNT]: (state, { periodId, accountId }) => {
    const periodsDetails = { ...state.periodsDetails };
    const periodDetails = periodsDetails[periodId];
    if (!periodDetails) {
      return state;
    }
    periodsDetails[periodId] = {
      ...periodDetails,
      billingAccountId: accountId,
    };
    return {
      ...state,
      periodsDetails,
    };
  },
  [ACTION_TYPE.WP_SET_DETAILS_HIDE_PAST_PERIODS]: (
    state,
    { periodId, hide }
  ) => {
    const periodsDetails = { ...state.periodsDetails };
    let periodDetails = periodsDetails[periodId];
    if (!periodDetails) {
      return state;
    }
    periodDetails = { ...periodDetails, hidePastPeriods: hide };
    if (hide) {
      periodDetails.periodsVisible = filterPeriodsByStartDate(
        periodDetails.periods,
        state.filters.dateRange[0]
      );
    } else {
      periodDetails.periodsVisible = periodDetails.periods;
    }
    periodsDetails[periodId] = periodDetails;
    return {
      ...state,
      periodsDetails,
    };
  },
  [ACTION_TYPE.WP_SET_DETAILS_WORKING_DAYS]: (
    state,
    { periodId, daysWorked }
  ) => {
    const periodsData = state.periodsData[0];
    let periodData = periodsData[periodId];
    daysWorked = Math.min(Math.max(daysWorked, periodData.daysPaid), 5);
    if (daysWorked === periodData.daysWorked) {
      return state;
    }
    periodsData[periodId] = { ...periodData, daysWorked };
    return {
      ...state,
      periodsData: [periodsData],
    };
  },
  [ACTION_TYPE.WP_RESET_FILTERS]: (state) => ({
    ...state,
    filters: initFilters(),
    pagination: {
      ...state.pagination,
      pageNumber: 1,
    },
  }),
  [ACTION_TYPE.WP_SET_DATE_RANGE]: (state, date) => {
    const oldRange = state.filters.dateRange;
    const range = getWeekByDate(date);
    if (range[0].isSame(oldRange[0]) && range[1].isSame(oldRange[1])) {
      return state;
    }
    return {
      ...state,
      filters: {
        ...state.filters,
        dateRange: range,
      },
      pagination: {
        ...state.pagination,
        pageNumber: 1,
      },
    };
  },
  [ACTION_TYPE.WP_SELECT_PERIODS]: (state, periods) => {
    let isSelectedPeriodsAll = state.isSelectedPeriodsAll;
    let isSelectedPeriodsVisible = state.isSelectedPeriodsVisible;
    let periodsSelected = { ...state.periodsSelected };
    for (let periodId in periods) {
      if (periods[periodId] === true) {
        periodsSelected[periodId] = true;
      } else {
        isSelectedPeriodsAll = false;
        isSelectedPeriodsVisible = false;
        delete periodsSelected[periodId];
      }
    }
    const selectedCount = Object.keys(periodsSelected).length;
    const pageSize = state.pagination.pageSize;
    const totalCount = state.pagination.totalCount;
    if (totalCount > pageSize) {
      if (selectedCount === pageSize) {
        isSelectedPeriodsVisible = true;
      }
    } else if (selectedCount === totalCount) {
      isSelectedPeriodsAll = true;
      isSelectedPeriodsVisible = true;
    }
    return {
      ...state,
      isSelectedPeriodsAll,
      isSelectedPeriodsVisible,
      periodsSelected,
    };
  },
  [ACTION_TYPE.WP_SET_PAGE_NUMBER]: (state, pageNumber) => ({
    ...state,
    pagination:
      pageNumber === state.pagination.pageNumber
        ? state.pagination
        : { ...state.pagination, pageNumber },
  }),
  [ACTION_TYPE.WP_SET_PAGE_SIZE]: (state, pageSize) => ({
    ...state,
    pagination:
      pageSize === state.pagination.pageSize
        ? state.pagination
        : { ...state.pagination, pageSize, pageNumber: 1 },
  }),
  [ACTION_TYPE.WP_SET_SORT_BY]: (state, criteria) => ({
    ...state,
    pagination: {
      ...state.pagination,
      pageNumber: 1,
    },
    sorting: {
      ...state.sorting,
      criteria,
    },
  }),
  [ACTION_TYPE.WP_SET_SORTING]: (state, { sortBy, sortOrder }) => {
    if (!sortOrder) {
      sortOrder = SORT_ORDER_DEFAULT;
      sortBy = SORT_BY_DEFAULT;
    }
    if (!sortBy) {
      sortBy = SORT_BY_DEFAULT;
    }
    return {
      ...state,
      pagination: {
        ...state.pagination,
        pageNumber: 1,
      },
      sorting: {
        criteria: sortBy,
        order: sortOrder,
      },
    };
  },
  [ACTION_TYPE.WP_SET_PAYMENT_STATUSES]: (state, paymentStatuses) => ({
    ...state,
    filters: {
      ...state.filters,
      paymentStatuses: updateOptionMap(
        state.filters.paymentStatuses,
        paymentStatuses
      ),
    },
    pagination: {
      ...state.pagination,
      pageNumber: 1,
    },
  }),
  [ACTION_TYPE.WP_SET_USER_HANDLE]: (state, userHandle) => {
    if (userHandle === state.filters.userHandle) {
      return state;
    }
    return {
      ...state,
      filters: {
        ...state.filters,
        userHandle,
      },
      pagination: {
        ...state.pagination,
        pageNumber: 1,
      },
    };
  },
  [ACTION_TYPE.WP_SET_PERIOD_DATA_PENDING]: (
    state,
    { periodId, cancelSource }
  ) => {
    const periodsData = state.periodsData[0];
    const periodData = periodsData[periodId];
    if (!periodData) {
      return state;
    }
    periodsData[periodId] = {
      ...periodData,
      cancelSource,
    };
    return {
      ...state,
      periodsData: [periodsData],
    };
  },
  [ACTION_TYPE.WP_SET_PERIOD_DATA_SUCCESS]: (state, { periodId, data }) => {
    const periodsData = state.periodsData[0];
    const periodData = periodsData[periodId];
    if (!periodData) {
      return state;
    }
    periodsData[periodId] = {
      ...periodData,
      ...data,
      cancelSource: null,
    };
    return {
      ...state,
      periodsData: [periodsData],
    };
  },
  [ACTION_TYPE.WP_SET_PERIOD_DATA_ERROR]: (state, { periodId }) => {
    const periodsData = state.periodsData[0];
    const periodData = periodsData[periodId];
    if (!periodData) {
      return state;
    }
    periodsData[periodId] = {
      ...periodData,
      cancelSource: null,
    };
    return {
      ...state,
      periodsData: [periodsData],
    };
  },
  [ACTION_TYPE.WP_SET_WORKING_DAYS]: (state, { periodId, daysWorked }) => {
    const periodsData = state.periodsData[0];
    const periodData = periodsData[periodId];
    if (!periodData) {
      return state;
    }
    daysWorked = Math.min(Math.max(daysWorked, periodData.daysPaid), 5);
    if (daysWorked === periodData.daysWorked) {
      return state;
    }
    periodsData[periodId] = { ...periodData, daysWorked };
    return {
      ...state,
      periodsData: [periodsData],
    };
  },
  [ACTION_TYPE.WP_TOGGLE_ONLY_FAILED_PAYMENTS]: (state, on) => {
    const filters = state.filters;
    on = on === null ? !filters.onlyFailedPayments : on;
    if (on === filters.onlyFailedPayments) {
      return state;
    }
    return {
      ...state,
      filters: {
        ...filters,
        onlyFailedPayments: on,
      },
      pagination: {
        ...state.pagination,
        pageNumber: 1,
      },
    };
  },
  [ACTION_TYPE.WP_TOGGLE_PERIOD]: (state, periodId) => {
    let isSelectedPeriodsAll = state.isSelectedPeriodsAll;
    let isSelectedPeriodsVisible = state.isSelectedPeriodsVisible;
    const periodsSelected = { ...state.periodsSelected };
    const isSelected = !periodsSelected[periodId];
    if (isSelected) {
      periodsSelected[periodId] = true;
      const selectedCount = Object.keys(periodsSelected).length;
      const pageSize = state.pagination.pageSize;
      const totalCount = state.pagination.totalCount;
      if (totalCount > pageSize) {
        if (selectedCount === pageSize) {
          isSelectedPeriodsVisible = true;
        }
      } else if (selectedCount === totalCount) {
        isSelectedPeriodsAll = true;
        isSelectedPeriodsVisible = true;
      }
    } else {
      isSelectedPeriodsAll = false;
      isSelectedPeriodsVisible = false;
      delete periodsSelected[periodId];
    }
    return {
      ...state,
      periodsSelected,
      isSelectedPeriodsAll,
      isSelectedPeriodsVisible,
    };
  },
  [ACTION_TYPE.WP_TOGGLE_PERIODS_ALL]: (state, on) => {
    const isSelected = on === null ? !state.isSelectedPeriodsAll : on;
    const periodsSelected = {};
    if (isSelected) {
      for (let period of state.periods) {
        periodsSelected[period.id] = true;
      }
    }
    return {
      ...state,
      periodsSelected,
      isSelectedPeriodsAll: isSelected,
      isSelectedPeriodsVisible: isSelected,
    };
  },
  [ACTION_TYPE.WP_TOGGLE_PERIODS_VISIBLE]: (state, on) => {
    let isSelectedPeriodsAll = false;
    const isSelectedPeriodsVisible =
      on === null ? !state.isSelectedPeriodsVisible : on;
    const periodsSelected = {};
    if (isSelectedPeriodsVisible) {
      for (let period of state.periods) {
        periodsSelected[period.id] = true;
      }
      isSelectedPeriodsAll =
        state.periods.length === state.pagination.totalCount;
    }
    return {
      ...state,
      periodsSelected,
      isSelectedPeriodsAll,
      isSelectedPeriodsVisible,
    };
  },
  [ACTION_TYPE.WP_TOGGLE_PROCESSING_PAYMENTS]: (state, on) => {
    let periodsFailed = state.periodsFailed;
    let isProcessingPayments = on === null ? !state.isProcessingPayments : on;
    if (isProcessingPayments) {
      periodsFailed = {};
    }
    return {
      ...state,
      periodsFailed,
      isProcessingPayments,
    };
  },
  [ACTION_TYPE.WP_UPDATE_STATE_FROM_QUERY]: (state, query) =>
    updateStateFromQuery(query, state),
};

/**
 * Updates state from current URL's query.
 *
 * @param {string} queryStr query string
 * @param {Object} state working periods' state slice
 * @returns {Object} initial state
 */
function updateStateFromQuery(queryStr, state) {
  const params = {};
  const query = new URLSearchParams(queryStr);
  for (let [stateKey, queryKey] of URL_QUERY_PARAM_MAP) {
    let value = query.get(queryKey);
    if (value) {
      params[stateKey] = value;
    }
  }
  let updateFilters = false;
  let updatePagination = false;
  let updateSorting = false;
  const { filters, pagination, sorting } = state;
  const { dateRange } = filters;
  // checking start date
  let range = getWeekByDate(moment(params.startDate));
  if (!range[0].isSame(dateRange[0])) {
    filters.dateRange = range;
    updateFilters = true;
  }
  // checking payment statuses
  let hasSameStatuses = true;
  const filtersPaymentStatuses = filters.paymentStatuses;
  const queryPaymentStatuses = {};
  const paymentStatusesStr = params.paymentStatuses;
  if (paymentStatusesStr) {
    for (let status of paymentStatusesStr.split(",")) {
      status = status.toUpperCase();
      if (status in PAYMENT_STATUS) {
        queryPaymentStatuses[status] = true;
        if (!filtersPaymentStatuses[status]) {
          hasSameStatuses = false;
        }
      }
    }
  }
  for (let status in filtersPaymentStatuses) {
    if (!queryPaymentStatuses[status]) {
      hasSameStatuses = false;
      break;
    }
  }
  if (!hasSameStatuses) {
    filters.paymentStatuses = queryPaymentStatuses;
    updateFilters = true;
  }
  // chacking only failed payments flag
  const onlyFailedFlag = params.onlyFailedPayments?.slice(0, 1);
  const onlyFailedPayments = onlyFailedFlag === "y";
  if (onlyFailedPayments !== filters.onlyFailedPayments) {
    filters.onlyFailedPayments = onlyFailedPayments;
    updateFilters = true;
  }
  // checking user handle
  const userHandle = params.userHandle?.slice(0, 256) || "";
  if (userHandle !== filters.userHandle) {
    filters.userHandle = userHandle;
    updateFilters = true;
  }
  // checking sorting criteria
  let criteria = params.criteria?.toUpperCase();
  criteria = criteria in SORT_BY ? criteria : SORT_BY_DEFAULT;
  if (criteria !== sorting.criteria) {
    sorting.criteria = criteria;
    updateSorting = true;
  }
  // checking sorting order
  let order = params.order;
  order =
    order && order.toUpperCase() in SORT_ORDER ? order : SORT_ORDER_DEFAULT;
  if (order !== sorting.order) {
    sorting.order = order;
    updateSorting = true;
  }
  // checking page number
  const pageNumber = +params.pageNumber;
  if (pageNumber && pageNumber !== pagination.pageNumber) {
    pagination.pageNumber = pageNumber;
    updatePagination = true;
  }
  // checking page size
  const pageSize = +params.pageSize;
  if (PAGE_SIZES.includes(pageSize) && pageSize !== pagination.pageSize) {
    pagination.pageSize = pageSize;
    updatePagination = true;
  }
  if (updateFilters || updatePagination || updateSorting) {
    state = { ...state };
    if (updateFilters) {
      state.filters = { ...filters };
    }
    if (updatePagination) {
      state.pagination = { ...pagination };
    }
    if (updateSorting) {
      state.sorting = { ...sorting };
    }
  }
  return state;
}

export default reducer;
