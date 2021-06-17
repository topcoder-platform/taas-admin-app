import React from "react";
import PT from "prop-types";
import ToastMessage from "components/ToastrMessage";
import styles from "./styles.module.scss";

/**
 * Displays a toastr message with info about the number of resources being
 * processed.
 *
 * @param {Object} props
 * @returns {JSX.Element}
 */
const ToastPaymentsProcessing = ({ resourceCount, remove }) => {
  return (
    <ToastMessage className={styles.container} remove={remove}>
      <span className={styles.icon}></span>
      Payment in progress for {resourceCount} resources
    </ToastMessage>
  );
};

ToastPaymentsProcessing.propTypes = {
  resourceCount: PT.number.isRequired,
  remove: PT.func,
};

export default ToastPaymentsProcessing;
