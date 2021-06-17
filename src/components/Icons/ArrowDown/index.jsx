import React from "react";
import PT from "prop-types";
import cn from "classnames";
import IconWrapper from "components/IconWrapper";
import IconArrowDown from "../../../assets/images/icon-arrow-down.svg";
import styles from "./styles.module.scss";

/**
 * Displays a wide dark green arrow pointing down.
 *
 * @param {Object} props component props
 * @param {string} [props.className] class name added to root element
 * @returns {JSX.Element}
 */
const ArrowDown = ({ className }) => (
  <IconWrapper className={cn(styles.arrow, className)}>
    <IconArrowDown />
  </IconWrapper>
);

ArrowDown.propTypes = {
  className: PT.string,
};

export default ArrowDown;
