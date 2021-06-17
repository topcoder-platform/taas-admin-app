import React from "react";
import PT from "prop-types";
import cn from "classnames";
import NavLink from "components/NavLink";
import styles from "./styles.module.scss";

/**
 * Displays vertical navigation menu.
 *
 * @param {Object} props component properties
 * @param {string} [props.className] class name to be added to root element
 * @param {Array} props.items menu items
 * @returns
 */
const NavMenu = ({ className, items }) => (
  <nav className={cn(styles.container, className)}>
    {items.map((item) => (
      <NavLink key={item.path} className={styles.item} {...item} />
    ))}
  </nav>
);

NavMenu.propTypes = {
  className: PT.string,
  items: PT.arrayOf(
    PT.shape({
      icon: PT.elementType.isRequired,
      label: PT.string.isRequired,
      path: PT.string.isRequired,
    })
  ),
};

export default NavMenu;
