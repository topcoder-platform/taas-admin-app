import React, { memo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import debounce from "lodash/debounce";
import PT from "prop-types";
import cn from "classnames";
import Button from "components/Button";
import CheckboxList from "components/CheckboxList";
import SearchHandleField from "components/SearchHandleField";
import SidebarSection from "components/SidebarSection";
import Toggle from "components/Toggle";
import { PAYMENT_STATUS, ALERT } from "constants/workPeriods";
import { getWorkPeriodsFilters } from "store/selectors/workPeriods";
import {
  resetWorkPeriodsFilters,
  setWorkPeriodsPaymentStatuses,
  setAlertOption,
  setWorkPeriodsUserHandle,
  toggleShowFailedPaymentsOnly,
} from "store/actions/workPeriods";
import {
  loadWorkPeriodsPage,
  updateQueryFromState,
} from "store/thunks/workPeriods";
import { useUpdateEffect } from "utils/hooks";
import { preventDefault } from "utils/misc";
import styles from "./styles.module.scss";

/**
 * Displays working periods' filters like user handle search control or
 * payment status checkboxes.
 *
 * @param {Object} props component properties
 * @param {string} [props.className] optional class name added to root element
 * @returns {JSX.Element}
 */
const PeriodFilters = ({ className }) => {
  const dispatch = useDispatch();
  const filters = useSelector(getWorkPeriodsFilters);
  const { onlyFailedPayments, paymentStatuses, alertOptions, userHandle } =
    filters;

  const onToggleFailedPayments = useCallback(
    (on) => {
      dispatch(toggleShowFailedPaymentsOnly(on));
      dispatch(updateQueryFromState());
    },
    [dispatch]
  );

  const onUserHandleChange = useCallback(
    (value) => {
      dispatch(setWorkPeriodsUserHandle(value));
      dispatch(updateQueryFromState());
    },
    [dispatch]
  );

  const onPaymentStatusesChange = useCallback(
    (statuses) => {
      dispatch(setWorkPeriodsPaymentStatuses(statuses));
      dispatch(updateQueryFromState());
    },
    [dispatch]
  );

  const onAlertOptionsChange = useCallback(
    (option) => {
      dispatch(setAlertOption(option));
      dispatch(updateQueryFromState());
    },
    [dispatch]
  );

  const onClearFilter = useCallback(() => {
    dispatch(resetWorkPeriodsFilters());
    dispatch(updateQueryFromState());
  }, [dispatch]);

  const loadWorkingPeriodsFirstPage = useCallback(
    debounce(
      () => {
        dispatch(loadWorkPeriodsPage);
      },
      300,
      { leading: false }
    ),
    [dispatch]
  );

  // Load working periods' first page when any filter option changes.
  useUpdateEffect(loadWorkingPeriodsFirstPage, [filters]);

  return (
    <form
      className={cn(styles.container, className)}
      action="#"
      onSubmit={preventDefault}
    >
      <div className={styles.handleSection}>
        <SearchHandleField
          id="topcoder-handle"
          name="topcoder_handle"
          placeholder="Search Topcoder Handle"
          onChange={onUserHandleChange}
          value={userHandle}
        />
      </div>
      <SidebarSection label="Payment Status">
        <CheckboxList
          name="payment_status[]"
          onChange={onPaymentStatusesChange}
          options={PAYMENT_STATUS_OPTIONS}
          value={paymentStatuses}
        />
      </SidebarSection>
      <div className={styles.onlyFailedPayments}>
        <label htmlFor="only-failed-payments">With Failed Payments</label>
        <Toggle
          id="only-failed-payments"
          name="tgl_only_failed_payments"
          size="small"
          isOn={onlyFailedPayments}
          onChange={onToggleFailedPayments}
        />
      </div>
      <SidebarSection label="Misc Filters">
        <CheckboxList
          name="alert_option[]"
          onChange={onAlertOptionsChange}
          options={ALERT_OPTIONS}
          value={alertOptions}
        />
      </SidebarSection>
      <div className={styles.buttons}>
        <Button className={styles.button} size="small" onClick={onClearFilter}>
          Clear Filter
        </Button>
      </div>
    </form>
  );
};

PeriodFilters.propTypes = {
  className: PT.string,
};

const PAYMENT_STATUS_OPTIONS = [
  { value: PAYMENT_STATUS.PENDING, label: "Pending" },
  { value: PAYMENT_STATUS.COMPLETED, label: "Completed" },
  { value: PAYMENT_STATUS.PARTIALLY_COMPLETED, label: "Partially Completed" },
  { value: PAYMENT_STATUS.IN_PROGRESS, label: "In Progress" },
  { value: PAYMENT_STATUS.NO_DAYS, label: "No Days" },
];

const ALERT_OPTIONS = [
  { value: ALERT.BA_NOT_ASSIGNED, label: "No BA Assigned" },
  { value: ALERT.ONBOARDING_WEEK, label: "Onboarding Week" },
  { value: ALERT.LAST_BOOKING_WEEK, label: "Last Booking Week" },
];

export default memo(PeriodFilters);
