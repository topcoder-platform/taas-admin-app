import React from "react";
import PT from "prop-types";
import ToastMessage from "components/ToastrMessage";
import styles from "./styles.module.scss";

/**
 * Displays a toastr message with info about the number of resources for which
 * payments have been scheduled or failed to schedule.
 *
 * @param {Object} props component properties
 * @param {number} props.resourcesSucceededCount the number of resources
 * for which payments have been successfully scheduled
 * @param {Array} [props.resourcesFailed] array with data for resources
 * for which payments were failed to be scheduled
 * @param {number} props.resourcesFailedCount the number of resources
 * for which payments were failed to be scheduled
 * @param {() => void} [props.remove] function that must be called
 * on toast message removal intent
 * @returns {JSX.Element}
 */
const ToastPaymentsWarning = ({
  resourcesSucceededCount,
  resourcesFailed,
  resourcesFailedCount,
  remove,
}) => {
  return (
    <ToastMessage type="warning" remove={remove}>
      <div className={styles.sectionSucceeded}>
        <div className={styles.sectionTitle}>
          Payment scheduled for {resourcesSucceededCount} resources
        </div>
      </div>
      <div className={styles.sectionFailed}>
        <div className={styles.sectionTitle}>
          Failed to schedule payment for {resourcesFailedCount} resources
          {resourcesFailed && resourcesFailed.length ? ":" : ""}
        </div>
        {resourcesFailed && resourcesFailed.length && (
          <div className={styles.periodsFailed}>
            {resourcesFailed.map((period) => (
              <div key={period.workPeriodId} className={styles.periodFailed}>
                {period.workPeriodId} ({period.error.code}):{" "}
                {period.error.message}
              </div>
            ))}
          </div>
        )}
      </div>
    </ToastMessage>
  );
};

ToastPaymentsWarning.propTypes = {
  resourcesSucceededCount: PT.number.isRequired,
  resourcesFailed: PT.arrayOf(
    PT.shape({
      workPeriodId: PT.string.isRequired,
      amount: PT.number,
      error: PT.shape({
        message: PT.string.isRequired,
        code: PT.number.isRequired,
      }),
    })
  ),
  resourcesFailedCount: PT.number.isRequired,
  remove: PT.func,
};

export default ToastPaymentsWarning;
