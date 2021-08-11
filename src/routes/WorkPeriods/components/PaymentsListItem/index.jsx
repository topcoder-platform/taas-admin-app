// @ts-nocheck
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useCallback, useRef } from "react";
import PT from "prop-types";
import PaymentActions from "../PaymentActions";
import PaymentError from "../PaymentError";
import PaymentStatus from "../PaymentStatus";
import {
  currencyFormatter,
  formatChallengeUrl,
  formatDateTimeInTimeZone,
} from "utils/formatters";
import { PAYMENT_STATUS } from "constants/workPeriods";
import styles from "./styles.module.scss";

/**
 * Displays the row in payments list table with information about specific
 * payment.
 *
 * @param {Object} props component properties
 * @returns {JSX.Element}
 */
const PaymentsListItem = ({ daysPaid, daysWorked, item }) => {
  const inputRef = useRef();

  const onCopyLinkClick = useCallback(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
    document.execCommand("copy");
  }, []);

  return (
    <tr>
      <td>
        <div className={styles.challengeId}>
          <span className={styles.iconLink}></span>
          <input
            readOnly
            ref={inputRef}
            type="text"
            value={item.challengeId || "0"}
          />
          <span
            className={styles.iconCopyLink}
            onClick={onCopyLinkClick}
          ></span>
          <a
            className={styles.iconOpenLink}
            href={formatChallengeUrl(item.challengeId)}
            target="_blank"
            rel="noreferrer"
          >
            <span className={styles.hidden}>{item.id}</span>
          </a>
        </div>
      </td>
      <td className={styles.weeklyRate}>
        {currencyFormatter.format(item.memberRate)}
      </td>
      <td className={styles.days}>{item.days}</td>
      <td className={styles.amount}>{currencyFormatter.format(item.amount)}</td>
      <td className={styles.createdAt}>
        {formatDateTimeInTimeZone(item.createdAt)}
      </td>
      <td className={styles.paymentStatus}>
        <div className={styles.statusWithError}>
          <PaymentStatus status={item.status} />
          {item.status === PAYMENT_STATUS.FAILED && (
            <PaymentError
              className={styles.paymentError}
              errorDetails={item.statusDetails}
            />
          )}
        </div>
      </td>
      <td className={styles.paymentCancel}>
        <PaymentActions
          daysPaid={daysPaid}
          daysWorked={daysWorked}
          payment={item}
        />
      </td>
    </tr>
  );
};

PaymentsListItem.propTypes = {
  daysPaid: PT.number.isRequired,
  daysWorked: PT.number.isRequired,
  item: PT.shape({
    id: PT.oneOfType([PT.string, PT.number]).isRequired,
    amount: PT.number.isRequired,
    challengeId: PT.oneOfType([PT.string, PT.number]),
    createdAt: PT.number.isRequired,
    days: PT.number.isRequired,
    memberRate: PT.number.isRequired,
    status: PT.string.isRequired,
    statusDetails: PT.object,
  }),
};

export default PaymentsListItem;
