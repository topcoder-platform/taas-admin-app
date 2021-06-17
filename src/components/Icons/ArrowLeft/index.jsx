import React from "react";
import PT from "prop-types";
import cn from "classnames";
import IconWrapper from "components/IconWrapper";
import IconArrowLeft from "../../../assets/images/icon-arrow-left.svg";
import styles from "./styles.module.scss";

/**
 * Displays a green arrow pointing to the left.
 *
 * @param {Object} props component props
 * @param {string} [props.className] class name added to root element
 * @returns {JSX.Element}
 */
const ArrowLeft = ({ className }) => (
  <IconWrapper className={cn(styles.arrow, className)}>
    <IconArrowLeft />
  </IconWrapper>
);

ArrowLeft.propTypes = {
  className: PT.string,
};

export default ArrowLeft;
