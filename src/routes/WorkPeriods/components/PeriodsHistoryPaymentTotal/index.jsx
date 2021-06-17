/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useCallback, useRef, useState } from "react";
import { usePopper } from "react-popper";
import PT from "prop-types";
import cn from "classnames";
import PaymentsPopup from "../PaymentsPopup";
import { useClickOutside } from "utils/hooks";
import { currencyFormatter } from "utils/formatters";
import compStyles from "./styles.module.scss";

const PeriodsHistoryPaymentTotal = ({
  className,
  payments,
  paymentTotal,
  daysPaid,
}) => {
  const [isShowPopup, setIsShowPopup] = useState(false);
  const containerRef = useRef();

  const [referenceElement, setReferenceElement] = useState(null);
  const [popperElement, setPopperElement] = useState(null);
  const [arrowElement, setArrowElement] = useState(null);
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: "bottom",
    modifiers: [
      { name: "arrow", options: { element: arrowElement, padding: 10 } },
      { name: "offset", options: { offset: [0, 5] } },
      { name: "preventOverflow", options: { padding: 15 } },
    ],
  });

  const onWeeklyRateClick = useCallback(() => {
    setIsShowPopup(negate);
  }, []);

  const onClickOutside = useCallback(() => {
    setIsShowPopup(false);
  }, []);

  useClickOutside(containerRef, onClickOutside, []);

  const hasPayments = !!payments && !!payments.length;

  return (
    <div className={cn(compStyles.container, className)} ref={containerRef}>
      <div
        className={cn(compStyles.paymentTotal, {
          [compStyles.hasPayments]: hasPayments,
        })}
        ref={setReferenceElement}
        onClick={onWeeklyRateClick}
      >
        <span className={compStyles.paymentTotalSum}>
          {currencyFormatter.format(paymentTotal)}
        </span>
        <span className={compStyles.daysPaid}> ({daysPaid})</span>
      </div>
      {hasPayments && isShowPopup && (
        <div
          className={compStyles.popup}
          ref={setPopperElement}
          style={styles.popper}
          {...attributes.popper}
        >
          <PaymentsPopup payments={payments} />
          <div
            className="dropdown-arrow"
            ref={setArrowElement}
            style={styles.arrow}
          />
        </div>
      )}
    </div>
  );
};

PeriodsHistoryPaymentTotal.propTypes = {
  className: PT.string,
  payments: PT.array,
  paymentTotal: PT.number.isRequired,
  daysPaid: PT.number.isRequired,
};

function negate(value) {
  return !value;
}

export default PeriodsHistoryPaymentTotal;
