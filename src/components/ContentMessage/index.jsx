import React from "react";
import PT from "prop-types";
import cn from "classnames";
import styles from "./styles.module.scss";

/**
 * Displays provided message.
 *
 * @param {Object} props component properties
 * @param {Object} props.children message contents
 * @param {string} [props.className] class name added to root element
 * @param {'info'|'warning'|'error'} [props.type] message type
 * @returns {JSX.Element}
 */
const ContentMessage = ({ children, className, type = "info" }) => (
  <div className={cn(styles.container, styles[type], className)}>
    <div className={styles.contents}>{children}</div>
  </div>
);

ContentMessage.propTypes = {
  children: PT.node.isRequired,
  className: PT.string,
  type: PT.oneOf(["info", "warning", "error"]),
};

export default ContentMessage;
