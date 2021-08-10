import * as ACTION_TYPE from "store/actionTypes/workPeriods";

// Used to generate unique error ids.
let nextErrorId = 1;

/**
 * Creates an action denoting the start of loading specific working period page.
 *
 * @param {Object} cancelSource object that can be used to cancel network request
 * @returns {Object}
 */
export const loadWorkPeriodsPagePending = (cancelSource) => ({
  type: ACTION_TYPE.WP_LOAD_PAGE_PENDING,
  payload: cancelSource,
});

/**
 * Creates an action denoting the saving of fetched working periods' page.
 *
 * @param {Object} payload action payload
 * @param {Array} payload.periods array of working period objects
 * @param {number} payload.totalCount total number of periods for current filters' state
 * @param {number} payload.pageCount total number of pages
 * @returns {Object}
 */
export const loadWorkPeriodsPageSuccess = (payload) => ({
  type: ACTION_TYPE.WP_LOAD_PAGE_SUCCESS,
  payload,
});

/**
 * Creates an action denoting the occurrence of an error while loading working
 * periods.
 *
 * @param {string} message error message
 * @returns {Object}
 */
export const loadWorkPeriodsPageError = (message) => ({
  type: ACTION_TYPE.WP_LOAD_PAGE_ERROR,
  payload: { message, id: nextErrorId++ },
});

/**
 * Creates an action to hide specific working period details.
 *
 * @param {string} periodId working period id
 * @returns {Object}
 */
export const hideWorkPeriodDetails = (periodId) => ({
  type: ACTION_TYPE.WP_HIDE_PERIOD_DETAILS,
  payload: periodId,
});

/**
 * Creates an action denoting the loading of working period's details.
 *
 * @param {Object} period working period object with basic data such as id,
 * rbId, jobId, billingAccountId and etc
 * @param {Object} cancelSource axios cancel token source
 * @returns {Object}
 */
export const loadWorkPeriodDetailsPending = (period, cancelSource) => ({
  type: ACTION_TYPE.WP_LOAD_PERIOD_DETAILS_PENDING,
  payload: { period, cancelSource },
});

/**
 * Creates an action denoting successful loading of working period details.
 *
 * @param {string} periodId working period id
 * @param {Object} details working period details object
 * @returns {Object}
 */
export const loadWorkPeriodDetailsSuccess = (periodId, details) => ({
  type: ACTION_TYPE.WP_LOAD_PERIOD_DETAILS_SUCCESS,
  payload: { periodId, details },
});

/**
 * Creates an action denoting the occurrence of an error while loading
 * working period details.
 *
 * @param {string} periodId work period id
 * @param {string} message error message
 * @returns {Object}
 */
export const loadWorkPeriodDetailsError = (periodId, message) => ({
  type: ACTION_TYPE.WP_LOAD_PERIOD_DETAILS_ERROR,
  payload: { periodId, message, id: nextErrorId++ },
});

/**
 * Creates an action denoting successful load of billing accounts.
 *
 * @param {Object} period working period basic data object
 * @param {Array} accounts billing accounts
 * @returns {Object}
 */
export const loadBillingAccountsSuccess = (period, accounts) => ({
  type: ACTION_TYPE.WP_LOAD_BILLING_ACCOUNTS_SUCCESS,
  payload: { period, accounts },
});

/**
 * Creates an action denoting an error while loading billing accounts.
 *
 * @param {Object} period working period basic data object
 * @param {string} message error message
 * @returns {Object}
 */
export const loadBillingAccountsError = (period, message) => ({
  type: ACTION_TYPE.WP_LOAD_BILLING_ACCOUNTS_ERROR,
  payload: { period, message, id: nextErrorId++ },
});

/**
 * Creates an action denoting the change of billing account.
 *
 * @param {string} periodId working period id
 * @param {number|string} accountId billing account id
 * @returns {Object}
 */
export const setBillingAccount = (periodId, accountId) => ({
  type: ACTION_TYPE.WP_SET_BILLING_ACCOUNT,
  payload: { periodId, accountId },
});

/**
 * Creates an action denoting the change of working period's working days in
 * details view.
 *
 * @param {string} periodId working period id
 * @param {number} daysWorked number of working days
 * @returns {Object}
 */
export const setDetailsWorkingDays = (periodId, daysWorked) => ({
  type: ACTION_TYPE.WP_SET_DETAILS_WORKING_DAYS,
  payload: { periodId, daysWorked },
});

/**
 * Creates an action denoting the hiding or showing past working periods.
 *
 * @param {string} periodId working period id
 * @param {boolean} hide whether to hide or show past working periods
 * @returns {Object}
 */
export const setDetailsHidePastPeriods = (periodId, hide) => ({
  type: ACTION_TYPE.WP_SET_DETAILS_HIDE_PAST_PERIODS,
  payload: { periodId, hide },
});

/**
 * Creates an action to reset working periods' filters.
 *
 * @returns {Object}
 */
export const resetWorkPeriodsFilters = () => ({
  type: ACTION_TYPE.WP_RESET_FILTERS,
});

/**
 * Creates an action denoting the selection/deselection of specified
 * working periods.
 *
 * @param {Object} periods object with period ids as keys and booleans as values
 * @returns {Object}
 */
export const selectWorkPeriods = (periods) => ({
  type: ACTION_TYPE.WP_SELECT_PERIODS,
  payload: periods,
});

/**
 * Creates an action that should result in deselecting working periods for which
 * the payments were successfully scheduled and in highlighting those working
 * periods for which the payments were failed to be scheduled.
 *
 * @param {Object} periods object with period ids as keys and booleans as values
 * @returns {Object}
 */
export const highlightFailedWorkPeriods = (periods) => ({
  type: ACTION_TYPE.WP_HIGHLIGHT_FAILED_PERIODS,
  payload: periods,
});

/**
 * Creates an action denoting the changing of working periods' page number.
 *
 * @param {number} pageNumber number of pages
 * @returns {Object}
 */
export const setWorkPeriodsPageNumber = (pageNumber) => ({
  type: ACTION_TYPE.WP_SET_PAGE_NUMBER,
  payload: pageNumber,
});

/**
 * Creates an action denoting the changing of working periods' page size.
 *
 * @param {number} pageSize number of pages
 * @returns {Object}
 */
export const setWorkPeriodsPageSize = (pageSize) => ({
  type: ACTION_TYPE.WP_SET_PAGE_SIZE,
  payload: pageSize,
});

/**
 * Creates an action denoting the changing of working periods' start
 * and end date using the provided date.
 *
 * @param {Object} date selected date
 * @returns {Object}
 */
export const setWorkPeriodsDateRange = (date) => ({
  type: ACTION_TYPE.WP_SET_DATE_RANGE,
  payload: date,
});

/**
 * Creates an action denoting the changing of working periods' sort criteria.
 *
 * @param {string} sortBy working periods' sort criteria
 * @returns {Object}
 */
export const setWorkPeriodsSortBy = (sortBy) => ({
  type: ACTION_TYPE.WP_SET_SORT_BY,
  payload: sortBy,
});

/**
 * Creates an action denoting the changing of working periods' sort order.
 *
 * @param {string} sortOrder working periods' sort criteria
 * @returns {Object}
 */
export const setWorkPeriodsSortOrder = (sortOrder) => ({
  type: ACTION_TYPE.WP_SET_SORT_ORDER,
  payload: sortOrder,
});

/**
 * Creates an action to set working periods' sorting.
 *
 * @param {Object} payload sorting data
 * @param {string} payload.sortBy sorting criteria
 * @param {string} payload.sortOrder sorting order
 * @returns {Object}
 */
export const setWorkPeriodsSorting = (payload) => ({
  type: ACTION_TYPE.WP_SET_SORTING,
  payload,
});

/**
 * Creates an action denoting the changing of working periods' payment
 * statuses.
 *
 * @param {Object} paymentStatuses object with working periods' payment statuses
 * @returns {Object}
 */
export const setWorkPeriodsPaymentStatuses = (paymentStatuses) => ({
  type: ACTION_TYPE.WP_SET_PAYMENT_STATUSES,
  payload: paymentStatuses,
});

/**
 * Creates an action denoting the changing of alert option
 *
 * @param {Object} option object with working periods' payment statuses
 * @returns {Object}
 */
export const setAlertOption = (option) => ({
  type: ACTION_TYPE.WP_SET_ALERT_OPTION,
  payload: option,
});

/**
 * Creates an action denoting the changing of working periods' topcoder handle.
 *
 * @param {string} handle user's Topcoder handle
 * @returns {Object}
 */
export const setWorkPeriodsUserHandle = (handle) => ({
  type: ACTION_TYPE.WP_SET_USER_HANDLE,
  payload: handle,
});

/**
 * Creates an action denoting an attempt to update working period's data
 * on the server.
 *
 * @param {Object} periodId working period id
 * @param {Object} cancelSource axios cancel token source
 * @returns {Object}
 */
export const setWorkPeriodDataPending = (periodId, cancelSource) => ({
  type: ACTION_TYPE.WP_SET_PERIOD_DATA_PENDING,
  payload: { periodId, cancelSource },
});

export const setWorkPeriodDataSuccess = (periodId, data) => ({
  type: ACTION_TYPE.WP_SET_PERIOD_DATA_SUCCESS,
  payload: { periodId, data },
});

export const setWorkPeriodDataError = (periodId, message) => ({
  type: ACTION_TYPE.WP_SET_PERIOD_DATA_ERROR,
  payload: { periodId, message },
});

export const setWorkPeriodPaymentData = (paymentData) => ({
  type: ACTION_TYPE.WP_SET_PAYMENT_DATA,
  payload: paymentData,
});

/**
 * Creates an action to change working days for specific working period.
 *
 * @param {string|number} periodId period id
 * @param {number} daysWorked number of working days
 * @returns {Object}
 */
export const setWorkPeriodWorkingDays = (periodId, daysWorked) => ({
  type: ACTION_TYPE.WP_SET_WORKING_DAYS,
  payload: { periodId, daysWorked },
});

/**
 * Creates an action denoting an attempt to update working period's working days
 * on the server.
 *
 * @param {Object} periodId working period id
 * @param {Object} cancelSource axios cancel token source
 * @returns {Object}
 */
export const setWorkPeriodWorkingDaysPending = (periodId, cancelSource) => ({
  type: ACTION_TYPE.WP_SET_WORKING_DAYS_PENDING,
  payload: { periodId, cancelSource },
});

export const setWorkPeriodWorkingDaysSuccess = (periodId, data) => ({
  type: ACTION_TYPE.WP_SET_WORKING_DAYS_SUCCESS,
  payload: { periodId, data },
});

export const setWorkPeriodWorkingDaysError = (periodId, message) => ({
  type: ACTION_TYPE.WP_SET_WORKING_DAYS_ERROR,
  payload: { periodId, message },
});

export const toggleShowFailedPaymentsOnly = (on = null) => ({
  type: ACTION_TYPE.WP_TOGGLE_ONLY_FAILED_PAYMENTS,
  payload: on,
});

/**
 * Creates an action to toggle certain working period by its id.
 *
 * @param {string} id period id
 * @returns {Object}
 */
export const toggleWorkPeriod = (id) => ({
  type: ACTION_TYPE.WP_TOGGLE_PERIOD,
  payload: id,
});

/**
 * Creates an action to toggle all working periods.
 *
 * @param {?boolean} on whether to toggle all periods on or off
 * @returns {Object}
 */
export const toggleWorkingPeriodsAll = (on = null) => ({
  type: ACTION_TYPE.WP_TOGGLE_PERIODS_ALL,
  payload: on,
});

/**
 * Creates an action to toggle all visible working periods.
 *
 * @param {?boolean} on whether to toggle all visible periods on or off
 * @returns {Object}
 */
export const toggleWorkingPeriodsVisible = (on = null) => ({
  type: ACTION_TYPE.WP_TOGGLE_PERIODS_VISIBLE,
  payload: on,
});

/**
 * Creates an action denoting the change of processing-payments state.
 *
 * @param {?boolean} on whether to turn processing-payments state on or off
 * @returns {Object}
 */
export const toggleWorkPeriodsProcessingPayments = (on = null) => ({
  type: ACTION_TYPE.WP_TOGGLE_PROCESSING_PAYMENTS,
  payload: on,
});

/**
 * Creates an action denoting the toggling of the flag allowing extra working
 * days.
 *
 * @param {string} periodId working period id
 * @param {?boolean} on whether to toggle daysWorkedAllowExtra on or off
 * @returns {Object}
 */
export const toggleWorkingDaysAllowExtra = (periodId, on = null) => ({
  type: ACTION_TYPE.WP_TOGGLE_WORKING_DAYS_EXTRA,
  payload: { periodId, on },
});

/**
 * Creates an action denoting the change of working-days-updated flag for
 * working period with the specified id.
 *
 * @param {string} periodId working period id
 * @param {boolean} on whether to toggle working-days-updated flag on or off.
 * @returns {Object}
 */
export const toggleWorkingDaysUpdated = (periodId, on) => ({
  type: ACTION_TYPE.WP_TOGGLE_WORKING_DAYS_UPDATED,
  payload: { periodId, on },
});

/**
 * Creates an action denoting an update of working periods state slice using
 * the provided query.
 *
 * @param {string} query URL search query
 * @returns {Object}
 */
export const updateStateFromQuery = (query) => ({
  type: ACTION_TYPE.WP_UPDATE_STATE_FROM_QUERY,
  payload: query,
});
