import React, { useMemo } from "react";
import PT from "prop-types";
import cn from "classnames";
import Tooltip from "components/Tooltip";
import IconCheckmarkCircled from "components/Icons/CheckmarkCircled";
import { formatDate } from "utils/formatters";
import { stopPropagation } from "utils/misc";
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
 * @param {(v: number) => void} props.onWorkingDaysChange function called when
 * working days change
 * @param {() => void} props.onWorkingDaysUpdateHintTimeout function called when
 * update hint icon has finished its animation
 * @param {number} [props.updateHintTimeout] timeout in milliseconds for update
 * hint icon
 * @returns {JSX.Element}
 */
const PeriodWorkingDays = ({
  bookingStart,
  bookingEnd,
  className,
  controlName,
  data: { daysPaid, daysWorked, daysWorkedMax, daysWorkedIsUpdated },
  isDisabled,
  onWorkingDaysChange,
  onWorkingDaysUpdateHintTimeout,
  updateHintTimeout = 2000,
}) => {
  const isBtnMinusDisabled =
    daysWorked === 0 || (daysWorked > 0 && daysWorked <= daysPaid);
  const isBtnPlusDisabled = daysWorked < 5 && daysWorked >= daysWorkedMax;
  const decreaseDaysWorkedMessage = useMemo(
    () => `Cannot decrease "Working Days" below the number of days already
      paid for: ${daysPaid}`,
    [daysPaid]
  );
  const increaseDaysWorkedMessage = useMemo(
    () => `Cannot increase "Working Days" because the Resource Booking period
    is between ${formatDate(bookingStart)} and ${formatDate(bookingEnd)}`,
    [bookingStart, bookingEnd]
  );

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
                onWorkingDaysChange(Math.min(daysWorked + 1, daysWorkedMax));
              }
            }}
          />
        </Tooltip>
      </div>
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
    daysWorkedMax: PT.number.isRequired,
    daysWorkedIsUpdated: PT.bool.isRequired,
  }).isRequired,
  isDisabled: PT.bool.isRequired,
  onWorkingDaysChange: PT.func.isRequired,
  onWorkingDaysUpdateHintTimeout: PT.func.isRequired,
  updateHintTimeout: PT.number,
};

export default PeriodWorkingDays;
