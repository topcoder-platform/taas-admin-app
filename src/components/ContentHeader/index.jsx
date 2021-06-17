import React from "react";
import PT from "prop-types";
import cn from "classnames";
import styles from "./styles.module.scss";

/**
 * Positions content header within the page.
 *
 * @param {Object} props component properties
 * @param {string} [props.className] class name to be added to root element
 * @param {Object} props.children component children
 * @returns {Object}
 */
const ContentHeader = ({ className, children }) => (
  <div className={cn(styles.container, className)}>{children}</div>
);

ContentHeader.propTypes = {
  className: PT.string,
  children: PT.node,
};

export default ContentHeader;
