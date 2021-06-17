import React from "react";
import PT from "prop-types";
import cn from "classnames";
import { stopPropagation } from "utils/misc";
import styles from "./styles.module.scss";

/**
 * Displays checkbox with label.
 *
 * @param {Object} props component properties
 * @param {boolean} props.checked whether checkbox is checked
 * @param {string} [props.className] class name added to root element
 * @param {boolean} [props.isDisabled] if checkbox is disabled
 * @param {string} props.name name for input element
 * @param {() => void} props.onChange function called when checkbox changes state
 * @param {Object} [props.option] object { value, label }
 * @param {'medium'|'small'} [props.size] checkbox size
 * @param {boolean} [props.stopClickPropagation] whether to stop click event propagation
 * @returns {JSX.Element}
 */
const Checkbox = ({
  checked,
  className,
  isDisabled = false,
  name,
  onChange,
  option,
  size = "medium",
  stopClickPropagation = false,
}) => (
  // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
  <label
    className={cn(
      styles.container,
      styles[size],
      { [styles.single]: !option || !option.label },
      className
    )}
    onClick={stopClickPropagation ? stopPropagation : null}
  >
    <input
      type="checkbox"
      disabled={isDisabled}
      className={styles.checkbox}
      name={name}
      onChange={onChange}
      checked={checked}
      value={option ? option.value : ""}
    />
    <span className={styles.impostor} />
    {option && option.label && (
      <span className={styles.label}>{option.label}</span>
    )}
  </label>
);

Checkbox.propTypes = {
  checked: PT.bool,
  className: PT.string,
  isDisabled: PT.bool,
  name: PT.string.isRequired,
  size: PT.oneOf(["medium", "small"]),
  onChange: PT.func.isRequired,
  option: PT.shape({
    value: PT.string.isRequired,
    label: PT.string,
  }),
  stopClickPropagation: PT.bool,
};

export default Checkbox;
