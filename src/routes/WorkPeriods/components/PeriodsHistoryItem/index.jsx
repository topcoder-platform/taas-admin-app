import React, { memo, useCallback } from "react";
import { useDispatch } from "react-redux";
import PT from "prop-types";
import cn from "classnames";
import debounce from "lodash/debounce";
import moment from "moment";
import IntegerField from "components/IntegerField";
import PaymentError from "../PaymentError";
import PaymentStatus from "../PaymentStatus";
import PaymentTotal from "../PaymentTotal";
import { PAYMENT_STATUS } from "constants/workPeriods";
import { setDetailsWorkingDays } from "store/actions/workPeriods";
import { updateWorkPeriodWorkingDays } from "store/thunks/workPeriods";
import { useUpdateEffect } from "utils/hooks";
import { formatDateLabel, formatDateRange } from "utils/formatters";
import styles from "./styles.module.scss";

/**
 * Displays working period row in history table in details view.
 *
 * @param {Object} props component properties
 * @returns {JSX.Element}
 */
const PeriodsHistoryItem = ({ isDisabled, item, data, currentStartDate }) => {
  const dispatch = useDispatch();

  const dateLabel = formatDateLabel(item.startDate, currentStartDate);
  const daysWorked = data.daysWorked;
  const isCurrent = moment(item.startDate).isSame(currentStartDate, "date");

  const onWorkingDaysChange = useCallback(
    (daysWorked) => {
      dispatch(setDetailsWorkingDays(item.id, daysWorked));
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
    if (!isCurrent) {
      updateWorkingDays(data.daysWorked);
    }
  }, [data.daysWorked, isCurrent]);

  return (
    <tr
      className={cn(styles.container, {
        [styles.current]: dateLabel === "Current Period",
      })}
    >
      <td className={styles.dateRange}>
        {formatDateRange(item.startDate, item.endDate)}
      </td>
      <td className={styles.dateLabel}>{dateLabel}</td>
      <td className={styles.paymentTotal}>
        {data.paymentErrorLast && (
          <PaymentError
            className={styles.paymentError}
            errorDetails={data.paymentErrorLast}
            isImportant={data.paymentStatus !== PAYMENT_STATUS.COMPLETED}
          />
        )}
        <PaymentTotal
          className={styles.paymentTotalContainer}
          payments={data.payments}
          paymentTotal={data.paymentTotal}
          daysPaid={data.daysPaid}
        />
      </td>
      <td className={styles.paymentStatus}>
        <PaymentStatus status={data.paymentStatus} />
      </td>
      <td className={styles.daysWorked}>
        {data.paymentStatus === PAYMENT_STATUS.COMPLETED ? (
          `${daysWorked} ${daysWorked === 1 ? "Day" : "Days"}`
        ) : (
          <IntegerField
            className={styles.daysWorkedControl}
            name={`wp_det_wd_${item.id}`}
            isDisabled={isDisabled}
            onChange={onWorkingDaysChange}
            value={daysWorked}
            maxValue={5}
            minValue={data.daysPaid}
          />
        )}
      </td>
    </tr>
  );
};

PeriodsHistoryItem.propTypes = {
  isDisabled: PT.bool.isRequired,
  item: PT.shape({
    id: PT.string.isRequired,
    startDate: PT.oneOfType([PT.string, PT.number]).isRequired,
    endDate: PT.oneOfType([PT.string, PT.number]).isRequired,
    weeklyRate: PT.number,
  }).isRequired,
  data: PT.shape({
    daysWorked: PT.number.isRequired,
    daysPaid: PT.number.isRequired,
    paymentErrorLast: PT.object,
    payments: PT.array,
    paymentStatus: PT.string.isRequired,
    paymentTotal: PT.number.isRequired,
  }).isRequired,
  currentStartDate: PT.oneOfType([PT.string, PT.number, PT.object]).isRequired,
};

export default memo(PeriodsHistoryItem);
