import React from "react";
import PT from "prop-types";
import cn from "classnames";
import styles from "./styles.module.scss";

/**
 * Displays a white exclamation mark inside red circle.
 *
 * @param {Object} props component properties
 * @returns {JSX.Element}
 */
const ExclamationMarkCircled = (props) => (
  <span {...props} className={cn(styles.icon, props.className)} />
);

ExclamationMarkCircled.propTypes = {
  className: PT.string,
};

export default ExclamationMarkCircled;
