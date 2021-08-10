import React, { useCallback, useState } from "react";
import PT from "prop-types";
import cn from "classnames";
import Select from "react-select";
import IconArrowDown from "components/Icons/ArrowDown";
import { getOptionByValue } from "utils/misc";
import styles from "./styles.module.scss";

/**
 * Custom dropdown indicator.
 *
 * @returns {JSX.Element}
 */
const DropdownIndicator = () => (
  <IconArrowDown className={styles.dropdownIndicator} />
);

const selectComponents = { DropdownIndicator, IndicatorSeparator: () => null };

/**
 * Displays custom select control
 *
 * @param {Object} props component properties
 * @param {string} [props.className] class name to be added to root element
 * @param {string} props.id control's id
 * @param {boolean} [props.isDisabled] whether the control should be disabled
 * @param {string} [props.label] control's label
 * @param {string} [props.labelClassName] class name to be added to label element
 * @param {(v: any) => void} props.onChange on change handler
 * @param {Object} props.options options for dropdown
 * @param {'medium'|'small'} [props.size] control's size
 * @param {any} props.value control's value
 * @returns {JSX.Element}
 */
const SelectField = ({
  className,
  id,
  isDisabled = false,
  label,
  labelClassName,
  onChange,
  options,
  size = "medium",
  value,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const option = getOptionByValue(options, value);

  const onMenuOpen = useCallback(() => {
    setIsOpen(true);
  }, []);

  const onMenuClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const onOptionChange = useCallback(
    (option) => {
      onChange(option.value);
    },
    [onChange]
  );

  return (
    <div
      className={cn(
        styles.container,
        styles[size],
        { [styles.isOpen]: isOpen },
        className
      )}
    >
      {label && (
        <label htmlFor={id} className={cn(styles.label, labelClassName)}>
          {label}
        </label>
      )}
      <Select
        className={styles.select}
        classNamePrefix="custom"
        components={selectComponents}
        id={id}
        isDisabled={isDisabled}
        isSearchable={false}
        // menuIsOpen={true} // for debugging
        onChange={onOptionChange}
        onMenuOpen={onMenuOpen}
        onMenuClose={onMenuClose}
        options={options}
        value={option}
      />
    </div>
  );
};

SelectField.propTypes = {
  className: PT.string,
  id: PT.string.isRequired,
  isDisabled: PT.bool,
  label: PT.string,
  labelClassName: PT.string,
  size: PT.oneOf(["medium", "small"]),
  onChange: PT.func.isRequired,
  options: PT.arrayOf(
    PT.shape({
      value: PT.oneOfType([PT.number, PT.string]).isRequired,
      label: PT.string.isRequired,
    })
  ).isRequired,
  value: PT.oneOfType([PT.number, PT.string]).isRequired,
};

export default SelectField;
