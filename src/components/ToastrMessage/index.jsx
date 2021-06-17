import React from "react";
import { toastr } from "react-redux-toastr";
import PT from "prop-types";
import cn from "classnames";
import { TOAST_DEFAULT_TIMEOUT } from "constants/index.js";
import styles from "./styles.module.scss";

/**
 * Displays toastr message.
 *
 * @param {Object} props component properties
 * @returns {JSX.Element}
 */
const ToastrMessage = ({
  children,
  className,
  message,
  remove,
  type = "info",
}) => {
  return (
    <div className={cn(styles.container, styles[type], className)}>
      {message && <span className={styles.message}>{message}</span>}
      {children}
      <button
        type="button"
        className={styles.btnClose}
        onClick={remove}
      ></button>
    </div>
  );
};

ToastrMessage.propTypes = {
  children: PT.node,
  className: PT.string,
  message: PT.string,
  remove: PT.func,
  type: PT.oneOf(["info", "success", "warning", "error"]),
};

export default ToastrMessage;

/**
 * Creates a redux toastr message with the specified type and contents.
 *
 * @param {string|Object} message
 * @param {'info'|'success'|'warning'|'error'} type
 */
export function makeToast(message, type = "error") {
  const component =
    typeof message === "string" ? (
      <ToastrMessage message={message} type={type} />
    ) : (
      <ToastrMessage type={type}>{message}</ToastrMessage>
    );
  toastr[type]("", { component, options: { timeOut: TOAST_DEFAULT_TIMEOUT } });
}
