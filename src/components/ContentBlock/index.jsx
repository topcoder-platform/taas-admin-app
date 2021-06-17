import React from "react";
import PT from "prop-types";
import cn from "classnames";
import styles from "./styles.module.scss";

/**
 * Positions the content block of the page.
 *
 * @param {Object} props component properties
 * @param {Object} props.children component children
 * @param {string} [props.className] class name to be added to root element
 * @returns {JSX.Element}
 */
const ContentBlock = ({ className, children }) => (
  <div className={cn(styles.container, className)}>{children}</div>
);

ContentBlock.propTypes = {
  children: PT.node,
  className: PT.string,
};

export default ContentBlock;
