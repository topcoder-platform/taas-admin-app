import React, { useCallback } from "react";
import PT from "prop-types";
import cn from "classnames";
import styles from "./styles.module.scss";

/**
 * Displays a toggle.
 *
 * @param {Object} props component properties
 * @param {string} [props.className] class name to be added to root element
 * @param {string} [props.id] id for toggle's input element
 * @param {'medium'|'small'} [props.size] toggle size
 * @param {boolean} props.isOn whether toggle is on or off
 * @param {string} props.name name for toggle's input element
 * @param {(v: boolean) => void} props.onChange function called with toggle's state changes
 * @returns {JSX.Element}
 */
const Toggle = ({ className, id, isOn, name, onChange, size = "medium" }) => {
  id = id || name;

  const onToggleChange = useCallback(
    (event) => {
      onChange(event.currentTarget.checked);
    },
    [onChange]
  );

  return (
    <label htmlFor={id} className={cn(styles.toggle, styles[size], className)}>
      <input
        type="checkbox"
        id={id}
        name={name}
        checked={isOn}
        onChange={onToggleChange}
      />
      <span />
    </label>
  );
};

Toggle.propTypes = {
  className: PT.string,
  id: PT.string,
  isOn: PT.bool.isRequired,
  name: PT.string.isRequired,
  onChange: PT.func.isRequired,
  size: PT.oneOf(["medium", "small"]),
};

export default Toggle;
