import React from "react";
import { useSelector } from "react-redux";
import PT from "prop-types";
import cn from "classnames";
import PeriodHistoryItem from "../PeriodsHistoryItem";
import {
  getWorkPeriodsData,
  getWorkPeriodsDateRange,
} from "store/selectors/workPeriods";
import styles from "./styles.module.scss";

/**
 * Displays all working periods' history.
 *
 * @param {Object} props component properties
 * @returns {JSX.Element}
 */
const PeriodsHistory = ({ className, isDisabled, periods }) => {
  const [periodsData] = useSelector(getWorkPeriodsData);
  const [startDate] = useSelector(getWorkPeriodsDateRange);
  return (
    <div className={cn(styles.container, className)}>
      <table>
        <tbody>
          {periods.map((period) => (
            <PeriodHistoryItem
              key={period.id}
              isDisabled={isDisabled}
              item={period}
              data={periodsData[period.id]}
              currentStartDate={startDate}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

PeriodsHistory.propTypes = {
  className: PT.string,
  isDisabled: PT.bool.isRequired,
  periods: PT.arrayOf(PT.object),
};

export default PeriodsHistory;
