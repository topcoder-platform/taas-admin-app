import React from "react";
import { toastr } from "react-redux-toastr";
import ToastPaymentsProcessing from "../components/ToastPaymentsProcessing";
import ToastPaymentsSuccess from "../components/ToastPaymentsSuccess";
import ToastPaymentsWarning from "../components/ToastPaymentsWarning";
import ToastPaymentsError from "../components/ToastPaymentsError";
import { TOAST_DEFAULT_TIMEOUT } from "constants/index.js";

const options = {
  timeOut: TOAST_DEFAULT_TIMEOUT,
  removeOnHover: false,
  removeOnHoverTimeOut: TOAST_DEFAULT_TIMEOUT,
  closeOnToastrClick: false,
};

/**
 * Creates a redux toastr message denoting the start of payments processing.
 *
 * @param {number} resourceCount number of periods that were sent for processing
 */
export function makeToastPaymentsProcessing(resourceCount) {
  const component = <ToastPaymentsProcessing resourceCount={resourceCount} />;
  toastr.info("", { component, options });
}

/**
 * Creates a redux toastr message denoting the successful scheduling of payments
 * for the specified periods.
 *
 * @param {number} resourceCount number of periods for which payments were
 * successfully scheduled
 */
export function makeToastPaymentsSuccess(resourceCount) {
  const component = <ToastPaymentsSuccess resourceCount={resourceCount} />;
  toastr.success("", { component, options });
}

/**
 * Creates a redux toastr message denoting the partial success in shceduling
 * payments for specified working periods.
 *
 * @param {Object} props warning toastr properties
 * @param {number} props.resourcesSucceededCount the number of periods for which
 * payments were successfully scheduled
 * @param {number} props.resourcesFailedCount the number of periods for which
 * payments were failed to be scheduled
 * @param {Array} [props.resourcesFailed] periods for which payments were failed
 * to be scheduled
 */
export function makeToastPaymentsWarning(props) {
  const component = <ToastPaymentsWarning {...props} />;
  toastr.warning("", { component, options });
}

/**
 * Creates redux toastr message showing the information about working
 * periods for which the payments were failed to be scheduled.
 *
 * @param {number} resourceCount number of periods for which payments
 * were failed to be scheduled
 */
export function makeToastPaymentsError(resourceCount) {
  const component = <ToastPaymentsError resourceCount={resourceCount} />;
  toastr.error("", { component, options });
}
