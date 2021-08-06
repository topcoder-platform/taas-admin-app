import React, { useCallback, useMemo, useState } from "react";
import PT from "prop-types";
import cn from "classnames";
import Modal from "components/Modal";
import Tooltip from "components/Tooltip";
import IconCheckmarkCircled from "components/Icons/CheckmarkCircled";
import { stopPropagation } from "utils/misc";
import { DAYS_WORKED_HARD_LIMIT } from "constants/workPeriods";
import styles from "./styles.module.scss";

/**
 * Displays working days input field with an icon hinting about the update.
 *
 * @param {Object} props component properties
 * @param {string} props.bookingStart resource booking start date
 * @param {string} props.bookingEnd resource booking end date
 * @param {string} [props.className] class name to be added to root element
 * @param {string} props.controlName working days input control name
 * @param {Object} props.data working period data object
 * @param {boolean} props.isDisabled whether the input field should be disabled
 * @param {() => void} props.onApproveExtraWorkingDays function called when
 * user approves adding extra working days
 * @param {(v: number) => void} props.onWorkingDaysChange function called when
 * working days change
 * @param {() => void} props.onWorkingDaysUpdateHintTimeout function called when
 * update hint icon has finished its animation
 * @param {number} [props.updateHintTimeout] timeout in milliseconds for update
 * hint icon
 * @returns {JSX.Element}
 */
const PeriodWorkingDays = ({
  className,
  controlName,
  data: {
    daysPaid,
    daysWorked,
    daysWorkedAllowExtra,
    daysWorkedIsUpdated,
    daysWorkedMax,
  },
  isDisabled,
  onApproveExtraWorkingDays,
  onWorkingDaysChange,
  onWorkingDaysUpdateHintTimeout,
  updateHintTimeout = 2000,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isBtnMinusDisabled =
    daysWorked === 0 || (daysWorked > 0 && daysWorked <= daysPaid);
  const isBtnPlusDisabled = daysWorked >= DAYS_WORKED_HARD_LIMIT;

  const decreaseDaysWorkedMessage = useMemo(
    () => `Cannot decrease "Working Days" below the number of days already
      paid for: ${daysPaid}`,
    [daysPaid]
  );
  const increaseDaysWorkedMessage = useMemo(
    () => `Maximum working days allowed is ${DAYS_WORKED_HARD_LIMIT}`,
    []
  );

  const onApprove = useCallback(() => {
    onApproveExtraWorkingDays();
    setIsModalOpen(false);
  }, [onApproveExtraWorkingDays]);

  const onDismiss = () => {
    onWorkingDaysChange(daysWorked - 1);
    setIsModalOpen(false);
  };

  return (
    <div className={cn(styles.container, className)}>
      <span className={styles.iconPlaceholder}>
        {daysWorkedIsUpdated && (
          <IconCheckmarkCircled
            className={styles.checkmarkIcon}
            onTimeout={onWorkingDaysUpdateHintTimeout}
            timeout={updateHintTimeout}
          />
        )}
      </span>
      <div
        className={styles.daysWorkedControl}
        onClick={stopPropagation}
        role="button"
        tabIndex={0}
      >
        <input
          disabled={isDisabled}
          readOnly
          className={styles.input}
          name={controlName}
          value={daysWorked}
        />
        <Tooltip
          className={styles.btnMinus}
          targetClassName={cn(styles.tooltipTarget, {
            [styles.notAllowed]: isBtnMinusDisabled,
          })}
          tooltipClassName={styles.tooltip}
          content={decreaseDaysWorkedMessage}
          isDisabled={!isBtnMinusDisabled || isDisabled || daysWorked === 0}
          strategy="fixed"
        >
          <button
            className={styles.btnMinus}
            disabled={isBtnMinusDisabled}
            onClick={(event) => {
              event.stopPropagation();
              if (!isDisabled) {
                onWorkingDaysChange(Math.max(daysWorked - 1, daysPaid));
              }
            }}
          />
        </Tooltip>
        <Tooltip
          className={styles.btnPlus}
          targetClassName={cn(styles.tooltipTarget, {
            [styles.notAllowed]: isBtnPlusDisabled,
          })}
          tooltipClassName={styles.tooltip}
          content={increaseDaysWorkedMessage}
          isDisabled={!isBtnPlusDisabled || isDisabled}
          strategy="fixed"
        >
          <button
            className={styles.btnPlus}
            disabled={isBtnPlusDisabled}
            onClick={(event) => {
              event.stopPropagation();
              if (!isDisabled) {
                onWorkingDaysChange(daysWorked + 1);
                if (daysWorked + 1 > daysWorkedMax && !daysWorkedAllowExtra) {
                  setIsModalOpen(true);
                }
              }
            }}
          />
        </Tooltip>
      </div>
      <Modal
        approveText="Yes, increase"
        dismissText="No"
        title="Confirmation"
        isOpen={isModalOpen}
        onApprove={onApprove}
        onDismiss={onDismiss}
      >{`The Resource Booking has only ${daysWorkedMax} real working days
          on this week. Are you sure you would like to increase the number of
          Working Days to more?`}</Modal>
    </div>
  );
};

PeriodWorkingDays.propTypes = {
  bookingStart: PT.string.isRequired,
  bookingEnd: PT.string.isRequired,
  className: PT.string,
  controlName: PT.string.isRequired,
  data: PT.shape({
    daysPaid: PT.number.isRequired,
    daysWorked: PT.number.isRequired,
    daysWorkedAllowExtra: PT.bool.isRequired,
    daysWorkedMax: PT.number.isRequired,
    daysWorkedIsUpdated: PT.bool.isRequired,
  }).isRequired,
  isDisabled: PT.bool.isRequired,
  onApproveExtraWorkingDays: PT.func.isRequired,
  onWorkingDaysChange: PT.func.isRequired,
  onWorkingDaysUpdateHintTimeout: PT.func.isRequired,
  updateHintTimeout: PT.number,
};

export default PeriodWorkingDays;
