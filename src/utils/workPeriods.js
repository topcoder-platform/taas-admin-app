import moment from "moment";
import {
  ALERT,
  API_CHALLENGE_PAYMENT_STATUS_MAP,
  API_PAYMENT_STATUS_MAP,
  DATE_FORMAT_ISO,
  PAYMENT_STATUS,
  REASON_DISABLED,
  URL_QUERY_PARAM_MAP,
} from "constants/workPeriods";

/**
 * Computes maximum allowed working days based on resource booking start and end
 * dates and working period start and end dates.
 *
 * @param {string} bookingStart resource booking start date
 * @param {string} bookingEnd resource booking end date
 * @param {Object} periodStart working period start date
 * @param {Object} periodEnd working period end date
 * @returns {number}
 */
export function computeDaysWorkedMax(
  bookingStart,
  bookingEnd,
  periodStart,
  periodEnd
) {
  let start = periodStart.day() + 1; // Monday
  let end = periodEnd.day() - 1; // Friday
  if (periodStart.isBefore(bookingStart, "date")) {
    // booking starts from Monday, Tuesday and so on
    start = moment(bookingStart).day();
  }
  if (periodEnd.isAfter(bookingEnd, "date")) {
    // booking ends at Friday, Thursday and so on
    end = moment(bookingEnd).day();
  }
  return end - start + 1;
}

/**
 * Returns an array of working period's alert ids.
 *
 * @param {Object} period working period basic data object containing
 * resource booking end date
 * @param {Object} periodEnd Moment object with working period end
 * @returns {Array}
 */
export function createPeriodAlerts(period, periodEnd) {
  const alerts = [];
  if (!period.billingAccountId) {
    alerts.push(ALERT.BA_NOT_ASSIGNED);
  }
  if (periodEnd.isSameOrAfter(period.bookingEnd, "date")) {
    alerts.push(ALERT.LAST_BOOKING_WEEK);
  }
  return alerts.length ? alerts : undefined;
}

/**
 * Checks for reasons the specified working period should be disabled for
 * payment processing.
 *
 * @param {Object} period working period object
 * @param {Array}  dateRange date range array
 * @returns {?string[]}
 */
export function findReasonsDisabled(period, dateRange) {
  const reasons = [];
  if (dateRange && dateRange.length > 0) {
    if (dateRange[0].isAfter(moment())) {
      reasons.push(REASON_DISABLED.NOT_ALLOW_FUTURE_WEEK);
    }
  }
  if (!period.billingAccountId) {
    reasons.push(REASON_DISABLED.NO_BILLING_ACCOUNT);
  }
  if (!period.weeklyRate) {
    reasons.push(REASON_DISABLED.NO_MEMBER_RATE);
  }
  const data = period.data;
  if (data && data.daysWorked === data.daysPaid) {
    reasons.push(REASON_DISABLED.NO_DAYS_TO_PAY_FOR);
  }
  return reasons.length ? reasons : undefined;
}

export function addValueImmutable(items, value) {
  if (!items) {
    return [value];
  }
  if (items.indexOf(value) < 0) {
    items = [...items, value];
  }
  return items;
}

export function removeValueImmutable(items, value) {
  if (!items) {
    return undefined;
  }
  let index = items.indexOf(value);
  if (index >= 0) {
    let newItems = [...items];
    newItems.splice(index, 1);
    return newItems.length ? newItems : undefined;
  }
  return items;
}

/**
 * Creates a URL search query from current state.
 *
 * @param {Object} state working periods' newly created state slice
 * @returns {Object}
 */
export function makeUrlQuery(state) {
  const { filters, pagination, sorting } = state;
  const {
    dateRange,
    onlyFailedPayments,
    paymentStatuses,
    alertOptions,
    userHandle,
  } = filters;
  const { pageNumber, pageSize } = pagination;
  const { criteria, order } = sorting;
  const params = {
    startDate: dateRange[0].format(DATE_FORMAT_ISO),
    paymentStatuses: Object.keys(paymentStatuses).join(",").toLowerCase(),
    alertOptions: Object.keys(alertOptions).join(",").toLowerCase(),
    onlyFailedPayments: onlyFailedPayments ? "y" : "",
    userHandle: encodeURIComponent(userHandle),
    criteria: criteria.toLowerCase(),
    order,
    pageNumber,
    pageSize,
  };
  const queryParams = [];
  for (let [stateKey, queryKey] of URL_QUERY_PARAM_MAP) {
    let value = params[stateKey];
    if (value) {
      queryParams.push(`${queryKey}=${value}`);
    }
  }
  return queryParams.join("&");
}

export function normalizePeriodItems(items) {
  const empty = {};
  const periods = [];
  for (let item of items) {
    const workPeriod = item.workPeriods?.[0] || empty;
    const billingAccountId = item.billingAccountId;
    periods.push({
      id: workPeriod.id || item.id,
      rbId: item.id,
      jobId: item.jobId,
      projectId: item.projectId,
      billingAccountId: billingAccountId === null ? 0 : billingAccountId,
      teamName: "",
      userHandle: workPeriod.userHandle || "",
      // resource booking period start date
      bookingStart: item.startDate
        ? moment(item.startDate).format(DATE_FORMAT_ISO)
        : "",
      // resource booking period end date
      bookingEnd: item.endDate
        ? moment(item.endDate).format(DATE_FORMAT_ISO)
        : "",
      weeklyRate: item.memberRate,
      data: normalizePeriodData(workPeriod),
    });
  }
  return periods;
}

export function normalizeDetailsPeriodItems(items) {
  const periods = [];
  for (let item of items) {
    periods.push({
      id: item.id,
      // working period start date
      start: moment(item.startDate || undefined),
      // working period end date
      end: moment(item.endDate || undefined),
      weeklyRate: item.memberRate,
      data: normalizePeriodData(item),
    });
  }
  periods.sort(
    (periodA, periodB) => periodA.start.valueOf() - periodB.start.valueOf()
  );
  return periods;
}

/**
 * Normalizes specific working period data (daysWorked, daysPaid,
 * paymentStatus, paymentTotal).
 *
 * @param {Object} period
 * @param {number} period.daysWorked
 * @param {number} period.daysPaid
 * @param {Array} [period.payments]
 * @param {string} period.paymentStatus
 * @param {number} period.paymentTotal
 * @returns {Object}
 */
export function normalizePeriodData(period) {
  const data = {
    daysPaid: +period.daysPaid || 0,
    daysWorked: period.daysWorked === null ? 5 : +period.daysWorked || 0,
    paymentStatus: normalizePaymentStatus(period.paymentStatus),
    paymentTotal: +period.paymentTotal || 0,
  };
  if (period.payments) {
    normalizePeriodPayments(period.payments, data);
  }
  return data;
}

/**
 * Normalizes working period payments.
 *
 * @param {Array} payments array of payment data
 * @param {Object} [data] period data object to populate
 * @returns {Array} array with normalized payments data
 */
export function normalizePeriodPayments(payments, data) {
  let lastFailedPayment = null;
  for (let payment of payments) {
    payment.createdAt = moment.utc(payment.createdAt).valueOf();
    payment.status = normalizeChallengePaymentStatus(payment.status);
    if (payment.status === PAYMENT_STATUS.FAILED) {
      lastFailedPayment = payment;
    }
  }
  payments.sort(sortPaymentsByCreatedAt);
  if (data) {
    data.paymentErrorLast = lastFailedPayment?.statusDetails;
    data.payments = payments;
  }
  return payments;
}

function sortPaymentsByCreatedAt(paymentA, paymentB) {
  return paymentA.createdAt - paymentB.createdAt;
}

export function normalizeChallengePaymentStatus(paymentStatus) {
  return (
    API_CHALLENGE_PAYMENT_STATUS_MAP[paymentStatus] || PAYMENT_STATUS.UNDEFINED
  );
}

export function normalizePaymentStatus(paymentStatus) {
  return API_PAYMENT_STATUS_MAP[paymentStatus];
}

/**
 * Creates options to be used in dropdown selecting working period's
 * billing account.
 *
 * @param {Array} accounts array of billing accounts received for specific project
 * @returns {Array}
 */
export function normalizeBillingAccounts(accounts) {
  const accs = [];
  for (let acc of accounts) {
    const value = +acc.tcBillingAccountId;
    const endDate = acc.endDate
      ? moment(acc.endDate).format("DD MMM YYYY")
      : "";
    accs.push({
      value,
      label: `${acc.name} (${value})` + (endDate ? ` - ${endDate}` : ""),
    });
  }
  return accs;
}

export function createAssignedBillingAccountOption(accountId) {
  return { value: accountId, label: `<Assigned Account> (${accountId})` };
}
