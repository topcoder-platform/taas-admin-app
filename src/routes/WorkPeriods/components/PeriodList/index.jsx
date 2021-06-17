import React from "react";
import { useSelector } from "react-redux";
import PT from "prop-types";
import cn from "classnames";
import ProjectNameContextProvider from "components/ProjectNameContextProvider";
import PeriodItem from "../PeriodItem";
import PeriodListHead from "../PeriodListHead";
import {
  getWorkPeriods,
  getWorkPeriodsData,
  getWorkPeriodsDetails,
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
  const [periodsData] = useSelector(getWorkPeriodsData);
  const periodsDetails = useSelector(getWorkPeriodsDetails);
  const periodsFailed = useSelector(getWorkPeriodsFailed);
  const periodsSelected = useSelector(getWorkPeriodsSelected);
  const isProcessingPayments = useSelector(getWorkPeriodsIsProcessingPayments);

  return (
    <ProjectNameContextProvider>
      <div className={cn(styles.container, className)}>
        <table className={styles.table}>
          <thead>
            <PeriodListHead />
          </thead>
          <tbody>
            <tr>
              <td colSpan={9} className={styles.listTopMargin}></td>
            </tr>
            {periods.map((period) => (
              <PeriodItem
                key={period.id}
                isDisabled={isProcessingPayments}
                isFailed={period.id in periodsFailed}
                isSelected={period.id in periodsSelected}
                item={period}
                data={periodsData[period.id]}
                details={periodsDetails[period.id]}
              />
            ))}
          </tbody>
        </table>
      </div>
    </ProjectNameContextProvider>
  );
};

PeriodList.propTypes = {
  className: PT.string,
};

export default PeriodList;
