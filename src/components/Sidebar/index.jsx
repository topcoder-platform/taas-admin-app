import React from "react";
import PT from "prop-types";
import cn from "classnames";
import NavMenu from "components/NavMenu";
import styles from "./styles.module.scss";
import WorkPeriods from "components/Icons/WorkPeriods";
import Freelancers from "components/Icons/Freelancers";
import Roles from "components/Icons/Roles";
import { APP_BASE_PATH } from "../../constants";

/**
 * Positions sidebar contents like filters and displays navigation menu.
 *
 * @param {Object} props component properties
 * @param {Object} props.children component children
 * @param {string} [props.className] optional class name to add to root element
 * @returns {JSX.Element}
 */
const Sidebar = ({ className, children }) => (
  <aside className={cn(styles.container, className)}>
    <NavMenu className={styles.menu} items={NAV_ITEMS} />
    {children}
  </aside>
);

Sidebar.propTypes = {
  children: PT.node,
  className: PT.string,
};

const NAV_ITEMS = [
  {
    icon: WorkPeriods,
    label: "Working Periods",
    path: `${APP_BASE_PATH}/work-periods`,
  },
  {
    icon: Freelancers,
    label: "Freelancers",
    path: `${APP_BASE_PATH}/freelancers`,
  },
  {
    icon: Roles,
    label: "Roles",
    path: `${APP_BASE_PATH}/roles`,
  },
];

export default Sidebar;
