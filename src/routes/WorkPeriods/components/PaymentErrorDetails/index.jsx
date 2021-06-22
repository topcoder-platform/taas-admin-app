import React from "react";
import PT from "prop-types";
import cn from "classnames";
import { formatChallengeUrl } from "utils/formatters";
import styles from "./styles.module.scss";

/**
 * Displays payment error details.
 *
 * @param {Object} props component properties
 * @param {string} [props.className] class name to be added to root element
 * @param {Object} props.details error details
 * @returns {JSX.Element}
 */
const PaymentErrorDetails = ({ className, details }) => {
  const { challengeId, errorMessage, errorCode, retry, step } = details;
  return (
    <div className={cn(styles.container, className)}>
      <div className={styles.row}>
        <span className={styles.label}>Challenge:</span>
        {challengeId ? (
          <a
            href={formatChallengeUrl(challengeId)}
            target="_blank"
            rel="noreferrer"
          >
            {challengeId}
          </a>
        ) : (
          <span>{"<Missing challenge id>"}</span>
        )}
      </div>
      <div className={cn(styles.row, styles.errorMessage)}>
        <span className={styles.label}>Error:</span>
        {errorMessage}
      </div>
      <div className={styles.row}>
        <span className={styles.cell}>
          <span className={styles.label}>Code:</span>
          {errorCode}
        </span>
        <span className={styles.cell}>
          <span className={styles.label}>Retry:</span>
          {retry}
        </span>
        <span className={styles.cell}>
          <span className={styles.label}>Step:</span>
          {step}
        </span>
      </div>
    </div>
  );
};

PaymentErrorDetails.propTypes = {
  className: PT.string,
  details: PT.shape({
    challengeId: PT.string,
    errorCode: PT.number.isRequired,
    errorMessage: PT.string.isRequired,
    retry: PT.number.isRequired,
    step: PT.string.isRequired,
  }).isRequired,
};

export default PaymentErrorDetails;
