import React from "react";
import PT from "prop-types";
import cn from "classnames";
import styles from "./styles.module.scss";

/**
 * Positions the main content of the page.
 *
 * @param {Object} props component properties
 * @param {Object} props.children component children
 * @param {string} [props.className] class name to be added to root element
 * @returns {JSX.Element}
 */
const Content = ({ className, children }) => (
  <div className={cn(styles.content, className)}>{children}</div>
);

Content.propTypes = {
  children: PT.node,
  className: PT.string,
};

export default Content;
