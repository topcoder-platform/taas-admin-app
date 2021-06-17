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
 * Returns working periods' details.
 *
 * @param {Object} state redux root state
 * @returns {Object}
 */
export const getWorkPeriodsDetails = (state) =>
  state.workPeriods.periodsDetails;

/**
 * Returns an object which has working periods' ids for which the payments
 * were failed to be scheduled as keys.
 *
 * @param {Object} state redux root state
 * @returns {Object}
 */
export const getWorkPeriodsFailed = (state) => state.workPeriods.periodsFailed;

/**
 * Returns an object with working periods' ids as keys and booleans showing
 * whether the period is selected as values.
 *
 * @param {Object} state redux root state
 * @returns {Object.<string, boolean>}
 */
export const getWorkPeriodsSelected = (state) =>
  state.workPeriods.periodsSelected;

/**
 * Returns working periods filters' state.
 *
 * @param {Object} state redux root state
 * @returns {Object}
 */
export const getWorkPeriodsFilters = (state) => state.workPeriods.filters;

export const getWorkPeriodsDateRange = (state) =>
  state.workPeriods.filters.dateRange;

export const getWorkPeriodsError = (state) => state.workPeriods.error;

export const getWorkPeriodsSorting = (state) => state.workPeriods.sorting;

export const getWorkPeriodsPagination = (state) => state.workPeriods.pagination;

export const getWorkPeriodsPageSize = (state) =>
  state.workPeriods.pagination.pageSize;

export const getWorkPeriodsCount = (state) => state.workPeriods.periods.length;

export const getWorkPeriodsData = (state) => state.workPeriods.periodsData;

export const getWorkPeriodsTotalCount = (state) =>
  state.workPeriods.pagination.totalCount;

export const getWorkPeriodsHasSelectedItems = (state) => {
  const periodsSelected = state.workPeriods.periodsSelected;
  for (let id in periodsSelected) {
    return true;
  }
  return false;
};

export const getWorkPeriodsIsLoading = (state) =>
  !!state.workPeriods.cancelSource;

export const getWorkPeriodsIsProcessingPayments = (state) =>
  state.workPeriods.isProcessingPayments;

export const getWorkPeriodsIsSelectedAll = (state) =>
  state.workPeriods.isSelectedPeriodsAll;

export const getWorkPeriodsIsSelectedVisible = (state) =>
  state.workPeriods.isSelectedPeriodsVisible;
