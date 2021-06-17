import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import debounce from "lodash/debounce";
import PT from "prop-types";
import cn from "classnames";
import SidebarSection from "components/SidebarSection";
import Button from "components/Button";
import SearchHandleField from "components/SearchHandleField";
import CheckboxList from "components/CheckboxList";
import { PAYMENT_STATUS } from "constants/workPeriods";
import { getWorkPeriodsFilters } from "store/selectors/workPeriods";
import {
  resetWorkPeriodsFilters,
  setWorkPeriodsPaymentStatuses,
  setWorkPeriodsUserHandle,
} from "store/actions/workPeriods";
import { loadWorkPeriodsPage as loadWorkingPeriodsPage } from "store/thunks/workPeriods";
import { useUpdateEffect } from "utils/hooks";
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
  const { paymentStatuses, userHandle } = filters;

  const onUserHandleChange = useCallback(
    (value) => {
      dispatch(setWorkPeriodsUserHandle(value));
    },
    [dispatch]
  );

  const onPaymentStatusesChange = useCallback(
    (statuses) => {
      dispatch(setWorkPeriodsPaymentStatuses(statuses));
    },
    [dispatch]
  );

  const onClearFilter = useCallback(() => {
    dispatch(resetWorkPeriodsFilters());
  }, [dispatch]);

  const loadWorkingPeriodsFirstPage = useCallback(
    debounce(
      () => {
        dispatch(loadWorkingPeriodsPage(1));
      },
      300,
      { leading: false }
    ),
    [dispatch]
  );

  // Load working periods' first page when any filter option changes.
  useUpdateEffect(loadWorkingPeriodsFirstPage, [filters]);

  return (
    <form className={cn(styles.container, className)} action="#">
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

export default PeriodFilters;
