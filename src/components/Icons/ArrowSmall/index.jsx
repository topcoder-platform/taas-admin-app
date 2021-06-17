import React from "react";
import PT from "prop-types";
import cn from "classnames";
import IconWrapper from "components/IconWrapper";
import IconArrowDownSmall from "../../../assets/images/icon-arrow-down-small.svg";
import styles from "./styles.module.scss";

/**
 * Displays a small narrow arrow pointing down or up.
 *
 * @param {Object} props component props
 * @param {string} [props.className] class name added to root element
 * @param {() => void} [props.onClick] click handler
 * @param {boolean} props.isActive whether the icon is in active state
 * @param {'up'|'down'} [props.direction] arrow direction
 * @returns {JSX.Element}
 */
const ArrowSmall = ({ className, onClick, isActive, direction = "down" }) => (
  <IconWrapper
    onClick={onClick}
    className={cn(styles.arrow, styles[direction], className, {
      [styles.isActive]: isActive,
    })}
  >
    <IconArrowDownSmall />
  </IconWrapper>
);

ArrowSmall.propTypes = {
  className: PT.string,
  isActive: PT.bool.isRequired,
  direction: PT.oneOf(["down", "up"]),
  onClick: PT.func,
};

export default ArrowSmall;
