import React from "react";
import { useSelector } from "react-redux";
import PT from "prop-types";
import cn from "classnames";
import JobNameProvider from "components/JobNameProvider";
import ProjectNameProvider from "components/ProjectNameProvider";
import PeriodItem from "../PeriodItem";
import PeriodListHead from "../PeriodListHead";
import {
  getWorkPeriods,
  getWorkPeriodsAlerts,
  getWorkPeriodsData,
  getWorkPeriodsDetails,
  getWorkPeriodsDisabled,
  getWorkPeriodsFailed,
  getWorkPeriodsIsProcessingPayments,
  getWorkPeriodsSelected,
} from "store/selectors/workPeriods";
import styles from "./styles.module.scss";

/**
 * Displays the list of the working periods with column headers.
 *
 * @param {Object} props component properties
 * @param {string} [props.className] class name to be added to root element
 * @returns {JSX.Element}
 */
const PeriodList = ({ className }) => {
  const periods = useSelector(getWorkPeriods);
  const periodsAlerts = useSelector(getWorkPeriodsAlerts);
  const [periodsData] = useSelector(getWorkPeriodsData);
  const periodsDetails = useSelector(getWorkPeriodsDetails);
  const [periodsDisabledMap] = useSelector(getWorkPeriodsDisabled);
  const periodsFailed = useSelector(getWorkPeriodsFailed);
  const [periodsSelectedSet] = useSelector(getWorkPeriodsSelected);
  const isProcessingPayments = useSelector(getWorkPeriodsIsProcessingPayments);

  return (
    <JobNameProvider>
      <ProjectNameProvider>
        <div
          className={cn(
            styles.container,
            { [styles.hasItems]: periods.length },
            className
          )}
        >
          <table className={styles.table}>
            <thead>
              <PeriodListHead />
            </thead>
            <tbody>
              <tr>
                <td colSpan={11} className={styles.listTopMargin}></td>
              </tr>
              {periods.map((period) => (
                <PeriodItem
                  key={period.id}
                  isDisabled={isProcessingPayments}
                  isSelected={periodsSelectedSet.has(period.id)}
                  item={period}
                  alerts={periodsAlerts[period.id]}
                  data={periodsData[period.id]}
                  details={periodsDetails[period.id]}
                  reasonFailed={periodsFailed[period.id]}
                  reasonsDisabled={periodsDisabledMap.get(period.id)}
                />
              ))}
            </tbody>
          </table>
        </div>
      </ProjectNameProvider>
    </JobNameProvider>
  );
};

PeriodList.propTypes = {
  className: PT.string,
};

export default PeriodList;
