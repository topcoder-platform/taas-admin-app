import React, { useCallback } from "react";
import PT from "prop-types";
import cn from "classnames";
import ValidationError from "components/ValidationError";
import styles from "./styles.module.scss";

/**
 * Displays text field with optional label.
 *
 * @param {Object} props component properties
 * @returns {JSX.Element}
 */
const TextField = ({
  className,
  error,
  errorClassName,
  id,
  inputRef,
  isDisabled = false,
  isTouched = false,
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
          [styles.invalid]: !!error,
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
        onBlur={onBlur}
        onChange={onInputChange}
        onFocus={onFocus}
        ref={inputRef}
        type="text"
        value={value}
      />
      {isTouched && error && (
        <ValidationError className={cn(styles.error, errorClassName)}>
          {error}
        </ValidationError>
      )}
    </div>
  );
};

TextField.propTypes = {
  className: PT.string,
  error: PT.string,
  errorClassName: PT.string,
  id: PT.string,
  inputRef: PT.oneOfType([PT.object, PT.func]),
  isDisabled: PT.bool,
  isTouched: PT.bool,
  label: PT.string,
  name: PT.string.isRequired,
  onBlur: PT.func,
  onChange: PT.func,
  onFocus: PT.func,
  size: PT.oneOf(["small", "medium"]),
  value: PT.oneOfType([PT.number, PT.string]).isRequired,
};

export default TextField;
