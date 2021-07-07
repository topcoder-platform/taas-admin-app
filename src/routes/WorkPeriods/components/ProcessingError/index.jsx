import React from "react";
import PT from "prop-types";
import Popover from "components/Popover";
import IconExclamationMark from "components/Icons/ExclamationMarkCircled";
import styles from "./styles.module.scss";

/**
 * Displays an error icon and error details popup.
 *
 * @param {Object} props component properties
 * @param {string} [props.className] class name to be added to root element
 * @param {Object} [props.error] error object
 * @param {'absolute'|'fixed'} [props.popupStrategy] popup positioning strategy
 * @returns {JSX.Element}
 */
const ProcessingError = ({ className, error, popupStrategy = "absolute" }) => (
  <Popover
    className={className}
    content={error.message}
    popupClassName={styles.popup}
    stopClickPropagation={true}
    strategy={popupStrategy}
  >
    <IconExclamationMark className={styles.icon} />
  </Popover>
);

ProcessingError.propTypes = {
  className: PT.string,
  error: PT.object,
  popupStrategy: PT.oneOf(["absolute", "fixed"]),
};

export default ProcessingError;
