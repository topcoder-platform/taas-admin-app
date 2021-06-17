import React from "react";
import PT from "prop-types";
import ToastMessage from "components/ToastrMessage";

/**
 * Displays a toastr message with info about the number of resources payments
 * for which have been scheduled.
 *
 * @param {Object} props
 * @returns {JSX.Element}
 */
const ToastPaymentsSuccess = ({ resourceCount, remove }) => {
  return (
    <ToastMessage type="success" remove={remove}>
      Payment scheduled for {resourceCount} resources
    </ToastMessage>
  );
};

ToastPaymentsSuccess.propTypes = {
  resourceCount: PT.number.isRequired,
  remove: PT.func,
};

export default ToastPaymentsSuccess;
