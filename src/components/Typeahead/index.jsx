import React, { useCallback, useRef, useState } from "react";
import PT from "prop-types";
import cn from "classnames";
import get from "lodash/get";
import throttle from "lodash/throttle";
import Select, { components } from "react-select";
import { useUpdateEffect } from "utils/hooks";
import styles from "./styles.module.scss";

const loadingMessage = () => "Loading...";

const noOptionsMessage = () => "No suggestions";

function MenuList(props) {
  let focusedOption = props.focusedOption;
  focusedOption = props.selectProps.isMenuFocused
    ? focusedOption
    : props.getValue()[0];
  const setIsMenuFocused = props.selectProps.setIsMenuFocused;

  const onMouseEnter = useCallback(() => {
    setIsMenuFocused(true);
  }, [setIsMenuFocused]);

  return (
    <div className={styles.menuList} onMouseEnter={onMouseEnter}>
      <components.MenuList {...props} focusedOption={focusedOption} />
    </div>
  );
}
MenuList.propTypes = {
  focusedOption: PT.object,
  getValue: PT.func,
  selectProps: PT.shape({
    isMenuFocused: PT.oneOfType([PT.bool, PT.number]),
    setIsMenuFocused: PT.func,
  }),
};

function Option(props) {
  return (
    <components.Option
      {...props}
      isFocused={props.selectProps.isMenuFocused && props.isFocused}
      isSelected={!props.selectProps.isMenuFocused && props.isSelected}
    />
  );
}
Option.propTypes = {
  isFocused: PT.bool,
  isSelected: PT.bool,
  selectProps: PT.shape({
    isMenuFocused: PT.oneOfType([PT.bool, PT.number]),
  }),
};

const selectComponents = {
  DropdownIndicator: () => null,
  ClearIndicator: () => null,
  IndicatorSeparator: () => null,
  MenuList,
  Option,
};

/**
 * Displays search input field.
 *
 * @param {Object} props component properties
 * @param {string} [props.className] class name added to root element
 * @param {string} props.id id for input element
 * @param {string} props.placeholder placeholder text
 * @param {string} props.name name for input element
 * @param {'medium'|'small'} [props.size] field size
 * @param {function} props.onChange function called when value changes
 * @param {function} [props.onInputChange] function called when input value changes
 * @param {function} [props.onBlur] function called on input blur
 * @param {number} [props.minLengthForSuggestions] the minimum string lenth for displaying suggestions (default 3)
 * @param {Boolean} [props.enforceListOnlySelection] enforces user to select from the list - manual inputs (if not in the list) won't affect the selection
 * @param {string} props.value input value
 * @param {function} props.getSuggestions the function to get suggestions
 * @param {string} props.targetProp the target property of the returned object from getSuggestions
 * @returns {JSX.Element}
 */
const Typeahead = ({
  className,
  id,
  name,
  size = "medium",
  onChange,
  onInputChange,
  onBlur,
  minLengthForSuggestions = 3,
  enforceListOnlySelection = false,
  placeholder,
  value,
  getSuggestions,
  targetProp,
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [isLoading, setIsLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMenuFocused, setIsMenuFocused] = useState(false);
  const [options, setOptions] = useState([]);
  const isChangeAppliedRef = useRef(false);

  const onValueChange = (option, { action }) => {
    if (action === "input-change" || action === "select-option") {
      if (isMenuFocused && !isLoading && option) {
        isChangeAppliedRef.current = true;
        setIsMenuFocused(false);
        setIsMenuOpen(false);
        setIsLoading(false);
        setInputValue(option.value);
        onChange(option.value);
      }
    } else if (action === "clear") {
      isChangeAppliedRef.current = true;
      setIsMenuFocused(false);
      setIsMenuOpen(false);
      setIsLoading(false);
      setInputValue("");
      onChange("");
    }
  };

  const onInputValueChange = useCallback(
    (value, { action }) => {
      if (action === "input-change") {
        isChangeAppliedRef.current = false;
        setIsMenuFocused(false);
        setInputValue(value);
        onInputChange && onInputChange(value);
      }
    },
    [onInputChange]
  );

  const onKeyDown = (event) => {
    const key = event.key;
    if (key === "Enter" || key === "Escape") {
      if (!isMenuFocused) {
        isChangeAppliedRef.current = true;
        setIsMenuFocused(false);
        setIsMenuOpen(false);
        setIsLoading(false);
        // fire onChange event
        // - if `enforceListOnlySelection` is not set,
        // - or if it's set and options list contains the value
        if (!enforceListOnlySelection || options.includes(inputValue)) {
          onChange(inputValue);
        }
      }
    } else if (key === "ArrowDown") {
      if (!isMenuFocused) {
        event.preventDefault();
        event.stopPropagation();
        setIsMenuFocused(true);
      }
    } else if (key === "Backspace") {
      if (!inputValue) {
        event.preventDefault();
        event.stopPropagation();
      }
    }
  };

  const onSelectBlur = () => {
    setIsMenuFocused(false);
    setIsMenuOpen(false);
    // fire onChange event
    // - if `enforceListOnlySelection` is not set,
    // - or if it's set and options list contains the value
    if (!enforceListOnlySelection || options.includes(inputValue)) {
      onChange(inputValue);
    }
    onBlur && onBlur();
  };

  const loadOptions = useCallback(
    throttle(
      async (value) => {
        if (isChangeAppliedRef.current) {
          return;
        }
        setIsLoading(true);
        setIsMenuOpen(true);
        const options =
          value.length < minLengthForSuggestions
            ? [] // no suggestions yet if value length is less than `minLengthForSuggestions`
            : await loadSuggestions(getSuggestions, value, targetProp);
        if (!isChangeAppliedRef.current) {
          setOptions(options);
          setIsLoading(false);
        }
      },
      300,
      { leading: false }
    ),
    []
  );

  useUpdateEffect(() => {
    setInputValue(value);
  }, [value]);

  useUpdateEffect(() => {
    loadOptions(inputValue);
  }, [inputValue]);

  return (
    <div
      className={cn(
        styles.container,
        styles[size],
        { [styles.isMenuFocused]: isMenuFocused },
        className
      )}
    >
      <span className={styles.icon} />
      <Select
        className={styles.select}
        classNamePrefix="custom"
        components={selectComponents}
        id={id}
        name={name}
        isClearable={true}
        isSearchable={true}
        isLoading={isLoading}
        isMenuFocused={isMenuFocused}
        setIsMenuFocused={setIsMenuFocused}
        menuIsOpen={isMenuOpen}
        value={null}
        inputValue={inputValue}
        options={options}
        onChange={onValueChange}
        onInputChange={onInputValueChange}
        onKeyDown={onKeyDown}
        onBlur={onSelectBlur}
        placeholder={placeholder}
        noOptionsMessage={noOptionsMessage}
        loadingMessage={loadingMessage}
      />
    </div>
  );
};

const loadSuggestions = async (getSuggestions, inputValue, targetProp) => {
  let options = [];
  try {
    const res = await getSuggestions(inputValue);
    const items = res.data.slice(0, 100);
    let match = null;
    for (let i = 0, len = items.length; i < len; i++) {
      let value = get(items[i], targetProp);
      if (value === inputValue) {
        match = { value, label: value };
      } else {
        options.push({ value, label: value });
      }
    }
    if (match) {
      options.unshift(match);
    }
  } catch (error) {
    console.error(error);
    console.warn("could not get suggestions");
  }
  return options;
};

Typeahead.propTypes = {
  className: PT.string,
  id: PT.string.isRequired,
  size: PT.oneOf(["medium", "small"]),
  name: PT.string.isRequired,
  onChange: PT.func.isRequired,
  onInputChange: PT.func,
  onBlur: PT.func,
  minLengthForSuggestions: PT.number,
  enforceListOnlySelection: PT.bool,
  placeholder: PT.string,
  value: PT.oneOfType([PT.number, PT.string]),
  getSuggestions: PT.func,
  targetProp: PT.string,
};

export default Typeahead;
