import React, { useCallback } from "react";
import PT from "prop-types";
import cn from "classnames";
import AsyncSelect from "react-select/async";
import { getMemberSuggestions } from "services/teams";
import styles from "./styles.module.scss";

const selectComponents = {
  DropdownIndicator: () => null,
  IndicatorSeparator: () => null,
};

const loadingMessage = () => "Loading...";

const noOptionsMessage = () => "No suggestions";

/**
 * Displays search input field.
 *
 * @param {Object} props component properties
 * @param {string} [props.className] class name added to root element
 * @param {string} props.id id for input element
 * @param {string} props.placeholder placeholder text
 * @param {string} props.name name for input element
 * @param {'medium'|'small'} [props.size] field size
 * @param {function} props.onChange function called when input value changes
 * @param {string} props.value input value
 * @returns {JSX.Element}
 */
const SearchHandleField = ({
  className,
  id,
  name,
  size = "medium",
  onChange,
  placeholder,
  value,
}) => {
  const onValueChange = useCallback(
    (option, { action }) => {
      if (action === "clear") {
        onChange("");
      } else {
        onChange(option.value);
      }
    },
    [onChange]
  );

  const onInputChange = useCallback(
    (value, { action }) => {
      if (action === "input-change") {
        onChange(value);
      }
    },
    [onChange]
  );

  return (
    <div className={cn(styles.container, styles[size], className)}>
      <span className={styles.icon} />
      <AsyncSelect
        className={styles.select}
        classNamePrefix="custom"
        components={selectComponents}
        id={id}
        name={name}
        isClearable={true}
        isSearchable={true}
        // menuIsOpen={true} // for debugging
        value={null}
        inputValue={value}
        onChange={onValueChange}
        onInputChange={onInputChange}
        openMenuOnClick={false}
        placeholder={placeholder}
        noOptionsMessage={noOptionsMessage}
        loadingMessage={loadingMessage}
        loadOptions={loadSuggestions}
        cacheOptions
      />
    </div>
  );
};

const loadSuggestions = async (inputVal) => {
  let options = [];
  if (inputVal.length < 3) {
    return options;
  }
  try {
    const res = await getMemberSuggestions(inputVal);
    const users = res.data.result.content;
    for (let i = 0, len = users.length; i < len; i++) {
      let value = users[i].handle;
      options.push({ value, label: value });
    }
  } catch (error) {
    console.error(error);
    console.warn("could not get suggestions");
  }
  return options;
};

SearchHandleField.propTypes = {
  className: PT.string,
  id: PT.string.isRequired,
  size: PT.oneOf(["medium", "small"]),
  name: PT.string.isRequired,
  onChange: PT.func.isRequired,
  placeholder: PT.string,
  value: PT.oneOfType([PT.number, PT.string]),
};

export default SearchHandleField;
