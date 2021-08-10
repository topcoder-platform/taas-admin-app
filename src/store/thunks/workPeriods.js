import axios from "axios";
import { navigate } from "@reach/router";
import * as actions from "store/actions/workPeriods";
import * as selectors from "store/selectors/workPeriods";
import * as services from "services/workPeriods";
import {
  SORT_BY_MAP,
  API_SORT_BY,
  DATE_FORMAT_API,
  PAYMENT_STATUS_MAP,
  API_FIELDS_QUERY,
  API_CHALLENGE_PAYMENT_STATUS,
} from "constants/workPeriods";
import {
  delay,
  extractResponseData,
  extractResponsePagination,
  replaceItems,
} from "utils/misc";
import {
  makeUrlQuery,
  normalizeBillingAccounts,
  normalizeDetailsPeriodItems,
  normalizePeriodData,
  normalizePeriodItems,
} from "utils/workPeriods";
import { makeToast } from "components/ToastrMessage";
import {
  makeToastPaymentsProcessing,
  makeToastPaymentsSuccess,
  makeToastPaymentsWarning,
  makeToastPaymentsError,
} from "routes/WorkPeriods/utils/toasts";
import { RESOURCE_BOOKING_STATUS, WORK_PERIODS_PATH } from "constants/index.js";
import { currencyFormatter } from "utils/formatters";

export const loadWorkPeriodData = (periodId) => async (dispatch, getState) => {
  let [periodsData] = selectors.getWorkPeriodsData(getState());
  periodsData[periodId]?.cancelSource?.cancel();
  const [promise, source] = services.fetchWorkPeriod(periodId);
  dispatch(actions.setWorkPeriodDataPending(periodId, source));
  let userHandle = null;
  let periodData = null;
  let errorMessage = null;
  try {
    const data = await promise;
    userHandle = data.userHandle;
    periodData = normalizePeriodData(data);
  } catch (error) {
    if (!axios.isCancel(error)) {
      errorMessage = error.toString();
    }
  }
  if (periodData) {
    dispatch(actions.setWorkPeriodDataSuccess(periodId, periodData));
    return [{ ...periodData, userHandle }, null];
  } else if (errorMessage) {
    dispatch(actions.setWorkPeriodDataError(periodId, errorMessage));
    return [null, errorMessage];
  }
  return [null, null];
};

export const loadWorkPeriodAfterPaymentCancel =
  (periodId, paymentId) => async (dispatch) => {
    let [periodData, error] = await dispatch(loadWorkPeriodData(periodId));
    if (periodData) {
      let userHandle = periodData.userHandle;
      let amount = null;
      for (let payment of periodData.payments) {
        if (payment.id === paymentId) {
          amount = currencyFormatter.format(payment.amount);
          break;
        }
      }
      makeToast(
        `Payment ${amount} for ${userHandle} was marked as "cancelled"`,
        "success"
      );
    } else if (error) {
      makeToast("Failed to reload working period data. " + error);
    }
  };

/**
 * Thunk that loads the specified working periods' page. If page number is not
 * provided the current page number from current state is used. All relevant
 * working period filters are loaded from the current state to construct
 * a request query.
 *
 * @returns {Promise}
 */
export const loadWorkPeriodsPage = async (dispatch, getState) => {
  const workPeriods = selectors.getWorkPeriodsStateSlice(getState());
  if (workPeriods.cancelSource) {
    // If there's an ongoing request we just cancel it since the data that comes
    // with its response will not correspond to application's current state,
    // namely filters and sorting.
    workPeriods.cancelSource.cancel();
  }
  const { filters, sorting, pagination } = workPeriods;

  const sortOrder = sorting.order;
  const sortBy = SORT_BY_MAP[sorting.criteria] || API_SORT_BY.USER_HANDLE;

  const { onlyFailedPayments, userHandle } = filters;
  const [startDate] = filters.dateRange;
  const paymentStatuses = replaceItems(
    Object.keys(filters.paymentStatuses),
    PAYMENT_STATUS_MAP
  );

  // For parameter description see:
  // https://topcoder-platform.github.io/taas-apis/#/ResourceBookings/get_resourceBookings
  const [promise, cancelSource] = services.fetchResourceBookings({
    fields: API_FIELDS_QUERY,
    page: pagination.pageNumber,
    perPage: pagination.pageSize,
    sortBy,
    sortOrder,
    // we only want to show Resource Bookings with status "placed"
    status: RESOURCE_BOOKING_STATUS.PLACED,
    ["workPeriods.userHandle"]: userHandle,
    ["workPeriods.startDate"]: startDate.format(DATE_FORMAT_API),
    ["workPeriods.paymentStatus"]: paymentStatuses,
    ["billingAccountId"]: filters.alertOptions.BA_NOT_ASSIGNED ? 0 : null,
    ["workPeriods.isFirstWeek"]: filters.alertOptions.ONBOARDING_WEEK
      ? true
      : null,
    ["workPeriods.isLastWeek"]: filters.alertOptions.LAST_BOOKING_WEEK
      ? true
      : null,
    ["workPeriods.payments.status"]: onlyFailedPayments
      ? API_CHALLENGE_PAYMENT_STATUS.FAILED
      : null,
  });
  dispatch(actions.loadWorkPeriodsPagePending(cancelSource));
  let totalCount, periods, pageCount;
  try {
    const response = await promise;
    ({ totalCount, pageCount } = extractResponsePagination(response));
    const data = extractResponseData(response);
    periods = normalizePeriodItems(data);
  } catch (error) {
    // If request was cancelled by the next call to loadWorkPeriodsPage
    // there's nothing more to do.
    if (!axios.isCancel(error)) {
      dispatch(actions.loadWorkPeriodsPageError(error.toString()));
    }
    return;
  }
  dispatch(
    actions.loadWorkPeriodsPageSuccess({
      periods,
      totalCount,
      pageCount,
    })
  );
};

/**
 * Updates URL from current state.
 *
 * @param {boolean} replace whether to push or replace the history state
 * @returns {function}
 */
export const updateQueryFromState =
  (replace = false) =>
  (dispatch, getState) => {
    const query = makeUrlQuery(selectors.getWorkPeriodsStateSlice(getState()));
    if (query !== window.location.search.slice(1)) {
      setTimeout(() => {
        navigate(`${WORK_PERIODS_PATH}?${query}`, { replace });
      }, 100); // if executed synchronously navigate() causes a noticable lag
    }
  };

/**
 * Thunk that either loads and displays or hides the details of the specified
 * working period.
 *
 * @param {Object} period working period object
 * @param {string} period.id working period id
 * @param {string} period.rbId resource booking id
 * @param {number|string} period.projectId resource booking's project id
 * @param {number|string} period.jobId resource booking's job id
 * @param {number} period.billingAccountId billing account id
 * @param {?boolean} [show] whether to show or hide working period details
 * @returns {function}
 */
export const toggleWorkPeriodDetails =
  (period, show = null) =>
  async (dispatch, getState) => {
    const periodsDetails = selectors.getWorkPeriodsDetails(getState());
    const periodDetails = periodsDetails[period.id];
    // If there's an ongoing request to load details for specified working
    // period we cancel this request because
    // 1. If we show details the data that will come with its response will not
    // correspond to the current state.
    // 2. If we hide details we don't need details data anyway.
    periodDetails?.cancelSource?.cancel();
    show = show === null ? !periodDetails : show;
    if (show) {
      if (periodDetails) {
        // reload details?
      } else {
        const source = axios.CancelToken.source();
        dispatch(actions.loadWorkPeriodDetailsPending(period, source));

        const [bilAccsPromise] = services.fetchBillingAccounts(
          period.projectId,
          source
        );
        bilAccsPromise
          .then((data) => {
            const accounts = normalizeBillingAccounts(data);
            dispatch(actions.loadBillingAccountsSuccess(period, accounts));
          })
          .catch((error) => {
            if (!axios.isCancel(error)) {
              dispatch(
                actions.loadBillingAccountsError(period, error.toString())
              );
            }
          });

        const [periodsPromise] = services.fetchWorkPeriods(period.rbId, source);
        let details = null;
        let errorMessage = null;
        try {
          const data = await periodsPromise;
          const periods = normalizeDetailsPeriodItems(data);
          details = { periods };
        } catch (error) {
          if (!axios.isCancel(error)) {
            errorMessage = error.toString();
          }
        }
        if (details) {
          dispatch(actions.loadWorkPeriodDetailsSuccess(period.id, details));
        } else if (errorMessage) {
          dispatch(actions.loadWorkPeriodDetailsError(period.id, errorMessage));
          makeToast(errorMessage);
        }
      }
    } else {
      dispatch(actions.hideWorkPeriodDetails(period.id));
    }
  };

/**
 * A thunk that updates the billing accounts for all the payments from the
 * specific working period.
 *
 * @param {string} periodId working period id
 * @param {number} billingAccountId desired billing account id
 * @param {number} [periodDataDelay] timeout after which the period data gets
 * reloaded
 * @returns {function}
 */
export const updatePaymentsBillingAccount =
  (periodId, billingAccountId, periodDataDelay = 3000) =>
  async (dispatch, getState) => {
    let [periodsData] = selectors.getWorkPeriodsData(getState());
    let periodData = periodsData[periodId];
    if (!periodData) {
      return;
    }
    let paymentsToUpdate = [];
    for (let payment of periodData.payments) {
      if (payment.billingAccountId !== billingAccountId) {
        paymentsToUpdate.push({ id: payment.id, billingAccountId });
      }
    }
    if (!paymentsToUpdate.length) {
      makeToast(
        "All payments have desired billing account. Nothing to update.",
        "success"
      );
      return true;
    }
    let paymentsData = null;
    let errorMessage = null;
    try {
      paymentsData = await services.patchWorkPeriodPayments(paymentsToUpdate);
    } catch (error) {
      errorMessage = error.toString();
    }
    if (errorMessage) {
      makeToast(errorMessage);
      return false;
    }
    await delay(periodDataDelay);
    [periodData, errorMessage] = await dispatch(loadWorkPeriodData(periodId));
    if (errorMessage) {
      makeToast("Failed to reload payments' data. " + errorMessage);
    } else if (periodData) {
      paymentsData = periodData.payments;
    }
    let paymentsNotUpdated = [];
    for (let payment of paymentsData) {
      if (payment.billingAccountId !== billingAccountId) {
        paymentsNotUpdated.push(payment);
      }
    }
    if (paymentsNotUpdated.length) {
      makeToast("Could not update billing account for some payments.");
      return false;
    }
    makeToast(
      "Billing account was successfully updated for all the payments.",
      "success"
    );
    return true;
  };

/**
 *
 * @param {string} rbId
 * @param {number} billingAccountId
 * @returns {function}
 */
export const updateWorkPeriodBillingAccount =
  (rbId, billingAccountId) => async () => {
    try {
      await services.patchWorkPeriodBillingAccount(rbId, billingAccountId);
    } catch (error) {
      makeToast(
        `Failed to update billing account for resource booking ${rbId}.\n` +
          error.toString()
      );
    }
  };

/**
 * Sends an update request to the server to update the number of working
 * period's working days. The working period is also updated with the data
 * from response.
 *
 * @param {string} periodId working period id
 * @param {number} daysWorked working period's working days
 * @returns {function}
 */
export const updateWorkPeriodWorkingDays =
  (periodId, daysWorked) => async (dispatch, getState) => {
    let [periodsData] = selectors.getWorkPeriodsData(getState());
    periodsData[periodId]?.cancelSource?.cancel();
    const [promise, source] = services.patchWorkPeriodWorkingDays(
      periodId,
      daysWorked
    );
    dispatch(actions.setWorkPeriodWorkingDaysPending(periodId, source));
    let periodData = null;
    let errorMessage = null;
    try {
      const data = await promise;
      periodData = normalizePeriodData(data);
    } catch (error) {
      if (!axios.isCancel(error)) {
        errorMessage = error.toString();
        makeToast(
          `Failed to update working days for working period ${periodId}.\n` +
            errorMessage
        );
      }
    }
    [periodsData] = selectors.getWorkPeriodsData(getState());
    const currentDaysWorked = periodsData[periodId]?.daysWorked;
    // If periodData is null it means the request was cancelled right before
    // another request was sent and so we don't need to update the state.
    // If periodData's daysWorked is not equal to the current daysWorked
    // it means that the state was changed while the data was in transit
    // and there will be a new request at the end of which the period's data
    // will be updated so again we don't need to update the state.
    if (periodData && periodData.daysWorked === currentDaysWorked) {
      dispatch(actions.setWorkPeriodWorkingDaysSuccess(periodId, periodData));
    } else if (errorMessage) {
      dispatch(actions.setWorkPeriodWorkingDaysError(periodId, errorMessage));
    }
  };

/**
 * Sends request to process payments for selected working periods.
 *
 * @param {function} dispatch redux store dispatch function
 * @param {function} getState function returning redux store root state
 */
export const processPayments = async (dispatch, getState) => {
  const state = getState();
  const isProcessing = selectors.getWorkPeriodsIsProcessingPayments(state);
  if (isProcessing) {
    return;
  }
  dispatch(actions.toggleWorkPeriodsProcessingPayments(true));
  const isSelectedAll = selectors.getWorkPeriodsIsSelectedAll(state);
  const { pageSize, totalCount } = selectors.getWorkPeriodsPagination(state);
  const promise =
    isSelectedAll && totalCount > pageSize
      ? processPaymentsAll(dispatch, getState)
      : processPaymentsSpecific(dispatch, getState);
  // The promise returned by processPaymentsAll or processPaymentsSpecific
  // should never be rejected but adding try-catch block just in case.
  try {
    await promise;
  } catch (error) {
    console.error(error);
  }
  dispatch(actions.toggleWorkPeriodsProcessingPayments(false));
};

const processPaymentsAll = async (dispatch, getState) => {
  const state = getState();
  const filters = selectors.getWorkPeriodsFilters(state);
  const [startDate] = filters.dateRange;
  const paymentStatuses = replaceItems(
    Object.keys(filters.paymentStatuses),
    PAYMENT_STATUS_MAP
  );
  const totalCount = selectors.getWorkPeriodsTotalCount(state);
  makeToastPaymentsProcessing(totalCount);
  const promise = services.postWorkPeriodsPaymentsAll({
    status: RESOURCE_BOOKING_STATUS.PLACED,
    ["workPeriods.userHandle"]: filters.userHandle,
    ["workPeriods.startDate"]: startDate.format(DATE_FORMAT_API),
    ["workPeriods.paymentStatus"]: paymentStatuses,
  });
  let data = null;
  let errorMessage = null;
  try {
    data = await promise;
  } catch (error) {
    errorMessage = error.toString();
  }
  dispatch(actions.toggleWorkingPeriodsAll(false));
  if (data) {
    const { totalSuccess, totalError } = data;
    const resourcesSucceededCount = +totalSuccess;
    const resourcesFailedCount = +totalError;
    if (resourcesSucceededCount) {
      if (resourcesFailedCount) {
        makeToastPaymentsWarning({
          resourcesSucceededCount,
          resourcesFailedCount,
        });
      } else {
        makeToastPaymentsSuccess(resourcesSucceededCount);
      }
    } else {
      makeToastPaymentsError(resourcesFailedCount);
    }
  } else {
    makeToast(errorMessage);
  }
};

const processPaymentsSpecific = async (dispatch, getState) => {
  const state = getState();
  const [periodsSelectedSet] = selectors.getWorkPeriodsSelected(state);
  const payments = [];
  for (let workPeriodId of periodsSelectedSet) {
    payments.push({ workPeriodId });
  }
  makeToastPaymentsProcessing(payments.length);
  let results = null;
  let errorMessage = null;
  try {
    results = await services.postWorkPeriodsPayments(payments);
  } catch (error) {
    errorMessage = error.toString();
  }
  if (results) {
    const periodsToHighlight = {};
    const resourcesSucceeded = [];
    const resourcesFailed = [];
    for (let result of results) {
      let error = result.error;
      periodsToHighlight[result.workPeriodId] = error;
      if (error) {
        resourcesFailed.push(result);
      } else {
        resourcesSucceeded.push(result);
      }
    }
    // highlights failed periods and deselects successful periods
    dispatch(actions.highlightFailedWorkPeriods(periodsToHighlight));
    if (resourcesSucceeded.length) {
      if (resourcesFailed.length) {
        makeToastPaymentsWarning({
          resourcesSucceededCount: resourcesSucceeded.length,
          resourcesFailedCount: resourcesFailed.length,
        });
      } else {
        makeToastPaymentsSuccess(resourcesSucceeded.length);
      }
    } else {
      makeToastPaymentsError(resourcesFailed.length);
    }
  } else {
    makeToast(errorMessage);
  }
};

/**
 * Sends request to process the payment and shows success or error toastrs.
 *
 * @param {string} workPeriodId working period id
 * @param {number} amount the amount of payment
 * @returns (function)
 */
export const processAdditionalPayment = (workPeriodId, amount) => async () => {
  const promise = services.postWorkPeriodPayment({
    workPeriodId,
    days: 0,
    amount,
  });
  try {
    await promise;
  } catch (error) {
    makeToast(error.toString());
    throw error;
  }
  makeToast("Additional payment scheduled for resource", "success");
};
