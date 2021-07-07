import axios, { CancelToken } from "./axios";
import {
  API_CHALLENGE_PAYMENT_STATUS,
  API_QUERY_PARAM_NAMES,
  JOBS_API_URL,
  PAYMENTS_API_URL,
  PROJECTS_API_URL,
  RB_API_URL,
  TAAS_TEAM_API_URL,
  WORK_PERIODS_API_URL,
} from "constants/workPeriods";
import { buildRequestQuery, extractResponseData } from "utils/misc";

/**
 * Fetches job name by job id.
 *
 * @param {number|string} jobId job id
 * @param {Object} [source] axios cancel token source
 * @returns {[Promise, Object]}
 */
export const fetchJob = (jobId, source) => {
  if (!source) {
    source = CancelToken.source();
  }
  return [
    axios
      .get(`${JOBS_API_URL}/${jobId}`, {
        cancelToken: source.token,
      })
      .then(extractResponseData),
    source,
  ];
};

/**
 * Fetches project data by project id.
 *
 * @param {number} projectId project id
 * @returns {Promise}
 */
export const fetchProject = (projectId) => {
  return axios
    .get(`${TAAS_TEAM_API_URL}/${projectId}`)
    .then(extractResponseData);
};

/**
 * Fetches billing accounts for specific project id.
 *
 * @param {number|string} projectId resource booking's project id
 * @param {Object} [source] axios cancel token source
 * @returns {[Promise, Object]}
 */
export const fetchBillingAccounts = (projectId, source) => {
  if (!source) {
    source = CancelToken.source();
  }
  return [
    axios
      .get(`${PROJECTS_API_URL}/${projectId}/billingAccounts`, {
        cancelToken: source.token,
      })
      .then(extractResponseData),
    source,
  ];
};

/**
 * Fetches working periods for specific resource booking.
 *
 * @param {string} rbId ResourceBooking id
 * @param {Object} [source] optioinal cancel token source
 * @returns {[Promise, Object]}
 */
export const fetchWorkPeriods = (rbId, source) => {
  if (!source) {
    source = CancelToken.source();
  }
  return [
    axios
      // sort by `startDate` just for comfort - so it's easier to check request in the Dev Tools
      // we get 10000 records to see all the records for now, but we have to improve this
      .get(
        `${WORK_PERIODS_API_URL}/?resourceBookingIds=${rbId}&sortBy=startDate&sortOrder=asc&perPage=10000`,
        {
          cancelToken: source.token,
        }
      )
      .then(extractResponseData),
    source,
  ];
};

/**
 * Fetches working periods using provided parameters.
 *
 * @param {Object} params object containing query parameters
 * @returns {[Promise, Object]}
 */
export const fetchResourceBookings = (params) => {
  const source = CancelToken.source();
  return [
    axios.get(
      `${RB_API_URL}?${buildRequestQuery(params, API_QUERY_PARAM_NAMES)}`,
      { cancelToken: source.token }
    ),
    source,
  ];
};

export const fetchWorkPeriod = (periodId) => {
  const source = CancelToken.source();
  return [
    axios
      .get(`${WORK_PERIODS_API_URL}/${periodId}`, { cancelToken: source.token })
      .then(extractResponseData),
    source,
  ];
};

/**
 * Updates working period's working days.
 *
 * @param {string} periodId working period id
 * @param {number} daysWorked new number of working days
 * @returns {[Promise, Object]}
 */
export const patchWorkPeriodWorkingDays = (periodId, daysWorked) => {
  const source = CancelToken.source();
  return [
    axios
      .patch(
        `${WORK_PERIODS_API_URL}/${periodId}`,
        { daysWorked },
        { cancelToken: source.token }
      )
      .then(extractResponseData),
    source,
  ];
};

/**
 * Updates billing account id for resource booking with the specified id.
 *
 * @param {string} rbId resource booking id
 * @param {number} billingAccountId billing account id
 * @returns {Promise}
 */
export const patchWorkPeriodBillingAccount = (rbId, billingAccountId) => {
  return axios.patch(`${RB_API_URL}/${rbId}`, { billingAccountId });
};

/**
 * Sends request to cancel specific working period's payment.
 *
 * @param {string} paymentId payment id
 * @returns {Promise}
 */
export const cancelWorkPeriodPayment = (paymentId) => {
  return axios
    .patch(`${PAYMENTS_API_URL}/${paymentId}`, {
      status: API_CHALLENGE_PAYMENT_STATUS.CANCELLED,
    })
    .then(extractResponseData);
};

/**
 * Sends request to queue payments for specific working periods and amounts
 * inside the provided array.
 *
 * @param {Array} payments
 * @returns {Promise}
 */
export const postWorkPeriodsPayments = (payments) => {
  return axios.post(`${PAYMENTS_API_URL}`, payments).then(extractResponseData);
};

/**
 * Sends request to schedule payments for working periods satisfying
 * the provided query. See
 * https://topcoder-platform.github.io/taas-apis/#/WorkPeriodPayments/post_work_period_payments_query
 *
 * @param {Object} query query object
 * @returns {Promise}
 */
export const postWorkPeriodsPaymentsAll = (query) => {
  for (let key in query) {
    let value = query[key];
    if (typeof value !== "number" && !value) {
      delete query[key];
      continue;
    }
    if (Array.isArray(value)) {
      if (value.length) {
        query[key] = value.join(",");
      } else {
        delete query[key];
      }
    }
  }
  return axios
    .post(`${PAYMENTS_API_URL}/query`, { query })
    .then(extractResponseData);
};
