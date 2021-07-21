import moment from "moment";
import * as ACTION_TYPE from "store/actionTypes/workPeriods";
import {
  BILLING_ACCOUNTS_NONE,
  BILLING_ACCOUNTS_LOADING,
  BILLING_ACCOUNTS_ERROR,
  PAYMENT_STATUS,
  SORT_BY,
  SORT_BY_DEFAULT,
  SORT_ORDER,
  SORT_ORDER_DEFAULT,
  URL_QUERY_PARAM_MAP,
  REASON_DISABLED,
  ALERT,
} from "constants/workPeriods";
import {
  filterPeriodsByStartDate,
  getWeekByDate,
  updateOptionMap,
} from "utils/misc";
import {
  addValueImmutable,
  computeDaysWorkedMax,
  createPeriodAlerts,
  createAssignedBillingAccountOption,
  findReasonsDisabled,
  removeValueImmutable,
} from "utils/workPeriods";

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

const initPeriodData = (period) => {
  const data = period.data;
  data.cancelSource = null;
  data.daysWorkedIsUpdated = false;
  return data;
};

const initPeriodDetails = (
  billingAccountId = 0,
  cancelSource = cancelSourceDummy
) => ({
  cancelSource,
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
  periodsAlerts: {},
  periodsById: {},
  periodsData: [{}],
  periodsDetails: {},
  periodsDisabled: [new Map()],
  periodsFailed: {},
  periodsSelected: [new Set()],
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
    periodsAlerts: {},
    periodsById: {},
    periodsData: [{}],
    periodsDetails: {},
    periodsDisabled: [new Map()],
    periodsFailed: {},
    periodsSelected: [new Set()],
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
    const periodsAlerts = {};
    const periodsById = {};
    const periodsData = {};
    const periodsDisabledMap = new Map();
    const dateRange = state.filters.dateRange;
    const periodStart = dateRange[0];
    const periodEnd = dateRange[1];
    for (let period of periods) {
      periodsById[period.id] = true;
      let periodData = initPeriodData(period);
      periodData.daysWorkedMax = computeDaysWorkedMax(
        period.bookingStart,
        period.bookingEnd,
        periodStart,
        periodEnd
      );
      periodsData[period.id] = periodData;
      let reasonsDisabled = findReasonsDisabled(period, dateRange);
      if (reasonsDisabled) {
        periodsDisabledMap.set(period.id, reasonsDisabled);
      }
      let alerts = createPeriodAlerts(period, periodEnd);
      if (alerts) {
        periodsAlerts[period.id] = alerts;
      }
      delete period.data;
    }
    return {
      ...state,
      cancelSource: null,
      error: null,
      pagination,
      periods,
      periodsAlerts,
      periodsById,
      periodsData: [periodsData],
      periodsDisabled: [periodsDisabledMap],
    };
  },
  [ACTION_TYPE.WP_LOAD_PAGE_ERROR]: (state, error) => {
    console.error(error.message);
    return {
      ...state,
      cancelSource: null,
      error: error.message,
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
    const periodsFailed = {};
    const periodsSelectedSet = state.periodsSelected[0];
    const oldPeriodsSelectedCount = periodsSelectedSet.size;
    for (let periodId of periodIds) {
      let error = periods[periodId];
      if (error) {
        periodsFailed[periodId] = error;
        periodsSelectedSet.add(periodId);
      } else {
        periodsSelectedSet.delete(periodId);
      }
    }
    state = {
      ...state,
      periodsFailed,
    };
    if (periodsSelectedSet.size !== oldPeriodsSelectedCount) {
      state.periodsSelected = [periodsSelectedSet];
      updateSelectedPeriodsFlags(state);
    }
    return state;
  },
  [ACTION_TYPE.WP_LOAD_PERIOD_DETAILS_PENDING]: (
    state,
    { period, cancelSource }
  ) => {
    const periodsDetails = { ...state.periodsDetails };
    periodsDetails[period.id] = initPeriodDetails(
      period.billingAccountId,
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
    const periodsDetails = state.periodsDetails;
    let periodDetails = periodsDetails[periodId];
    // period details object must already be initialized
    if (!periodDetails) {
      // This branch should not be reachable but just in case.
      return state;
    }
    const periods = state.periods;
    let period = null;
    for (let i = 0, len = periods.length; i < len; i++) {
      period = periods[i];
      if (period.id === periodId) {
        break;
      }
    }
    const { bookingStart, bookingEnd } = period;
    const periodsData = state.periodsData[0];
    for (let period of details.periods) {
      let periodData = initPeriodData(period);
      periodData.daysWorkedMax = computeDaysWorkedMax(
        bookingStart,
        bookingEnd,
        period.start,
        period.end
      );
      periodsData[period.id] = periodData;
      delete period.data;
    }
    periodDetails = {
      ...periodDetails,
      periods: details.periods,
      periodsIsLoading: false,
    };
    if (!periodDetails.billingAccountsIsLoading) {
      periodDetails.cancelSource = null;
    }
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
      periodsDetails: { ...periodsDetails },
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
  [ACTION_TYPE.WP_LOAD_BILLING_ACCOUNTS_SUCCESS]: (
    state,
    { period, accounts }
  ) => {
    const periodsDetails = state.periodsDetails;
    let periodDetails = periodsDetails[period.id];
    if (!periodDetails) {
      // Period details may be removed at this point so we must handle this case.
      return state;
    }
    let accountId = period.billingAccountId;
    let hasAssignedAccount = false;
    for (let account of accounts) {
      if (account.value === accountId) {
        hasAssignedAccount = true;
        break;
      }
    }
    if (accountId > 0 && !hasAssignedAccount) {
      accounts.unshift(createAssignedBillingAccountOption(accountId));
    }
    let billingAccountsIsDisabled = false;
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
    if (!periodDetails.periodsIsLoading) {
      periodDetails.cancelSource = null;
    }
    periodsDetails[period.id] = periodDetails;
    return {
      ...state,
      periodsDetails: { ...periodsDetails },
    };
  },
  [ACTION_TYPE.WP_LOAD_BILLING_ACCOUNTS_ERROR]: (
    state,
    { period, message }
  ) => {
    const periodsDetails = state.periodsDetails;
    let periodDetails = periodsDetails[period.id];
    if (!periodDetails) {
      return state;
    }
    let billingAccounts = [];
    let billingAccountsIsDisabled = true;
    let accountId = period.billingAccountId;
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
    if (!periodDetails.periodsIsLoading) {
      periodDetails.cancelSource = null;
    }
    periodsDetails[period.id] = periodDetails;
    return {
      ...state,
      periodsDetails: { ...periodsDetails },
    };
  },
  [ACTION_TYPE.WP_SET_BILLING_ACCOUNT]: (state, { periodId, accountId }) => {
    const periods = state.periods;
    for (let i = 0, len = periods.length; i < len; i++) {
      let period = periods[i];
      if (period.id === periodId) {
        periods[i] = { ...period, billingAccountId: accountId };
        break;
      }
    }
    state = {
      ...state,
      periods: [...periods],
    };
    // updating reasons for which the period's selection may be disabled
    const periodsDisabledMap = state.periodsDisabled[0];
    const oldReasonsDisabled = periodsDisabledMap.get(periodId);
    const reasonsDisabled = removeValueImmutable(
      oldReasonsDisabled,
      REASON_DISABLED.NO_BILLING_ACCOUNT
    );
    if (oldReasonsDisabled !== reasonsDisabled) {
      if (reasonsDisabled) {
        periodsDisabledMap.set(periodId, reasonsDisabled);
      } else {
        periodsDisabledMap.delete(periodId);
      }
      state.periodsDisabled = [periodsDisabledMap];
      updateSelectedPeriodsFlags(state);
    }
    // updating period's alerts
    const periodsAlerts = state.periodsAlerts;
    const oldAlerts = periodsAlerts[periodId];
    const alerts = removeValueImmutable(oldAlerts, ALERT.BA_NOT_ASSIGNED);
    if (oldAlerts !== alerts) {
      if (alerts) {
        periodsAlerts[periodId] = alerts;
      } else {
        delete periodsAlerts[periodId];
      }
      state.periodsAlerts = { ...periodsAlerts };
    }
    return state;
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
    const periodData = periodsData[periodId];
    if (!periodData) {
      return state;
    }
    daysWorked = Math.min(
      Math.max(daysWorked, periodData.daysPaid),
      periodData.daysWorkedMax
    );
    if (daysWorked === periodData.daysWorked) {
      return state;
    }
    periodsData[periodId] = { ...periodData, daysWorked };
    state = {
      ...state,
      periodsData: [periodsData],
    };
    return periodId in state.periodsById
      ? updateStateAfterWorkingDaysChange(periodId, state)
      : state;
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
    const periodsSelectedSet = state.periodsSelected[0];
    for (let periodId in periods) {
      if (periods[periodId] === true) {
        periodsSelectedSet.add(periodId);
      } else {
        periodsSelectedSet.delete(periodId);
      }
    }
    state = {
      ...state,
      periodsSelected: [periodsSelectedSet],
    };
    return updateSelectedPeriodsFlags(state);
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
    let periodData = periodsData[periodId];
    if (!periodData) {
      return state;
    }
    periodsData[periodId] = {
      ...periodData,
      ...data,
      cancelSource: null,
    };
    state = {
      ...state,
      periodsData: [periodsData],
    };
    return periodId in state.periodsById
      ? updateStateAfterWorkingDaysChange(periodId, state)
      : state;
  },
  [ACTION_TYPE.WP_SET_PERIOD_DATA_ERROR]: (state, { periodId, message }) => {
    console.error(message);
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
  [ACTION_TYPE.WP_SET_PAYMENT_DATA]: (state, paymentData) => {
    const periodId = paymentData.workPeriodId;
    const periodsData = state.periodsData[0];
    const periodData = periodsData[periodId];
    if (!periodData) {
      return state;
    }
    const paymentId = paymentData.id;
    const payments = periodData.payments;
    let lastFailedPayment = null;
    for (let i = 0, len = payments.length; i < len; i++) {
      let payment = payments[i];
      if (payment.id === paymentId) {
        payments[i] = paymentData;
        periodData.payments = [...payments];
      }
      if (payment.status === PAYMENT_STATUS.FAILED) {
        lastFailedPayment = payment;
      }
    }
    periodsData[periodId] = {
      ...periodData,
      paymentErrorLast: lastFailedPayment?.statusDetails,
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
    daysWorked = Math.min(
      Math.max(daysWorked, periodData.daysPaid),
      periodData.daysWorkedMax
    );
    if (daysWorked === periodData.daysWorked) {
      return state;
    }
    periodsData[periodId] = { ...periodData, daysWorked };
    return updateStateAfterWorkingDaysChange(periodId, {
      ...state,
      periodsData: [periodsData],
    });
  },
  [ACTION_TYPE.WP_SET_WORKING_DAYS_PENDING]: (
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
      daysWorkedIsUpdated: false,
    };
    return {
      ...state,
      periodsData: [periodsData],
    };
  },
  [ACTION_TYPE.WP_SET_WORKING_DAYS_SUCCESS]: (state, { periodId, data }) => {
    const periodsData = state.periodsData[0];
    let periodData = periodsData[periodId];
    if (!periodData) {
      return state;
    }
    periodData = periodsData[periodId] = {
      ...periodData,
      ...data,
      cancelSource: null,
      daysWorkedIsUpdated: true,
    };
    state = {
      ...state,
      periodsData: [periodsData],
    };
    return periodId in state.periodsById
      ? updateStateAfterWorkingDaysChange(periodId, state)
      : state;
  },
  [ACTION_TYPE.WP_SET_WORKING_DAYS_ERROR]: (state, { periodId, message }) => {
    console.error(message);
    const periodsData = state.periodsData[0];
    const periodData = periodsData[periodId];
    if (!periodData) {
      return state;
    }
    periodsData[periodId] = {
      ...periodData,
      cancelSource: null,
      daysWorkedIsUpdated: false,
    };
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
    const periodsSelectedSet = state.periodsSelected[0];
    if (periodsSelectedSet.has(periodId)) {
      periodsSelectedSet.delete(periodId);
    } else {
      periodsSelectedSet.add(periodId);
    }
    return updateSelectedPeriodsFlags({
      ...state,
      periodsSelected: [periodsSelectedSet],
    });
  },
  [ACTION_TYPE.WP_TOGGLE_PERIODS_ALL]: (state, on) => {
    const periodsSelectedSet = new Set();
    const isSelected = on === null ? !state.isSelectedPeriodsAll : on;
    if (isSelected) {
      const periodsDisabledMap = state.periodsDisabled[0];
      for (let period of state.periods) {
        let periodId = period.id;
        if (!periodsDisabledMap.has(periodId)) {
          periodsSelectedSet.add(periodId);
        }
      }
    }
    return {
      ...state,
      periodsSelected: [periodsSelectedSet],
      isSelectedPeriodsAll: isSelected,
      isSelectedPeriodsVisible: isSelected,
    };
  },
  [ACTION_TYPE.WP_TOGGLE_PERIODS_VISIBLE]: (state, on) => {
    const periodsSelectedSet = new Set();
    let isSelectedPeriodsAll = false;
    const isSelectedPeriodsVisible =
      on === null ? !state.isSelectedPeriodsVisible : on;
    if (isSelectedPeriodsVisible) {
      const periodsDisabledMap = state.periodsDisabled[0];
      for (let period of state.periods) {
        let periodId = period.id;
        if (!periodsDisabledMap.has(periodId)) {
          periodsSelectedSet.add(periodId);
        }
      }
      isSelectedPeriodsAll =
        state.periods.length === state.pagination.totalCount;
    }
    return {
      ...state,
      periodsSelected: [periodsSelectedSet],
      isSelectedPeriodsAll,
      isSelectedPeriodsVisible,
    };
  },
  [ACTION_TYPE.WP_TOGGLE_WORKING_DAYS_UPDATED]: (state, { periodId, on }) => {
    const periodsData = state.periodsData[0];
    const periodData = periodsData[periodId];
    if (!periodData || periodData.daysWorkedIsUpdated === on) {
      return state;
    }
    periodsData[periodId] = {
      ...periodData,
      daysWorkedIsUpdated: on,
    };
    return {
      ...state,
      periodsData: [periodsData],
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

function updateStateAfterWorkingDaysChange(periodId, state) {
  const periodData = state.periodsData[0][periodId];
  const periodsDisabledMap = state.periodsDisabled[0];
  const oldReasonsDisabled = periodsDisabledMap.get(periodId);
  let reasonsDisabled =
    periodData.daysWorked === periodData.daysPaid
      ? addValueImmutable(
          oldReasonsDisabled,
          REASON_DISABLED.NO_DAYS_TO_PAY_FOR
        )
      : removeValueImmutable(
          oldReasonsDisabled,
          REASON_DISABLED.NO_DAYS_TO_PAY_FOR
        );
  if (oldReasonsDisabled !== reasonsDisabled) {
    const periodsSelectedSet = state.periodsSelected[0];
    const oldPeriodsSelectedCount = periodsSelectedSet.size;
    if (reasonsDisabled) {
      periodsDisabledMap.set(periodId, reasonsDisabled);
      periodsSelectedSet.delete(periodId);
    } else {
      periodsDisabledMap.delete(periodId);
    }
    state.periodsDisabled = [periodsDisabledMap];
    if (periodsSelectedSet.size !== oldPeriodsSelectedCount) {
      state.periodsSelected = [periodsSelectedSet];
    }
    updateSelectedPeriodsFlags(state);
  }
  return state;
}

function updateSelectedPeriodsFlags(state) {
  let isSelectedPeriodsAll = state.isSelectedPeriodsAll;
  let isSelectedPeriodsVisible = state.isSelectedPeriodsVisible;
  const selectedCount = state.periodsSelected[0].size;
  const pageSize = state.pagination.pageSize;
  const totalCount = state.pagination.totalCount;
  const maxSelectedOnPageCount =
    Math.min(pageSize, totalCount) - state.periodsDisabled[0].size;
  if (totalCount > pageSize) {
    if (selectedCount === maxSelectedOnPageCount) {
      isSelectedPeriodsVisible = true;
    } else {
      isSelectedPeriodsAll = false;
      isSelectedPeriodsVisible = false;
    }
  } else if (selectedCount === maxSelectedOnPageCount) {
    isSelectedPeriodsAll = true;
    isSelectedPeriodsVisible = true;
  } else {
    isSelectedPeriodsAll = false;
    isSelectedPeriodsVisible = false;
  }
  state.isSelectedPeriodsAll = isSelectedPeriodsAll;
  state.isSelectedPeriodsVisible = isSelectedPeriodsVisible;
  return state;
}

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
