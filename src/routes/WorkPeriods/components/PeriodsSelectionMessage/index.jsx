import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import PT from "prop-types";
import cn from "classnames";
import {
  getWorkPeriodsIsSelectedAll,
  getWorkPeriodsIsSelectedVisible,
  getWorkPeriodsPageSize,
  getWorkPeriodsSelectedCount,
  getWorkPeriodsTotalCount,
} from "store/selectors/workPeriods";
import { toggleWorkingPeriodsAll } from "store/actions/workPeriods";
import styles from "./styles.module.scss";
import { formatIsAre, formatPlural } from "utils/formatters";

/**
 * Displays messages about the number of selected periods and selection controls.
 *
 * @param {Object} props component properties
 * @param {string} [props.className] class name to be added to root element
 * @returns {JSX.Element}
 */
const PeriodsSelectionMessage = ({ className }) => {
  const isSelectedAll = useSelector(getWorkPeriodsIsSelectedAll);
  const isSelectedVisible = useSelector(getWorkPeriodsIsSelectedVisible);
  const selectedCount = useSelector(getWorkPeriodsSelectedCount);
  const pageSize = useSelector(getWorkPeriodsPageSize);
  const totalCount = useSelector(getWorkPeriodsTotalCount);
  const dispatch = useDispatch();

  const onBtnClick = useCallback(() => {
    dispatch(toggleWorkingPeriodsAll());
  }, [dispatch]);

  return (
    <div className={cn(styles.container, className)}>
      {isSelectedVisible && totalCount > pageSize && (
        <span className={styles.message}>
          {isSelectedAll
            ? `All ${formatPlural(totalCount, "record")} ${formatIsAre(
                totalCount
              )} selected. `
            : `${selectedCount < pageSize ? "" : "All"} ${formatPlural(
                selectedCount,
                "record"
              )} on this page ${formatIsAre(selectedCount)} selected. `}
          <span
            className={styles.button}
            onClick={onBtnClick}
            role="button"
            tabIndex={0}
          >
            {isSelectedAll
              ? "Deselect"
              : `Select all ${formatPlural(totalCount, "record")}`}
          </span>
        </span>
      )}
    </div>
  );
};

PeriodsSelectionMessage.propTypes = {
  className: PT.string,
};

export default PeriodsSelectionMessage;
