import React, { useMemo } from "react";
import PT from "prop-types";
import cn from "classnames";
import Popover from "components/Popover";
import IconExclamationMark from "components/Icons/ExclamationMarkCircled";
import PaymentErrorDetails from "../PaymentErrorDetails";
import styles from "./styles.module.scss";

/**
 * Displays an error icon and error details popup.
 *
 * @param {Object} props component properties
 * @param {string} [props.className] class name to be added to root element
 * @param {Object} [props.errorDetails] error details object
 * @param {boolean} [props.isImportant] whether the error deemed important
 * @param {'absolute'|'fixed'} [props.popupStrategy] popup positioning strategy
 * @returns {JSX.Element}
 */
const PaymentError = ({
  className,
  errorDetails,
  isImportant = true,
  popupStrategy = "absolute",
}) => {
  const paymentErrorDetails = useMemo(
    () => <PaymentErrorDetails details={errorDetails} />,
    [errorDetails]
  );
  return (
    <Popover
      className={className}
      content={paymentErrorDetails}
      stopClickPropagation={true}
      strategy={popupStrategy}
    >
      <IconExclamationMark
        className={cn(styles.icon, { [styles.isImportant]: isImportant })}
      />
    </Popover>
  );
};

PaymentError.propTypes = {
  className: PT.string,
  errorDetails: PT.object,
  isImportant: PT.bool,
  popupStrategy: PT.oneOf(["absolute", "fixed"]),
};

export default PaymentError;
