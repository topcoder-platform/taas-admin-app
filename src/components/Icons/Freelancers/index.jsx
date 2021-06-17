import React from "react";
import PT from "prop-types";
import cn from "classnames";
import IconWrapper from "components/IconWrapper";
import IconFreelancers from "../../../assets/images/icon-menu-item-feelancers.svg";
import styles from "./styles.module.scss";

/**
 * Displays a "people" icon used in navigation menu.
 *
 * @param {Object} props component props
 * @param {string} [props.className] class name added to root element
 * @param {boolean} [props.isActive] a flag indicating whether the icon is active
 * @returns {JSX.Element}
 */
const Freelancers = ({ className, isActive = false }) => (
  <IconWrapper
    className={cn(styles.container, className, { [styles.isActive]: isActive })}
  >
    <IconFreelancers />
  </IconWrapper>
);

Freelancers.propTypes = {
  className: PT.string,
  isActive: PT.bool,
};

export default Freelancers;
