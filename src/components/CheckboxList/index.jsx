import React, { useCallback } from "react";
import PT from "prop-types";
import cn from "classnames";
import Checkbox from "components/Checkbox";
import styles from "./styles.module.scss";

/**
 * Displays checkbox list with labels.
 *
 * @param {Object} props component properties
 * @param {string} [props.className] class name added to root element
 * @param {string} props.name name for input element
 * @param {function} props.onChange function called when checkbox changes state
 * @param {{ value: string, label: string }[]} props.options array of option objects
 * @param {Object} props.value object containing string values for checkboxes
 * as keys
 * @returns {JSX.Element}
 */
const CheckboxList = ({ className, name, onChange, options, value }) => {
  const onCheckboxChange = useCallback(
    (event) => {
      const checkbox = event.target;
      onChange({ [checkbox.value]: checkbox.checked });
    },
    [onChange]
  );

  return (
    <div className={cn(styles.list, className)}>
      {options.map((option) => (
        <Checkbox
          key={option.value}
          checked={option.value in value}
          className={styles.checkbox}
          name={name}
          onChange={onCheckboxChange}
          option={option}
        />
      ))}
    </div>
  );
};

CheckboxList.propTypes = {
  className: PT.string,
  name: PT.string.isRequired,
  onChange: PT.func.isRequired,
  options: PT.arrayOf(
    PT.shape({
      value: PT.string.isRequired,
      label: PT.string.isRequired,
    })
  ),
  value: PT.object.isRequired,
};

export default CheckboxList;
