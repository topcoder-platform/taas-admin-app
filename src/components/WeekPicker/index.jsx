import React, { forwardRef, useCallback, useRef } from "react";
import PT from "prop-types";
import cn from "classnames";
import DatePicker from "react-datepicker";
import Button from "components/Button";
import IconArrowLeft from "components/Icons/ArrowLeft";
import IconArrowRight from "components/Icons/ArrowRight";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./styles.module.scss";

/**
 * Displays a control which allows to select a specific date using dropdown calendar
 * or "next" and "previous" buttons. This control is used for week selection.
 *
 * @param {Object} props
 * @param {string} [props.className] class name to be added to root element
 * @param {Object} props.startDate momentjs object describing selection's start date
 * @param {Object} props.endDate momentjs object describing selection's end date
 * @param {() => void} props.onWeekSelect function called on date select
 * @param {() => void} props.onNextWeekSelect function called on next week button click
 * @param {() => void} props.onPreviousWeekSelect function called on previous week button click
 * @returns {JSX.Element}
 */
const WeekPicker = ({
  className,
  startDate,
  endDate,
  onWeekSelect,
  onNextWeekSelect,
  onPreviousWeekSelect,
}) => {
  const isOpenRef = useRef(false);
  const wasInputClickedRef = useRef(false);

  const onCalendarOpen = useCallback(() => {
    isOpenRef.current = true;
    wasInputClickedRef.current = false;
  }, []);

  const onCalendarClose = useCallback(() => {
    isOpenRef.current = false;
  }, []);

  // @ts-ignore
  const CustomInput = forwardRef(({ onClick }, ref) => (
    <div
      ref={ref}
      className={styles.customInput}
      onMouseDown={() => {
        if (isOpenRef.current) {
          wasInputClickedRef.current = true;
        }
      }}
      onClick={() => {
        if (!isOpenRef.current && !wasInputClickedRef.current) {
          onClick();
        }
        wasInputClickedRef.current = false;
      }}
      tabIndex={0}
      role="button"
    >
      <Button
        size="small"
        style="circle"
        onClick={(event) => {
          wasInputClickedRef.current = false;
          event.stopPropagation();
          event.preventDefault();
          onPreviousWeekSelect();
        }}
      >
        <IconArrowLeft />
      </Button>
      <span className={styles.dateRange}>
        {formatDateRange(startDate, endDate)}
      </span>
      <Button
        size="small"
        style="circle"
        onClick={(event) => {
          wasInputClickedRef.current = false;
          event.stopPropagation();
          event.preventDefault();
          onNextWeekSelect();
        }}
      >
        <IconArrowRight />
      </Button>
    </div>
  ));
  CustomInput.displayName = "CustomInput";
  CustomInput.propTypes = {
    // @ts-ignore
    onClick: PT.func,
  };

  return (
    <div className={cn(styles.container, className)}>
      <DatePicker
        selected={startDate.toDate()}
        startDate={startDate.toDate()}
        endDate={endDate.toDate()}
        onChange={onWeekSelect}
        onCalendarOpen={onCalendarOpen}
        onCalendarClose={onCalendarClose}
        showMonthDropdown
        showYearDropdown
        formatWeekDay={formatWeekDay}
        customInput={<CustomInput />}
        popperPlacement="top-center"
      />
    </div>
  );
};

WeekPicker.propTypes = {
  className: PT.string,
  startDate: PT.object.isRequired,
  endDate: PT.object.isRequired,
  onWeekSelect: PT.func.isRequired,
  onNextWeekSelect: PT.func.isRequired,
  onPreviousWeekSelect: PT.func.isRequired,
};

const DATE_FORMAT = "MM/DD";

function formatDateRange(startDate, endDate) {
  return `${startDate.format(DATE_FORMAT)} - ${endDate.format(DATE_FORMAT)}`;
}

function formatWeekDay(dayName) {
  return dayName.slice(0, 3);
}

export default WeekPicker;
