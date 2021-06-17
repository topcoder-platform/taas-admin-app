import React from "react";
import PT from "prop-types";
import cn from "classnames";
import IconWrapper from "components/IconWrapper";
import IconWorkPeriods from "../../../assets/images/icon-menu-item-workperiods.svg";
import styles from "./styles.module.scss";

/**
 * Displays a "calendar" icon used in navigation menu.
 *
 * @param {Object} props component props
 * @param {string} [props.className] class name added to root element
 * @param {boolean} [props.isActive] a flag indicating whether the icon is active
 * @returns {JSX.Element}
 */
const WorkPeriods = ({ className, isActive = false }) => (
  <IconWrapper
    className={cn(styles.container, className, { [styles.isActive]: isActive })}
  >
    <IconWorkPeriods />
  </IconWrapper>
);

WorkPeriods.propTypes = {
  className: PT.string,
  isActive: PT.bool,
};

export default WorkPeriods;
