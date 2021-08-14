import React, { useCallback } from "react";
import PT from "prop-types";
import TextField from "components/TextField";

/**
 * Displays text field with optional label.
 *
 * @param {Object} props component properties
 * @returns {JSX.Element}
 */
const CurrencyField = (props) => {
  const { onChange } = props;

  const onChangeValue = useCallback(
    (value) => {
      onChange(normalizeValue(value));
    },
    [onChange]
  );

  return <TextField {...props} onChange={onChangeValue} />;
};

CurrencyField.propTypes = {
  className: PT.string,
  error: PT.string,
  id: PT.string,
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

export default CurrencyField;

/**
 * Returns normalized payment amount.
 *
 * @param {string} value peyment amount
 * @returns {string}
 */
function normalizeValue(value) {
  if (!value) {
    return value;
  }
  value = value.trim();
  let dotIndex = value.lastIndexOf(".");
  if (isNaN(+value) || dotIndex < 0) {
    return value;
  }
  if (dotIndex === 0) {
    return "0" + value;
  }
  if (value.length - dotIndex > 3) {
    return value.slice(0, dotIndex + 3);
  }
  return value;
}
