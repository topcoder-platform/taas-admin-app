import React from "react";
import PT from "prop-types";
import cn from "classnames";
import IconWrapper from "components/IconWrapper";
import IconRoleManagement from "../../../assets/images/icon-menu-item-roles.svg";
import styles from "./styles.module.scss";

/**
 * Displays a "role management" icon used in navigation menu.
 *
 * @param {Object} props component props
 * @param {string} [props.className] class name added to root element
 * @param {boolean} [props.isActive] a flag indicating whether the icon is active
 * @returns {JSX.Element}
 */
const Roles = ({ className, isActive = false }) => (
  <IconWrapper
    className={cn(styles.container, className, { [styles.isActive]: isActive })}
  >
    <IconRoleManagement />
  </IconWrapper>
);

Roles.propTypes = {
  className: PT.string,
  isActive: PT.bool,
};

export default Roles;
