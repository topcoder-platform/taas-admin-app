import React from "react";
import PT from "prop-types";
import ToastMessage from "components/ToastrMessage";
import { formatPlural } from "utils/formatters";

/**
 * Displays a toastr message with info about the number of resources payments
 * for which have been failed to be scheduled.
 *
 * @param {Object} props
 * @returns {JSX.Element}
 */
const ToastPaymentsError = ({ resourceCount, remove }) => {
  return (
    <ToastMessage type="error" remove={remove}>
      Failed to schedule payment for {formatPlural(resourceCount, "resource")}
    </ToastMessage>
  );
};

ToastPaymentsError.propTypes = {
  resourceCount: PT.number.isRequired,
  remove: PT.func,
};

export default ToastPaymentsError;
