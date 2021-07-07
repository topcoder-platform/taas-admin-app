import React, { useMemo } from "react";
import PT from "prop-types";
import cn from "classnames";
import Tooltip from "components/Tooltip";
import { ALERT_MESSAGE_MAP } from "constants/workPeriods";
import styles from "./styles.module.scss";

/**
 * Displays alerts for working period.
 *
 * @param {Object} props component properties
 * @param {string[]} [props.alerts] array of alert ids
 * @param {string} [props.className] class name to be added to alerts wrapper
 * @returns {JSX.Element}
 */
const PeriodAlerts = ({ alerts, className }) => {
  const alertsTooltipContent = useMemo(() => {
    if (!alerts) {
      return null;
    }
    if (alerts.length === 1) {
      return ALERT_MESSAGE_MAP[alerts[0]];
    }
    return (
      <ul>
        {alerts.map((alertId) => (
          <li key={alertId}>{ALERT_MESSAGE_MAP[alertId]}</li>
        ))}
      </ul>
    );
  }, [alerts]);

  return (
    <Tooltip
      content={alertsTooltipContent}
      isDisabled={!alerts}
      targetClassName={cn(
        styles.container,
        { [styles.hasAlerts]: !!alerts },
        className
      )}
      tooltipClassName={styles.tooltip}
    >
      {alerts
        ? alerts.map((alertId) => ALERT_MESSAGE_MAP[alertId]).join(", ")
        : "None"}
    </Tooltip>
  );
};

PeriodAlerts.propTypes = {
  alerts: PT.arrayOf(PT.string),
  className: PT.string,
};

export default PeriodAlerts;
