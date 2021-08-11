// @ts-ignore
import { API } from "../../config";
import * as ALERT from "./workPeriods/alerts";
import * as API_CHALLENGE_PAYMENT_STATUS from "./workPeriods/apiChallengePaymentStatus";
import * as API_PAYMENT_STATUS from "./workPeriods/apiPaymentStatus";
import * as API_SORT_BY from "./workPeriods/apiSortBy";
import * as SORT_BY from "./workPeriods/sortBy";
import * as SORT_ORDER from "./workPeriods/sortOrder";
import * as PAYMENT_STATUS from "./workPeriods/paymentStatus";
import * as REASON_DISABLED from "./workPeriods/reasonDisabled";

export {
  ALERT,
  API_CHALLENGE_PAYMENT_STATUS,
  API_PAYMENT_STATUS,
  API_SORT_BY,
  SORT_BY,
  SORT_ORDER,
  PAYMENT_STATUS,
  REASON_DISABLED,
};

// resource bookings API url
export const RB_API_URL = `${API.V5}/resourceBookings`;
export const JOBS_API_URL = `${API.V5}/jobs`;
export const PAYMENTS_API_URL = `${API.V5}/work-period-payments`;
export const PROJECTS_API_URL = `${API.V5}/projects`;
export const WORK_PERIODS_API_URL = `${API.V5}/work-periods`;
export const TAAS_TEAM_API_URL = `${API.V5}/taas-teams`;

export const DATE_FORMAT_API = "YYYY-MM-DD";
export const DATE_FORMAT_ISO = "YYYY-MM-DD";
export const DATE_FORMAT_UI = "MMM DD, YYYY";
export const DATETIME_FORMAT_UI = "MMM DD, YYYY h:mm a";

// Field names that are required to be retrieved for display, filtering and sorting.
export const API_REQUIRED_FIELDS = [
  "id",
  "jobId",
  "projectId",
  "billingAccountId",
  "startDate",
  "endDate",
  "memberRate",
  "status",
  "billingAccountId",
  "workPeriods.id",
  "workPeriods.projectId",
  "workPeriods.userHandle",
  "workPeriods.startDate",
  "workPeriods.endDate",
  "workPeriods.paymentStatus",
  "workPeriods.paymentTotal",
  "workPeriods.daysWorked",
  "workPeriods.daysPaid",
  "workPeriods.payments.amount",
  "workPeriods.payments.billingAccountId",
  "workPeriods.payments.challengeId",
  "workPeriods.payments.createdAt",
  "workPeriods.payments.days",
  "workPeriods.payments.id",
  "workPeriods.payments.memberRate",
  "workPeriods.payments.status",
  "workPeriods.payments.statusDetails",
  "workPeriods.payments.workPeriodId",
];

// Valid parameter names for requests.
export const API_QUERY_PARAM_NAMES = [
  "fields",
  "page",
  "perPage",
  "sortBy",
  "sortOrder",
].concat(API_REQUIRED_FIELDS);

export const API_FIELDS_QUERY = API_REQUIRED_FIELDS.join(",");

export const SORT_BY_DEFAULT = SORT_BY.USER_HANDLE;

export const SORT_ORDER_DEFAULT = SORT_ORDER.ASC;

export const SORT_BY_MAP = {
  [SORT_BY.USER_HANDLE]: API_SORT_BY.USER_HANDLE,
  [SORT_BY.START_DATE]: API_SORT_BY.START_DATE,
  [SORT_BY.END_DATE]: API_SORT_BY.END_DATE,
  [SORT_BY.WEEKLY_RATE]: API_SORT_BY.WEEKLY_RATE,
  [SORT_BY.PAYMENT_STATUS]: API_SORT_BY.PAYMENT_STATUS,
  [SORT_BY.PAYMENT_TOTAL]: API_SORT_BY.PAYMENT_TOTAL,
  [SORT_BY.WORKING_DAYS]: API_SORT_BY.WORKING_DAYS,
};

export const PAYMENT_STATUS_LABELS = {
  [PAYMENT_STATUS.CANCELLED]: "Cancelled",
  [PAYMENT_STATUS.COMPLETED]: "Completed",
  [PAYMENT_STATUS.FAILED]: "Failed",
  [PAYMENT_STATUS.IN_PROGRESS]: "In Progress",
  [PAYMENT_STATUS.NO_DAYS]: "No Days",
  [PAYMENT_STATUS.PARTIALLY_COMPLETED]: "Partially Completed",
  [PAYMENT_STATUS.PENDING]: "Pending",
  [PAYMENT_STATUS.SCHEDULED]: "Scheduled",
  [PAYMENT_STATUS.UNDEFINED]: "NA",
};

export const PAYMENT_STATUS_MAP = {
  [PAYMENT_STATUS.NO_DAYS]: API_PAYMENT_STATUS.NO_DAYS,
  [PAYMENT_STATUS.COMPLETED]: API_PAYMENT_STATUS.COMPLETED,
  [PAYMENT_STATUS.PARTIALLY_COMPLETED]: API_PAYMENT_STATUS.PARTIALLY_COMPLETED,
  [PAYMENT_STATUS.PENDING]: API_PAYMENT_STATUS.PENDING,
  [PAYMENT_STATUS.IN_PROGRESS]: API_PAYMENT_STATUS.IN_PROGRESS,
};

export const API_PAYMENT_STATUS_MAP = (function () {
  const obj = {};
  for (let key in PAYMENT_STATUS_MAP) {
    if (Object.prototype.hasOwnProperty.call(PAYMENT_STATUS_MAP, key)) {
      obj[PAYMENT_STATUS_MAP[key]] = key;
    }
  }
  return obj;
})();

export const API_CHALLENGE_PAYMENT_STATUS_MAP = {
  [API_CHALLENGE_PAYMENT_STATUS.CANCELLED]: PAYMENT_STATUS.CANCELLED,
  [API_CHALLENGE_PAYMENT_STATUS.COMPLETED]: PAYMENT_STATUS.COMPLETED,
  [API_CHALLENGE_PAYMENT_STATUS.FAILED]: PAYMENT_STATUS.FAILED,
  [API_CHALLENGE_PAYMENT_STATUS.IN_PROGRESS]: PAYMENT_STATUS.IN_PROGRESS,
  [API_CHALLENGE_PAYMENT_STATUS.SCHEDULED]: PAYMENT_STATUS.SCHEDULED,
};

export const CHALLENGE_PAYMENT_ACTIVE_STATUSES = {
  [PAYMENT_STATUS.COMPLETED]: PAYMENT_STATUS.COMPLETED,
  [PAYMENT_STATUS.IN_PROGRESS]: PAYMENT_STATUS.IN_PROGRESS,
  [PAYMENT_STATUS.SCHEDULED]: PAYMENT_STATUS.SCHEDULED,
};

export const URL_QUERY_PARAM_MAP = new Map([
  ["startDate", "startDate"],
  ["paymentStatuses", "status"],
  ["alertOptions", "alert"],
  ["onlyFailedPayments", "onlyFailed"],
  ["userHandle", "user"],
  ["criteria", "by"],
  ["order", "order"],
  ["pageSize", "perPage"],
  ["pageNumber", "page"],
]);

export const JOB_NAME_LOADING = "Loading...";
export const JOB_NAME_NONE = "<Job is not assigned>";
export const JOB_NAME_ERROR = "<Error loading job>";

export const BILLING_ACCOUNTS_LOADING = "Loading...";
export const BILLING_ACCOUNTS_NONE = "<No accounts available>";
export const BILLING_ACCOUNTS_ERROR = "<Error loading accounts>";

export const REASON_DISABLED_MESSAGE_MAP = {
  [REASON_DISABLED.NO_BILLING_ACCOUNT]:
    "Billing Account is not set for the Resource Booking",
  [REASON_DISABLED.NO_DAYS_TO_PAY_FOR]: "There are no days to pay for",
  [REASON_DISABLED.NO_MEMBER_RATE]: "Member Rate should be greater than 0",
  [REASON_DISABLED.NOT_ALLOW_FUTURE_WEEK]:
    "Not allowed processing payments for the future weeks",
};

export const ALERT_MESSAGE_MAP = {
  [ALERT.BA_NOT_ASSIGNED]: "BA - Not Assigned",
  [ALERT.LAST_BOOKING_WEEK]: "Last Booking Week",
};

export const DAYS_WORKED_HARD_LIMIT = 10;
