import React from "react";
import PT from "prop-types";
import cn from "classnames";
import styles from "./styles.module.scss";

/**
 * Displays spinning incomplete circle.
 *
 * @param {Object} props component props
 * @param {string} [props.className] class name added to root element
 * @param {string} [props.spinnerClassName] class name added to spinner element
 * @returns {JSX.Element}
 */
const Spinner = ({ className, spinnerClassName }) => (
  <div className={cn(styles.container, className)}>
    <span className={cn(styles.spinner, spinnerClassName)}>Loading...</span>
  </div>
);

Spinner.propTypes = {
  className: PT.string,
  spinnerClassName: PT.string,
};

export default Spinner;
