import React from "react";
import PT from "prop-types";
import cn from "classnames";
import IconWrapper from "components/IconWrapper";
import IconArrowRight from "../../../assets/images/icon-arrow-right.svg";
import styles from "./styles.module.scss";

/**
 * Displays a green arrow pointing to the right.
 *
 * @param {Object} props component props
 * @param {string} [props.className] class name added to root element
 * @returns {JSX.Element}
 */
const ArrowRight = ({ className }) => (
  <IconWrapper className={cn(styles.arrow, className)}>
    <IconArrowRight />
  </IconWrapper>
);

ArrowRight.propTypes = {
  className: PT.string,
};

export default ArrowRight;
