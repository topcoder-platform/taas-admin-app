import React, { memo, useCallback } from "react";
import { useDispatch } from "react-redux";
import PT from "prop-types";
import cn from "classnames";
import debounce from "lodash/debounce";
import Button from "components/Button";
import Toggle from "components/Toggle";
import SelectField from "components/SelectField";
import JobName from "components/JobName";
import PeriodsHistory from "../PeriodsHistory";
import IconComputer from "../../../../assets/images/icon-computer.svg";
import {
  hideWorkPeriodDetails,
  setBillingAccount,
  setDetailsHidePastPeriods,
} from "store/actions/workPeriods";
import { updateWorkPeriodBillingAccount } from "store/thunks/workPeriods";
import { useUpdateEffect } from "utils/hooks";
import styles from "./styles.module.scss";

/**
 * Displays working period details.
 *
 * @param {Object} props component properties
 * @param {string} [props.className] class name to be added to root element
 * @param {Object} props.details working period details object
 * @param {boolean} props.isDisabled whether the details are disabled
 * @param {boolean} props.isFailed whether the payments for the period has failed
 * @param {Object} props.period working period basic data object
 * @returns {JSX.Element}
 */
const PeriodDetails = ({
  className,
  details,
  isDisabled,
  isFailed,
  period,
}) => {
  const dispatch = useDispatch();
  const { id: periodId, rbId, jobId, billingAccountId } = period;
  const {
    billingAccounts,
    billingAccountsError,
    billingAccountsIsDisabled,
    periodsVisible,
    periodsIsLoading,
    hidePastPeriods,
  } = details;

  const onHideDetailsBtnClick = useCallback(() => {
    dispatch(hideWorkPeriodDetails(periodId));
  }, [dispatch, periodId]);

  const onChangeHidePastPeriods = useCallback(
    (hide) => {
      dispatch(setDetailsHidePastPeriods(periodId, hide));
    },
    [dispatch, periodId]
  );

  const onChangeBillingAccount = useCallback(
    (value) => {
      dispatch(setBillingAccount(periodId, value));
    },
    [dispatch, periodId]
  );

  const updateBillingAccount = useCallback(
    debounce(
      (billingAccountId) => {
        dispatch(updateWorkPeriodBillingAccount(rbId, billingAccountId));
      },
      300,
      { leading: false }
    ),
    [dispatch, rbId]
  );

  useUpdateEffect(() => {
    updateBillingAccount(billingAccountId);
  }, [billingAccountId]);

  return (
    <tr
      className={cn(
        styles.container,
        { [styles.isFailed]: isFailed },
        className
      )}
    >
      {periodsIsLoading ? (
        <td colSpan={10}>
          <div className={styles.loadingIndicator}>Loading...</div>
        </td>
      ) : (
        <>
          <td colSpan={3} className={styles.periodInfo}>
            <div className={styles.jobNameSection}>
              <IconComputer className={styles.jobNameIcon} />
              <div className={styles.sectionField}>
                <div className={styles.label}>Job Name</div>
                <JobName jobId={jobId} className={styles.jobName} />
              </div>
            </div>
            <div className={styles.billingAccountsSection}>
              <div className={styles.sectionLabel}>Billing Account</div>
              <SelectField
                className={cn(styles.billingAccountsSelect, {
                  [styles.billingAccountsError]: billingAccountsError,
                })}
                id={`rb_bil_acc_${periodId}`}
                isDisabled={billingAccountsIsDisabled}
                size="small"
                onChange={onChangeBillingAccount}
                options={billingAccounts}
                value={billingAccountId}
              />
            </div>
            <div className={styles.detailsControls}>
              <Button size="small" onClick={onHideDetailsBtnClick}>
                Hide Details
              </Button>
            </div>
          </td>
          <td colSpan={7} className={styles.periodHistory}>
            <div className={styles.periodsContainer}>
              <div className={styles.periodsHeader}>
                <span className={styles.periodsHeaderTitle}>History</span>
                <span className={styles.hidePastPeriods}>
                  <label
                    htmlFor={`hide_past_wp_${periodId}`}
                    className={styles.hidePastPeriodsLabel}
                  >
                    Current &amp; Future Only
                  </label>
                  <Toggle
                    className={styles.hidePastPeriodsToggle}
                    name={`hide_past_wp_${periodId}`}
                    onChange={onChangeHidePastPeriods}
                    size="small"
                    isOn={hidePastPeriods}
                  />
                </span>
              </div>
              <PeriodsHistory
                bookingStart={period.bookingStart}
                bookingEnd={period.bookingEnd}
                isDisabled={isDisabled}
                periods={periodsVisible}
              />
            </div>
          </td>
        </>
      )}
    </tr>
  );
};

PeriodDetails.propTypes = {
  className: PT.string,
  details: PT.shape({
    billingAccounts: PT.arrayOf(
      PT.shape({
        label: PT.string.isRequired,
        value: PT.number.isRequired,
      })
    ),
    billingAccountsError: PT.string,
    billingAccountsIsDisabled: PT.bool.isRequired,
    billingAccountsIsLoading: PT.bool.isRequired,
    periodsVisible: PT.array.isRequired,
    periodsIsLoading: PT.bool.isRequired,
    hidePastPeriods: PT.bool.isRequired,
  }).isRequired,
  isDisabled: PT.bool.isRequired,
  isFailed: PT.bool.isRequired,
  period: PT.shape({
    id: PT.string.isRequired,
    rbId: PT.string.isRequired,
    jobId: PT.string.isRequired,
    billingAccountId: PT.number.isRequired,
    bookingStart: PT.string.isRequired,
    bookingEnd: PT.string.isRequired,
  }).isRequired,
};

export default memo(PeriodDetails);
