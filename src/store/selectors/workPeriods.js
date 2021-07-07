/**
 * Returns working periods' state slice.
 *
 * @param {Object} state redux root state
 * @returns {Object}
 */
export const getWorkPeriodsStateSlice = (state) => state.workPeriods;

/**
 * Returns currently loaded working periods.
 *
 * @param {Object} state redux root state
 * @returns {Array}
 */
export const getWorkPeriods = (state) => state.workPeriods.periods;

/**
 * Returns an object with period ids as keys and alerts' arrays as values;
 *
 * @param {Object} state redux root state
 * @returns {Object}
 */
export const getWorkPeriodsAlerts = (state) => state.workPeriods.periodsAlerts;

/**
 * Returns working periods' details.
 *
 * @param {Object} state redux root state
 * @returns {Object}
 */
export const getWorkPeriodsDetails = (state) =>
  state.workPeriods.periodsDetails;

/**
 * Returns a Map wrapped in an array containing arrays of reasons the specific
 * working period is disabled.
 *
 * @param {Object} state redux root state
 * @returns {[Map]}
 */
export const getWorkPeriodsDisabled = (state) =>
  state.workPeriods.periodsDisabled;

/**
 * Returns an object which has working periods' ids for which the payments
 * were failed to be scheduled as keys.
 *
 * @param {Object} state redux root state
 * @returns {Object}
 */
export const getWorkPeriodsFailed = (state) => state.workPeriods.periodsFailed;

/**
 * Returns a Set wrapped in array containing the ids of selected working periods.
 *
 * @param {Object} state redux root state
 * @returns {[Set]}
 */
export const getWorkPeriodsSelected = (state) =>
  state.workPeriods.periodsSelected;

export const getWorkPeriodsSelectedCount = (state) =>
  state.workPeriods.periodsSelected[0].size;

/**
 * Returns working periods filters' state.
 *
 * @param {Object} state redux root state
 * @returns {Object}
 */
export const getWorkPeriodsFilters = (state) => state.workPeriods.filters;

export const getWorkPeriodsPaymentStatuses = (state) =>
  state.workPeriods.filters.paymentStatuses;

export const getWorkPeriodsDateRange = (state) =>
  state.workPeriods.filters.dateRange;

export const getWorkPeriodsError = (state) => state.workPeriods.error;

export const getWorkPeriodsSorting = (state) => state.workPeriods.sorting;

export const getWorkPeriodsPagination = (state) => state.workPeriods.pagination;

export const getWorkPeriodsPageNumber = (state) =>
  state.workPeriods.pagination.pageNumber;

export const getWorkPeriodsPageSize = (state) =>
  state.workPeriods.pagination.pageSize;

export const getWorkPeriodsCount = (state) => state.workPeriods.periods.length;

export const getWorkPeriodsData = (state) => state.workPeriods.periodsData;

export const getWorkPeriodsTotalCount = (state) =>
  state.workPeriods.pagination.totalCount;

export const getWorkPeriodsHasSelectedItems = (state) =>
  !!state.workPeriods.periodsSelected[0].size;

export const getWorkPeriodsIsLoading = (state) =>
  !!state.workPeriods.cancelSource;

export const getWorkPeriodsIsProcessingPayments = (state) =>
  state.workPeriods.isProcessingPayments;

export const getWorkPeriodsIsSelectedAll = (state) =>
  state.workPeriods.isSelectedPeriodsAll;

export const getWorkPeriodsIsSelectedVisible = (state) =>
  state.workPeriods.isSelectedPeriodsVisible;
