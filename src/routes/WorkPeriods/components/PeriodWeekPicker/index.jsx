import React, { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import PT from "prop-types";
import cn from "classnames";
import moment from "moment";
import WeekPicker from "components/WeekPicker";
import { getWorkPeriodsDateRange } from "store/selectors/workPeriods";
import { setWorkPeriodsDateRange } from "store/actions/workPeriods";
import { updateQueryFromState } from "store/thunks/workPeriods";
import styles from "./styles.module.scss";

/**
 * Displays working periods' week picker.
 *
 * @param {Object} props component properties
 * @param {string} [props.className] class name to be added to root element
 * @returns {JSX.Element}
 */
const PeriodWeekPicker = ({ className }) => {
  const [startDate, endDate] = useSelector(getWorkPeriodsDateRange);
  const dispatch = useDispatch();

  const onWeekSelect = useCallback(
    (date) => {
      dispatch(setWorkPeriodsDateRange(moment(date)));
      dispatch(updateQueryFromState());
    },
    [dispatch]
  );

  const onNextWeekSelect = useCallback(() => {
    dispatch(setWorkPeriodsDateRange(startDate.clone().add(1, "week")));
    dispatch(updateQueryFromState());
  }, [startDate, dispatch]);

  const onPreviousWeekSelect = useCallback(() => {
    dispatch(setWorkPeriodsDateRange(startDate.clone().add(-1, "week")));
    dispatch(updateQueryFromState());
  }, [startDate, dispatch]);

  return (
    <WeekPicker
      className={cn(styles.container, className)}
      startDate={startDate}
      endDate={endDate}
      onWeekSelect={onWeekSelect}
      onNextWeekSelect={onNextWeekSelect}
      onPreviousWeekSelect={onPreviousWeekSelect}
    />
  );
};

PeriodWeekPicker.propTypes = {
  className: PT.string,
};

export default PeriodWeekPicker;
