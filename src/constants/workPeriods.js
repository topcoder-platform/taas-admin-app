// @ts-ignore
import { API } from "../../config";
import * as API_PAYMENT_STATUS from "./workPeriods/apiPaymentStatus";
import * as API_SORT_BY from "./workPeriods/apiSortBy";
import * as SORT_BY from "./workPeriods/sortBy";
import * as SORT_ORDER from "./workPeriods/sortOrder";
import * as PAYMENT_STATUS from "./workPeriods/paymentStatus";

export { API_PAYMENT_STATUS, API_SORT_BY, SORT_BY, SORT_ORDER, PAYMENT_STATUS };

// resource bookings API url
export const RB_API_URL = `${API.V5}/resourceBookings`;
export const JOBS_API_URL = `${API.V5}/jobs`;
export const PAYMENTS_API_URL = `${API.V5}/work-period-payments`;
export const PROJECTS_API_URL = `${API.V5}/projects`;
export const WORK_PERIODS_API_URL = `${API.V5}/work-periods`;

export const DATE_FORMAT_API = "YYYY-MM-DD";
export const DATE_FORMAT_UI = "MMM DD, YYYY";

// Field names that are required to be retrieved for display, filtering and sorting.
export const REQUIRED_FIELDS = [
  "id",
  "jobId",
  "projectId",
  "billingAccountId",
  "startDate",
  "endDate",
  "memberRate",
  "status",
  "workPeriods.id",
  "workPeriods.projectId",
  "workPeriods.userHandle",
  "workPeriods.startDate",
  "workPeriods.endDate",
  "workPeriods.paymentStatus",
  "workPeriods.paymentTotal",
  "workPeriods.daysWorked",
  "workPeriods.daysPaid",
];

// Valid parameter names for requests.
export const QUERY_PARAM_NAMES = [
  "fields",
  "page",
  "perPage",
  "sortBy",
  "sortOrder",
].concat(REQUIRED_FIELDS);

export const FIELDS_QUERY = REQUIRED_FIELDS.join(",");

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
  [PAYMENT_STATUS.NO_DAYS]: "No Days",
  [PAYMENT_STATUS.COMPLETED]: "Completed",
  [PAYMENT_STATUS.PARTIALLY_COMPLETED]: "Partially Completed",
  [PAYMENT_STATUS.PENDING]: "Pending",
  [PAYMENT_STATUS.IN_PROGRESS]: "In Progress",
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

export const JOB_NAME_LOADING = "Loading...";
export const JOB_NAME_NONE = "<Job is not assigned>";
export const JOB_NAME_ERROR = "<Error loading job>";

export const BILLING_ACCOUNTS_LOADING = "Loading...";
export const BILLING_ACCOUNTS_NONE = "<No accounts available>";
export const BILLING_ACCOUNTS_ERROR = "<Error loading accounts>";
