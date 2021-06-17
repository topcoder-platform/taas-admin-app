import React, { memo, useCallback } from "react";
import { useDispatch } from "react-redux";
import PT from "prop-types";
import cn from "classnames";
import debounce from "lodash/debounce";
import Checkbox from "components/Checkbox";
import IntegerField from "components/IntegerField";
import ProjectName from "components/ProjectName";
import PaymentStatus from "../PaymentStatus";
import PeriodDetails from "../PeriodDetails";
import {
  setWorkPeriodWorkingDays,
  toggleWorkPeriod,
} from "store/actions/workPeriods";
import {
  toggleWorkPeriodDetails,
  updateWorkPeriodWorkingDays,
} from "store/thunks/workPeriods";
import { useUpdateEffect } from "utils/hooks";
import {
  currencyFormatter,
  formatUserHandleLink,
  formatWeeklyRate,
} from "utils/formatters";
import { stopPropagation } from "utils/misc";
import styles from "./styles.module.scss";

/**
 * Displays the working period data row to be used in PeriodList component.
 *
 * @param {Object} props component properties
 * @param {boolean} [props.isDisabled] whether the item is disabled
 * @param {boolean} [props.isFailed] whether the item should be highlighted as failed
 * @param {boolean} props.isSelected whether the item is selected
 * @param {Object} props.item object describing a working period
 * @param {Object} props.data changeable working period data such as working days
 * @param {Object} [props.details] object with working period details
 * @returns {JSX.Element}
 */
const PeriodItem = ({
  isDisabled = false,
  isFailed = false,
  isSelected,
  item,
  data,
  details,
}) => {
  const dispatch = useDispatch();

  const onToggleItem = useCallback(
    (event) => {
      dispatch(toggleWorkPeriod(event.target.value));
    },
    [dispatch]
  );

  const onToggleItemDetails = useCallback(() => {
    dispatch(toggleWorkPeriodDetails(item));
  }, [dispatch, item]);

  const onWorkingDaysChange = useCallback(
    (daysWorked) => {
      dispatch(setWorkPeriodWorkingDays(item.id, daysWorked));
    },
    [dispatch, item.id]
  );

  const updateWorkingDays = useCallback(
    debounce(
      (daysWorked) => {
        dispatch(updateWorkPeriodWorkingDays(item.id, daysWorked));
      },
      300,
      { leading: false }
    ),
    [dispatch, item.id]
  );

  // Update working days on server if working days change.
  useUpdateEffect(() => {
    updateWorkingDays(data.daysWorked);
  }, [data.daysWorked]);

  return (
    <>
      <tr
        className={cn(styles.container, {
          [styles.hasDetails]: !!details,
          [styles.isFailed]: isFailed,
        })}
        onClick={onToggleItemDetails}
      >
        <td className={styles.toggle}>
          <Checkbox
            size="small"
            isDisabled={isDisabled}
            checked={isSelected}
            name={`wp_chb_${item.id}`}
            onChange={onToggleItem}
            option={{ value: item.id }}
            stopClickPropagation={true}
          />
        </td>
        <td className={styles.userHandle}>
          <span>
            <a
              href={formatUserHandleLink(item.projectId, item.rbId)}
              onClick={stopPropagation}
              target="_blank"
              rel="noreferrer"
            >
              {item.userHandle}
            </a>
          </span>
        </td>
        <td className={styles.teamName}>
          <ProjectName projectId={item.projectId} />
        </td>
        <td className={styles.startDate}>{item.startDate}</td>
        <td className={styles.endDate}>{item.endDate}</td>
        <td className={styles.weeklyRate}>
          <span>{formatWeeklyRate(item.weeklyRate)}</span>
        </td>
        <td className={styles.paymentTotal}>
          <span className={styles.paymentTotalSum}>
            {currencyFormatter.format(data.paymentTotal)}
          </span>
          <span className={styles.daysPaid}> ({data.daysPaid})</span>
        </td>
        <td>
          <PaymentStatus status={data.paymentStatus} />
        </td>
        <td className={styles.daysWorked}>
          <IntegerField
            className={styles.daysWorkedControl}
            isDisabled={isDisabled}
            name={`wp_wrk_days_${item.id}`}
            onChange={onWorkingDaysChange}
            maxValue={5}
            minValue={data.daysPaid}
            value={data.daysWorked}
          />
        </td>
      </tr>
      {details && (
        <PeriodDetails
          details={details}
          isDisabled={isDisabled}
          isFailed={isFailed}
        />
      )}
    </>
  );
};

PeriodItem.propTypes = {
  className: PT.string,
  isDisabled: PT.bool,
  isFailed: PT.bool,
  isSelected: PT.bool.isRequired,
  item: PT.shape({
    id: PT.oneOfType([PT.number, PT.string]).isRequired,
    rbId: PT.string.isRequired,
    projectId: PT.oneOfType([PT.number, PT.string]).isRequired,
    userHandle: PT.string.isRequired,
    teamName: PT.oneOfType([PT.number, PT.string]).isRequired,
    startDate: PT.string.isRequired,
    endDate: PT.string.isRequired,
    weeklyRate: PT.number,
  }).isRequired,
  data: PT.shape({
    daysWorked: PT.number.isRequired,
    daysPaid: PT.number.isRequired,
    paymentStatus: PT.string.isRequired,
    paymentTotal: PT.number.isRequired,
  }).isRequired,
  details: PT.shape({
    periodId: PT.string.isRequired,
    rbId: PT.string.isRequired,
    jobName: PT.string.isRequired,
    jobNameIsLoading: PT.bool.isRequired,
    billingAccountId: PT.number.isRequired,
    billingAccounts: PT.arrayOf(
      PT.shape({
        label: PT.string.isRequired,
        value: PT.number.isRequired,
      })
    ).isRequired,
    billingAccountsIsLoading: PT.bool.isRequired,
    periods: PT.array.isRequired,
    periodsIsLoading: PT.bool.isRequired,
  }),
};

export default memo(PeriodItem);
