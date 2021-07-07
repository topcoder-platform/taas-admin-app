import React, { memo, useCallback } from "react";
import { useDispatch } from "react-redux";
import PT from "prop-types";
import cn from "classnames";
import debounce from "lodash/debounce";
import ProcessingError from "../PaymentError";
import PaymentStatus from "../PaymentStatus";
import PaymentTotal from "../PaymentTotal";
import PeriodWorkingDays from "../PeriodWorkingDays";
import { PAYMENT_STATUS } from "constants/workPeriods";
import {
  setDetailsWorkingDays,
  toggleWorkingDaysUpdated,
} from "store/actions/workPeriods";
import { updateWorkPeriodWorkingDays } from "store/thunks/workPeriods";
import { useUpdateEffect } from "utils/hooks";
import {
  formatDateLabel,
  formatDateRange,
  formatPlural,
} from "utils/formatters";
import styles from "./styles.module.scss";

/**
 * Displays working period row in history table in details view.
 *
 * @param {Object} props component properties
 * @returns {JSX.Element}
 */
const PeriodsHistoryItem = ({
  bookingStart,
  bookingEnd,
  isDisabled,
  item,
  data,
  currentStartDate,
}) => {
  const dispatch = useDispatch();

  const dateLabel = formatDateLabel(item.start, currentStartDate);
  const daysWorked = data.daysWorked;
  const isCurrent = item.start.isSame(currentStartDate, "date");

  const onWorkingDaysChange = useCallback(
    (daysWorked) => {
      dispatch(setDetailsWorkingDays(item.id, daysWorked));
    },
    [dispatch, item.id]
  );

  const onWorkingDaysUpdateHintTimeout = useCallback(() => {
    dispatch(toggleWorkingDaysUpdated(item.id, false));
  }, [dispatch, item.id]);

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
      updateWorkingDays(daysWorked);
    }
  }, [daysWorked, isCurrent]);

  return (
    <tr
      className={cn(styles.container, {
        [styles.current]: dateLabel === "Current Period",
      })}
    >
      <td className={styles.dateRange}>
        {formatDateRange(item.start, item.end)}
      </td>
      <td className={styles.dateLabel}>{dateLabel}</td>
      <td className={styles.paymentTotal}>
        {data.paymentErrorLast && (
          <ProcessingError
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
          <span className={styles.daysWorkedLabel}>
            {formatPlural(daysWorked, "Day")}
          </span>
        ) : (
          <PeriodWorkingDays
            bookingStart={bookingStart}
            bookingEnd={bookingEnd}
            controlName={`wp_det_wd_${item.id}`}
            data={data}
            isDisabled={isDisabled}
            onWorkingDaysChange={onWorkingDaysChange}
            onWorkingDaysUpdateHintTimeout={onWorkingDaysUpdateHintTimeout}
            updateHintTimeout={2000}
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
    start: PT.object.isRequired,
    end: PT.object.isRequired,
    weeklyRate: PT.number,
  }).isRequired,
  data: PT.shape({
    daysPaid: PT.number.isRequired,
    daysWorked: PT.number.isRequired,
    paymentErrorLast: PT.object,
    payments: PT.array,
    paymentStatus: PT.string.isRequired,
    paymentTotal: PT.number.isRequired,
  }).isRequired,
  bookingStart: PT.string.isRequired,
  bookingEnd: PT.string.isRequired,
  currentStartDate: PT.oneOfType([PT.string, PT.number, PT.object]).isRequired,
};

export default memo(PeriodsHistoryItem);
