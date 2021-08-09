import React, { useMemo } from "react";
import PT from "prop-types";
import cn from "classnames";
import IconExclamationMark from "components/Icons/ExclamationMarkCircled";
import Popover from "components/Popover";
import styles from "./styles.module.scss";

/**
 * Displays input field for inputing integer numbers with plus and minus buttons.
 *
 * @param {Object} props component properties
 * @param {string} [props.className] class name to be added to root element
 * @param {boolean} [props.isDisabled] if the field is disabled
 * @param {boolean} [props.readOnly] if the field is readOnly
 * @param {boolean} [props.displayButtons] whether to display +/- buttons
 * @param {string} props.name field's name
 * @param {number} props.value field's value
 * @param {number} [props.maxValue] maximum allowed value
 * @param {number} [props.minValue] minimum allowed value
 * @param {(v: number) => void} [props.onChange]
 * @param {(v: string) => void} [props.onInputChange]
 * @returns {JSX.Element}
 */
const IntegerField = ({
  className,
  isDisabled = false,
  readOnly = true,
  displayButtons = true,
  name,
  onInputChange,
  onChange,
  value,
  maxValue = Infinity,
  minValue = -Infinity,
}) => {
  const isInvalid = useMemo(
    () =>
      !!value &&
      (isNaN(value) ||
        !Number.isInteger(+value) ||
        +value > maxValue ||
        +value < minValue),
    [value, minValue, maxValue]
  );

  const errorPopupContent = useMemo(() => {
    if (value && (isNaN(value) || !Number.isInteger(+value))) {
      return <>You must enter a valid integer.</>;
    }
    if (+value > maxValue) {
      return (
        <>
          You must enter an integer less than or equal to{" "}
          <strong>{maxValue}</strong>.
        </>
      );
    }
    if (+value < minValue) {
      return (
        <>
          You must enter an integer greater than or equal to{" "}
          <strong>{minValue}</strong>.
        </>
      );
    }
  }, [value, minValue, maxValue]);

  return (
    <div className={cn(styles.container, className)}>
      {isInvalid && (
        <Popover
          className={styles.popup}
          stopClickPropagation={true}
          content={errorPopupContent}
          strategy="fixed"
        >
          <IconExclamationMark className={styles.icon} />
        </Popover>
      )}
      <input
        type="number"
        onChange={(event) => onInputChange && onInputChange(event.target.value)}
        disabled={isDisabled}
        readOnly={readOnly}
        className={cn(styles.input, {
          error: isInvalid,
        })}
        name={name}
        value={value}
      />
      {displayButtons && (
        <>
          <button
            className={styles.btnMinus}
            onClick={(event) => {
              event.stopPropagation();
              if (!isDisabled) {
                onChange(Math.max(value - 1, minValue));
              }
            }}
          />
          <button
            className={styles.btnPlus}
            onClick={(event) => {
              event.stopPropagation();
              if (!isDisabled) {
                onChange(Math.min(+value + 1, maxValue));
              }
            }}
          />
        </>
      )}
    </div>
  );
};

IntegerField.propTypes = {
  className: PT.string,
  isDisabled: PT.bool,
  readOnly: PT.bool,
  displayButtons: PT.bool,
  name: PT.string.isRequired,
  maxValue: PT.number,
  minValue: PT.number,
  onChange: PT.func,
  onInputChange: PT.func,
  value: PT.number.isRequired,
};

export default IntegerField;
