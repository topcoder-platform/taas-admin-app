import React from "react";
import { useSelector } from "react-redux";
import PT from "prop-types";
import cn from "classnames";
import { getWorkPeriodsTotalCount } from "store/selectors/workPeriods";
import styles from "./styles.module.scss";

/**
 * Displays the total number of working periods for current filters.
 *
 * @param {Object} props component properties
 * @param {string} [props.className] class name to be added to root element
 * @returns {JSX.Element}
 */
const PeriodCount = ({ className }) => {
  const totalCount = useSelector(getWorkPeriodsTotalCount);

  return (
    <div className={cn(styles.container, className)}>
      Resources ({totalCount})
    </div>
  );
};

PeriodCount.propTypes = {
  className: PT.string,
};

export default PeriodCount;
