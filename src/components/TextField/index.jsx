import React, { useCallback } from "react";
import PT from "prop-types";
import cn from "classnames";
import styles from "./styles.module.scss";

/**
 * Displays text field with optional label.
 *
 * @param {Object} props component properties
 * @returns {JSX.Element}
 */
const TextField = ({
  className,
  id,
  isDisabled = false,
  isValid = true,
  label,
  name,
  onBlur,
  onChange,
  onFocus,
  size = "medium",
  value,
}) => {
  id = id || name;

  const onInputChange = useCallback(
    (event) => {
      onChange(event.target.value);
    },
    [onChange]
  );

  return (
    <div
      className={cn(
        styles.container,
        styles[size],
        {
          [styles.hasLabel]: !!label,
          [styles.disabled]: isDisabled,
          [styles.invalid]: !isValid,
        },
        className
      )}
    >
      {label && <label htmlFor={id}>{label}</label>}
      <input
        className={styles.input}
        disabled={isDisabled}
        id={id}
        name={name}
        type="text"
        value={value}
        onBlur={onBlur}
        onChange={onInputChange}
        onFocus={onFocus}
      />
    </div>
  );
};

TextField.propTypes = {
  className: PT.string,
  id: PT.string,
  isDisabled: PT.bool,
  isValid: PT.bool,
  label: PT.string,
  name: PT.string.isRequired,
  onBlur: PT.func,
  onChange: PT.func,
  onFocus: PT.func,
  size: PT.oneOf(["small", "medium"]),
  value: PT.oneOfType([PT.number, PT.string]).isRequired,
};

export default TextField;
