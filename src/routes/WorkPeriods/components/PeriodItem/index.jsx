import React, { memo, useCallback, useMemo } from "react";
import { useDispatch } from "react-redux";
import PT from "prop-types";
import cn from "classnames";
import debounce from "lodash/debounce";
import Checkbox from "components/Checkbox";
import JobName from "components/JobName";
import ProjectName from "components/ProjectName";
import Tooltip from "components/Tooltip";
import PaymentError from "../PaymentError";
import PaymentStatus from "../PaymentStatus";
import PaymentTotal from "../PaymentTotal";
import PeriodActions from "../PeriodActions";
import PeriodAlerts from "../PeriodAlerts";
import PeriodWorkingDays from "../PeriodWorkingDays";
import PeriodDetails from "../PeriodDetails";
import ProcessingError from "../ProcessingError";
import {
  PAYMENT_STATUS,
  REASON_DISABLED_MESSAGE_MAP,
} from "constants/workPeriods";
import {
  setWorkPeriodWorkingDays,
  toggleWorkingDaysAllowExtra,
  toggleWorkingDaysUpdated,
  toggleWorkPeriod,
} from "store/actions/workPeriods";
import {
  toggleWorkPeriodDetails,
  updateWorkPeriodWorkingDays,
} from "store/thunks/workPeriods";
import { useUpdateEffect } from "utils/hooks";
import {
  formatDate,
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
 * @param {boolean} props.isSelected whether the item is selected
 * @param {Object} props.item object describing a working period
 * @param {Array} [props.alerts] array with alert ids
 * @param {Object} props.data changeable working period data such as working days
 * @param {Object} [props.details] object with working period details
 * @param {Object} [props.reasonFailed] error object denoting payment processing failure
 * @param {Array} [props.reasonsDisabled] array of REASON_DISABLED values.
 * @returns {JSX.Element}
 */
const PeriodItem = ({
  isDisabled = false,
  isSelected,
  item,
  alerts,
  data,
  details,
  reasonFailed,
  reasonsDisabled,
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

  const onApproveExtraWorkingDays = useCallback(() => {
    dispatch(toggleWorkingDaysAllowExtra(item.id, true));
  }, [dispatch, item.id]);

  const onWorkingDaysUpdateHintTimeout = useCallback(() => {
    dispatch(toggleWorkingDaysUpdated(item.id, false));
  }, [dispatch, item.id]);

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

  const jobName = useMemo(
    () => (
      <span className={styles.tooltipContent}>
        <span className={styles.tooltipLabel}>Job Name:</span>&nbsp;
        <JobName jobId={item.jobId} />
      </span>
    ),
    [item.jobId]
  );

  const projectId = useMemo(
    () => (
      <span className={styles.tooltipContent}>
        <span className={styles.tooltipLabel}>Project ID:</span>&nbsp;
        {item.projectId}
      </span>
    ),
    [item.projectId]
  );

  const reasonsDisabledElement = useMemo(
    () => (
      <div className={styles.tooltipContent}>
        {formatReasonsDisabled(reasonsDisabled)}
      </div>
    ),
    [reasonsDisabled]
  );

  return (
    <>
      <tr
        className={cn(styles.container, {
          [styles.hasDetails]: !!details,
          [styles.isFailed]: !!reasonFailed,
        })}
        onClick={onToggleItemDetails}
      >
        <td className={styles.toggle}>
          <Tooltip
            content={reasonsDisabledElement}
            isDisabled={!reasonsDisabled}
            strategy="fixed"
            targetClassName={styles.checkboxContainer}
          >
            <Checkbox
              className={styles.selectionCheckbox}
              size="small"
              isDisabled={isDisabled || !!reasonsDisabled}
              checked={isSelected}
              name={`wp_chb_${item.id}`}
              onChange={onToggleItem}
              option={{ value: item.id }}
              stopClickPropagation={true}
            />
          </Tooltip>
          <span className={styles.processingError}>
            {reasonFailed && (
              <ProcessingError error={reasonFailed} popupStrategy="fixed" />
            )}
          </span>
        </td>
        <td className={styles.userHandle}>
          <Tooltip
            content={jobName}
            targetClassName={styles.userHandleContainer}
          >
            <a
              href={formatUserHandleLink(item.projectId, item.rbId)}
              onClick={stopPropagation}
              target="_blank"
              rel="noreferrer"
            >
              {item.userHandle}
            </a>
          </Tooltip>
        </td>
        <td className={styles.teamName}>
          <Tooltip content={projectId}>
            <ProjectName projectId={item.projectId} />
          </Tooltip>
        </td>
        <td className={styles.startDate}>{formatDate(item.bookingStart)}</td>
        <td className={styles.endDate}>{formatDate(item.bookingEnd)}</td>
        <td className={styles.alert}>
          <PeriodAlerts alerts={alerts} />
        </td>
        <td className={styles.weeklyRate}>
          <span>{formatWeeklyRate(item.weeklyRate)}</span>
        </td>
        <td className={styles.paymentTotal}>
          {data.paymentErrorLast && (
            <PaymentError
              className={styles.paymentError}
              errorDetails={data.paymentErrorLast}
              isImportant={data.paymentStatus !== PAYMENT_STATUS.COMPLETED}
              popupStrategy="fixed"
            />
          )}
          <PaymentTotal
            className={styles.paymentTotalContainer}
            daysPaid={data.daysPaid}
            daysWorked={data.daysWorked}
            payments={data.payments}
            paymentTotal={data.paymentTotal}
            popupStrategy="fixed"
          />
        </td>
        <td>
          <PaymentStatus status={data.paymentStatus} />
        </td>
        <td className={styles.daysWorked}>
          <PeriodWorkingDays
            bookingStart={item.bookingStart}
            bookingEnd={item.bookingEnd}
            controlName={`wp_wrk_days_${item.id}`}
            data={data}
            isDisabled={isDisabled}
            onApproveExtraWorkingDays={onApproveExtraWorkingDays}
            onWorkingDaysChange={onWorkingDaysChange}
            onWorkingDaysUpdateHintTimeout={onWorkingDaysUpdateHintTimeout}
            updateHintTimeout={2000}
          />
        </td>
        <td>
          <PeriodActions period={item} periodData={data} />
        </td>
      </tr>
      {details && (
        <PeriodDetails
          className={styles.periodDetails}
          period={item}
          details={details}
          isDisabled={isDisabled}
          isFailed={!!reasonFailed}
        />
      )}
    </>
  );
};

/**
 * Returns a string produced by concatenation of all provided reasons some
 * working period is disabled.
 *
 * @param {Array} reasonIds array of REASON_DISABLED values
 * @returns {any}
 */
function formatReasonsDisabled(reasonIds) {
  if (!reasonIds) {
    return null;
  }
  if (reasonIds.length === 1) {
    return REASON_DISABLED_MESSAGE_MAP[reasonIds[0]];
  }
  const reasons = [];
  for (let i = 0, len = reasonIds.length; i < len; i++) {
    let reasonId = reasonIds[i];
    reasons.push(
      <li key={reasonId}>{REASON_DISABLED_MESSAGE_MAP[reasonId]}</li>
    );
  }
  return <ul>{reasons}</ul>;
}

PeriodItem.propTypes = {
  className: PT.string,
  isDisabled: PT.bool,
  isSelected: PT.bool.isRequired,
  item: PT.shape({
    id: PT.oneOfType([PT.number, PT.string]).isRequired,
    jobId: PT.string,
    rbId: PT.string.isRequired,
    billingAccountId: PT.number.isRequired,
    projectId: PT.oneOfType([PT.number, PT.string]).isRequired,
    userHandle: PT.string.isRequired,
    teamName: PT.oneOfType([PT.number, PT.string]).isRequired,
    bookingStart: PT.string.isRequired,
    bookingEnd: PT.string.isRequired,
    weeklyRate: PT.number,
  }).isRequired,
  alerts: PT.arrayOf(PT.string),
  data: PT.shape({
    daysPaid: PT.number.isRequired,
    daysWorked: PT.number.isRequired,
    paymentErrorLast: PT.object,
    payments: PT.array,
    paymentStatus: PT.string.isRequired,
    paymentTotal: PT.number.isRequired,
  }).isRequired,
  details: PT.shape({
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
  reasonFailed: PT.object,
  reasonsDisabled: PT.arrayOf(PT.string),
};

export default memo(PeriodItem);
