import { PLATFORM_WEBSITE_URL, TOPCODER_WEBSITE_URL } from "../../config";

export { PLATFORM_WEBSITE_URL, TOPCODER_WEBSITE_URL };

export const APP_BASE_PATH = "/taas-admin";

export const WORK_PERIODS_PATH = `${APP_BASE_PATH}/work-periods`;

export const FREELANCERS_PATH = `${APP_BASE_PATH}/freelancers`;

export const ROLES_PATH = `${APP_BASE_PATH}/roles`;

export const TAAS_BASE_PATH = "/taas";

export const ADMIN_ROLES = ["bookingmanager", "administrator"];

/**
 * Resource Bookings Status
 */
export const RESOURCE_BOOKING_STATUS = {
  PLACED: "placed",
  CLOSED: "closed",
  CANCELLED: "cancelled",
};

export const TOAST_DEFAULT_TIMEOUT = 50000;
