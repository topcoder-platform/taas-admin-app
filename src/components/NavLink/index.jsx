import React from "react";
import PT from "prop-types";
import cn from "classnames";
import { Link, useMatch } from "@reach/router";
import styles from "./styles.module.scss";

/**
 * Displays navigation link with icon in navigation menu.
 *
 * @param {Object} props component properties
 * @param {string} [props.className] class name to be added to root element
 * @param {boolean} [props.exact] whether to match the path exactly for active state
 * @param {Object} props.icon menu item's icon
 * @param {string} props.label menu item text
 * @param {string} props.path link path
 * @returns {JSX.Element}
 */
const NavLink = ({ className, exact = false, icon: Icon, label, path }) => {
  const match = useMatch(path);
  const { isCurrent, isPartiallyCurrent } = getMatchDetails(match);
  const isActive = exact ? isCurrent : isPartiallyCurrent;
  return (
    <Link
      to={path}
      className={cn(styles.item, className, { [styles.isActive]: isActive })}
    >
      <Icon className={styles.icon} isActive={isActive} />
      <span className={styles.label}>{label}</span>
    </Link>
  );
};

NavLink.propTypes = {
  className: PT.string,
  exact: PT.bool,
  icon: PT.func.isRequired,
  label: PT.string.isRequired,
  path: PT.string.isRequired,
};

function getMatchDetails(match) {
  const isPartiallyCurrent = !!match;
  const isCurrent = isPartiallyCurrent && match.uri === match.path;
  return { isCurrent, isPartiallyCurrent, match };
}

export default NavLink;
