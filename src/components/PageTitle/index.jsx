import React from "react";
import PT from "prop-types";
import cn from "classnames";
import styles from "./styles.module.scss";

/**
 * Displays page title.
 *
 * @param {Object} props component properties
 * @param {string} [props.className] class name to be applied to root element
 * @param {string} props.text page title
 * @returns {JSX.Element}
 */
const PageTitle = ({ className, text: title }) => (
  <h1 className={cn(styles.pageTitle, className)}>{title}</h1>
);

PageTitle.propTypes = {
  className: PT.string,
  text: PT.string.isRequired,
};

export default PageTitle;
