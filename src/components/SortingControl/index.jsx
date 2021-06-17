import React, { memo } from "react";
import PT from "prop-types";
import cn from "classnames";
import IconArrow from "components/Icons/ArrowSmall";
import { SORT_ORDER } from "constants/workPeriods";
import styles from "./styles.module.scss";

/**
 * Displays a control with up and down arrows used for sorting.
 *
 * @param {Object} props component properties
 * @param {string} [props.className] class name to be added to root element
 * @param {(v: object) => void} props.onChange function called when sorting is changed
 * @param {string} props.sortBy sorting criteria to be returned with callback
 * @param {'asc'|'desc'} [props.value] sorting mode
 * @returns {JSX.Element}
 */
const SortingControl = ({ className, onChange, sortBy, value }) => {
  const isActiveUp = value === SORT_ORDER.ASC;
  const isActiveDown = value === SORT_ORDER.DESC;
  return (
    <div className={cn(styles.container, className)}>
      <IconArrow
        className={cn(styles.arrowUp)}
        direction="up"
        isActive={isActiveUp}
        onClick={() =>
          onChange({
            sortBy,
            sortOrder: isActiveUp ? SORT_ORDER.DESC : SORT_ORDER.ASC,
          })
        }
      />
      <IconArrow
        className={cn(styles.arrowDown)}
        isActive={isActiveDown}
        onClick={() =>
          onChange({
            sortBy,
            sortOrder: isActiveDown ? SORT_ORDER.ASC : SORT_ORDER.DESC,
          })
        }
      />
    </div>
  );
};

SortingControl.propTypes = {
  className: PT.string,
  onChange: PT.func.isRequired,
  sortBy: PT.string.isRequired,
  value: PT.oneOf([SORT_ORDER.ASC, SORT_ORDER.DESC]),
};

export default memo(SortingControl);
