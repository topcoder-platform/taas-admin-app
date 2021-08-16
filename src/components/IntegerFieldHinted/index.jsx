import React from "react";
import PT from "prop-types";
import cn from "classnames";
import Tooltip from "components/Tooltip";
import { stopImmediatePropagation } from "utils/misc";
import styles from "./styles.module.scss";

/**
 * Displays input field for inputing integer numbers with plus and minus buttons
 * and tooltips for disabled plus and minus buttons.
 *
 * @param {Object} props component properties
 * @param {string} [props.className] class name to be added to root element
 * @param {boolean} [props.isDisabled] if the field is disabled
 * @param {boolean} [props.isDisabledMinus] whether the minus button is disabled
 * @param {boolean} [props.isDisabledPlus] whether the plus button is disabled
 * @param {string} props.name field's name
 * @param {number} props.value field's value
 * @param {number} [props.maxValue] maximum allowed value
 * @param {number} [props.minValue] minimum allowed value
 * @param {any} [props.maxValueMessage] contents for the tooltip shown above
 * the plus-button when the maximum value is reached
 * @param {any} [props.minValueMessage] contents for the tooltip shown above
 * the minus-button when the minimum value is reached
 * @param {(v: number) => void} props.onChange
 * @param {boolean} [props.stopClickPropagation] whether to stop click immediate
 * propagation
 * @param {'absolute'|'fixed'} [props.tooltipStrategy] tooltip positioning strategy
 * @returns {JSX.Element}
 */
const IntegerFieldHinted = ({
  className,
  isDisabled = false,
  isDisabledMinus = false,
  isDisabledPlus = false,
  name,
  onChange,
  value,
  maxValue = Infinity,
  minValue = -Infinity,
  maxValueMessage,
  minValueMessage,
  stopClickPropagation = false,
}) => {
  isDisabledMinus = isDisabledMinus || value <= minValue;
  isDisabledPlus = isDisabledPlus || value >= maxValue;
  return (
    <div
      className={cn(styles.container, className)}
      onClick={stopClickPropagation ? stopImmediatePropagation : null}
      role="button"
      tabIndex={0}
    >
      <input
        disabled={isDisabled}
        readOnly
        className={styles.input}
        name={name}
        value={value}
      />
      <Tooltip
        className={styles.btnMinus}
        targetClassName={cn(styles.tooltipTarget, {
          [styles.notAllowed]: isDisabledMinus,
        })}
        tooltipClassName={styles.tooltip}
        content={minValueMessage}
        isDisabled={!isDisabledMinus || isDisabled}
        strategy="fixed"
      >
        <button
          type="button"
          disabled={isDisabledMinus}
          onClick={() => {
            if (!isDisabled) {
              onChange(Math.max(value - 1, minValue));
            }
          }}
        />
      </Tooltip>
      <Tooltip
        className={styles.btnPlus}
        targetClassName={cn(styles.tooltipTarget, {
          [styles.notAllowed]: isDisabledPlus,
        })}
        tooltipClassName={styles.tooltip}
        content={maxValueMessage}
        isDisabled={!isDisabledPlus || isDisabled}
        strategy="fixed"
      >
        <button
          type="button"
          disabled={isDisabledPlus}
          onClick={() => {
            if (!isDisabled) {
              onChange(Math.min(value + 1, maxValue));
            }
          }}
        />
      </Tooltip>
    </div>
  );
};

IntegerFieldHinted.propTypes = {
  className: PT.string,
  isDisabled: PT.bool,
  isDisabledMinus: PT.bool,
  isDisabledPlus: PT.bool,
  name: PT.string.isRequired,
  maxValue: PT.number,
  minValue: PT.number,
  maxValueMessage: PT.node,
  minValueMessage: PT.node,
  onChange: PT.func.isRequired,
  stopClickPropagation: PT.bool,
  tooltipStrategy: PT.oneOf(["absolute", "fixed"]),
  value: PT.number.isRequired,
};

export default IntegerFieldHinted;
