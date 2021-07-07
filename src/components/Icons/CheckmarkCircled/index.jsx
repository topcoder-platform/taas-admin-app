import React, { useEffect, useState } from "react";
import PT from "prop-types";
import cn from "classnames";
import Icon from "../../../assets/images/icon-checkmark-circled.svg";
import styles from "./styles.module.scss";

/**
 * Displays an animated checkmark inside circle. After the specified timeout
 * the checkmark is faded out and after fade transition ends the onTimeout
 * is called.
 *
 * @param {Object} props component properties
 * @param {string} [props.className] class name to be added to root element
 * @param {() => void} props.onTimeout
 * @param {number} props.timeout timeout milliseconds
 * @returns {JSX.Element}
 */
const CheckmarkCircled = ({ className, onTimeout, timeout = 2000 }) => {
  const [isAnimated, setIsAnimated] = useState(false);
  const [isTimedOut, setIsTimedOut] = useState(false);

  useEffect(() => {
    setIsAnimated(true);
  }, []);

  useEffect(() => {
    setIsTimedOut(false);
    let timeoutId = setTimeout(() => {
      timeoutId = 0;
      setIsTimedOut(true);
    }, Math.max(timeout, /* total CSS animation duration */ 1200));
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeout]);

  return (
    <span
      className={cn(
        styles.container,
        { [styles.fadeOut]: isTimedOut },
        className
      )}
      onTransitionEnd={isTimedOut ? onTimeout : null}
    >
      <Icon
        className={cn(styles.checkmark, { [styles.animated]: isAnimated })}
      />
    </span>
  );
};

CheckmarkCircled.propTypes = {
  className: PT.string,
  onTimeout: PT.func.isRequired,
  timeout: PT.number,
};

export default CheckmarkCircled;
