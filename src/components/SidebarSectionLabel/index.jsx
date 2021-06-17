import React from "react";
import PT from "prop-types";
import cn from "classnames";
import styles from "./styles.module.scss";

/**
 * Displays sidebar section's label.
 *
 * @param {Object} props component props
 * @param {string} [props.className] class name added to root element
 * @param {string} props.text label text
 * @returns {JSX.Element}
 */
const SidebarSectionLabel = ({ className, text }) => (
  <div className={cn(styles.container, className)}>{text}</div>
);

SidebarSectionLabel.propTypes = {
  className: PT.string,
  text: PT.string.isRequired,
};

export default SidebarSectionLabel;
