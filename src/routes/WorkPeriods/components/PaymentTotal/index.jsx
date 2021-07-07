import React, { useMemo } from "react";
import PT from "prop-types";
import cn from "classnames";
import Popover from "components/Popover";
import PaymentsList from "../PaymentsList";
import { currencyFormatter } from "utils/formatters";
import styles from "./styles.module.scss";

/**
 * Displays the total paid sum and a popup with payments' list.
 *
 * @param {Object} props component properties
 * @param {string}  [props.className] class name to be added to root element
 * @param {Array} [props.payments] an array with payments information
 * @param {number} props.paymentTotal total paid sum
 * @param {number} props.daysPaid number of paid days
 * @param {'absolute'|'fixed'} [props.popupStrategy] popup positioning strategy
 * @returns {JSX.Element}
 */
const PaymentTotal = ({
  className,
  payments,
  paymentTotal,
  daysPaid,
  popupStrategy = "absolute",
}) => {
  const hasPayments = !!payments && !!payments.length;

  const paymentsList = useMemo(
    () => (hasPayments ? <PaymentsList payments={payments} /> : null),
    [hasPayments, payments]
  );

  return (
    <Popover
      className={className}
      content={paymentsList}
      stopClickPropagation={hasPayments}
      strategy={popupStrategy}
      targetClassName={cn(styles.paymentTotal, {
        [styles.hasPayments]: hasPayments,
      })}
    >
      <span className={styles.paymentTotalSum}>
        {currencyFormatter.format(paymentTotal)}
      </span>
      &nbsp;
      <span className={styles.daysPaid}>({daysPaid})</span>
    </Popover>
  );
};

PaymentTotal.propTypes = {
  className: PT.string,
  payments: PT.array,
  paymentTotal: PT.number.isRequired,
  daysPaid: PT.number.isRequired,
  popupStrategy: PT.oneOf(["absolute", "fixed"]),
};

export default PaymentTotal;
