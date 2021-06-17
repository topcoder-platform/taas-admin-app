import React from "react";
import PT from "prop-types";
import cn from "classnames";
import styles from "./styles.module.scss";

/**
 * Displays a button.
 *
 * @param {Object} props component properties
 * @param {Object} props.children button text
 * @param {string} [props.className] class name added to root element
 * @param {'primary'|'primary-dark'|'primary-light'} [props.color] button color
 * @param {boolean} [props.isDisabled] if button is disabled
 * @param {boolean} [props.isSelected] if button is selected
 * @param {string} [props.name] button name
 * @param {(e: any) => void} props.onClick function called when button is clicked
 * @param {'medium'|'small'} [props.size] button size
 * @param {'circle'|'rounded'} [props.style] button style
 * @param {'button'|'submit'|'reset'} [props.type] button type
 * @param {string|number} [props.value] value associated with this button
 * @param {'contained'|'outlined'} [props.variant] button variant
 * @returns {JSX.Element}
 */
const Button = ({
  children,
  className,
  color = "primary",
  isDisabled = false,
  isSelected = false,
  name,
  onClick,
  size = "medium",
  style = "rounded",
  type = "button",
  value,
  variant = "outlined",
}) => (
  <button
    data-value={value}
    disabled={isDisabled}
    name={name || ""}
    type={type}
    className={cn(
      styles.button,
      {
        [styles.selected]: isSelected,
        [styles[color]]: true,
        [styles[size]]: true,
        [styles[style]]: true,
        [styles[variant]]: true,
      },
      className
    )}
    onClick={onClick}
  >
    {children}
  </button>
);

Button.propTypes = {
  children: PT.node,
  className: PT.string,
  color: PT.oneOf(["primary"]),
  isDisabled: PT.bool,
  isSelected: PT.bool,
  name: PT.string,
  onClick: PT.func,
  size: PT.oneOf(["medium", "small"]),
  style: PT.oneOf(["circle", "rounded"]),
  type: PT.oneOf(["button", "submit", "reset"]),
  value: PT.oneOfType([PT.number, PT.string]),
  variant: PT.oneOf(["contained", "outlined"]),
};

export default Button;
