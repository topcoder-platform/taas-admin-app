import moment from "moment";
import { API_PAYMENT_STATUS_MAP, DATE_FORMAT_UI } from "constants/workPeriods";

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
      startDate: item.startDate
        ? moment(item.startDate).format(DATE_FORMAT_UI)
        : "",
      endDate: item.endDate ? moment(item.endDate).format(DATE_FORMAT_UI) : "",
      weeklyRate: item.memberRate,
      data: normalizePeriodData(workPeriod),
    });
  }
  return periods;
}

/**
 * Normalizes specific working period data (daysWorked, daysPaid,
 * paymentStatus, paymentTotal).
 *
 * @param {Object} period
 * @param {number} period.daysWorked
 * @param {number} period.daysPaid
 * @param {string} period.paymentStatus
 * @param {number} period.paymentTotal
 * @returns {Object}
 */
export function normalizePeriodData(period) {
  return {
    daysWorked: period.daysWorked === null ? 5 : +period.daysWorked || 0,
    daysPaid: +period.daysPaid || 0,
    paymentStatus: normalizePaymentStatus(period.paymentStatus),
    paymentTotal: +period.paymentTotal || 0,
  };
}

/**
 * Creates options to be used in dropdown selecting working period's
 * billing account.
 *
 * @param {Array} accounts array of billing accounts received for specific project
 * @param {number} accountId resource booking's billing account id
 * @returns {Array}
 */
export function normalizeBillingAccounts(accounts, accountId = -1) {
  const accs = [];
  let hasSelectedAccount = false;
  for (let acc of accounts) {
    const value = +acc.tcBillingAccountId;
    hasSelectedAccount = hasSelectedAccount || value === accountId;
    const endDate = acc.endDate
      ? moment(acc.endDate).format("DD MMM YYYY")
      : "";
    accs.push({
      value,
      label: `${acc.name} (${value})` + (endDate ? ` - ${endDate}` : ""),
    });
  }
  if (!hasSelectedAccount && accountId > 0) {
    accs.unshift(createAssignedBillingAccountOption(accountId));
  }
  return accs;
}

export function createAssignedBillingAccountOption(accountId) {
  return { value: accountId, label: `<Assigned Account> (${accountId})` };
}

export function normalizeDetailsPeriodItems(items) {
  const periods = [];
  for (let item of items) {
    periods.push({
      id: item.id,
      startDate: item.startDate ? moment(item.startDate).valueOf() : 0,
      endDate: item.endDate ? moment(item.endDate).valueOf() : 0,
      payments: item.payments || [],
      weeklyRate: item.memberRate,
      data: normalizePeriodData(item),
    });
  }
  periods.sort(sortByStartDate);
  return periods;
}

export function normalizePaymentStatus(paymentStatus) {
  return API_PAYMENT_STATUS_MAP[paymentStatus];
}

export function sortByStartDate(itemA, itemB) {
  return itemA.startDate - itemB.startDate;
}
