import React from "react";
import PT from "prop-types";
import cn from "classnames";
import SidebarSectionLabel from "components/SidebarSectionLabel";
import styles from "./styles.module.scss";

/**
 * Displays sidebar's section with optional label.
 *
 * @param {Object} props component properties
 * @param {Object} props.children component children
 * @param {string} [props.className] class name to be added to root element
 * @param {string} props.label section's label
 * @returns {JSX.Element}
 */
const SidebarSection = ({ children, className, label }) => (
  <div className={cn(styles.container, className)}>
    {label && <SidebarSectionLabel text={label} />}
    {children}
  </div>
);

SidebarSection.propTypes = {
  children: PT.node,
  className: PT.string,
  label: PT.string,
};

export default SidebarSection;
