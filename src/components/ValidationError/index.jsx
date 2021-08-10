import React from "react";
import PT from "prop-types";
import cn from "classnames";
import styles from "./styles.module.scss";

/**
 * Displays a validation error message.
 *
 * @param {Object} props component properties
 * @param {any} props.children message text
 * @param {string} [props.className] class name to be added to root element
 * @returns {JSX.Element}
 */
const ValidationError = ({ children, className }) => (
  <div className={cn(styles.container, className)}>{children}</div>
);

ValidationError.propTypes = {
  children: PT.node.isRequired,
  className: PT.string,
};

export default ValidationError;
