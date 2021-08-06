import React, { useCallback, useMemo, useState } from "react";
import PT from "prop-types";
import cn from "classnames";
import ActionsMenu from "components/ActionsMenu";
import PaymentModalCancel from "../PaymentModalCancel";
import PaymentModalEdit from "../PaymentModalEdit";
import PaymentModalEditAdditional from "../PaymentModalEditAdditional";
import { PAYMENT_STATUS } from "constants/workPeriods";
import styles from "./styles.module.scss";

/**
 * Displays a menu with actions for specific payment.
 *
 * @param {Object} props component properties
 * @returns {JSX.Element}
 */
const PaymentActions = ({ className, daysPaid, daysWorked, payment }) => {
  const [isOpenCancelModal, setIsOpenCancelModal] = useState(false);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const paymentStatus = payment.status;

  const closeCancelModal = useCallback(() => {
    setIsOpenCancelModal(false);
  }, []);

  const closeEditModal = useCallback(() => {
    setIsOpenEditModal(false);
  }, []);

  const actions = useMemo(
    () => [
      {
        label: "Cancel Payment",
        action() {
          setIsOpenCancelModal(true);
        },
        disabled:
          paymentStatus === PAYMENT_STATUS.CANCELLED ||
          paymentStatus === PAYMENT_STATUS.IN_PROGRESS,
      },
      {
        label: "Edit Payment",
        action() {
          setIsOpenEditModal(true);
        },
        disabled: paymentStatus === PAYMENT_STATUS.IN_PROGRESS,
      },
    ],
    [paymentStatus]
  );

  return (
    <div className={cn(styles.container, className)}>
      <ActionsMenu items={actions} />
      {isOpenCancelModal && (
        <PaymentModalCancel payment={payment} removeModal={closeCancelModal} />
      )}
      {isOpenEditModal &&
        (payment.days > 0 ? (
          <PaymentModalEdit
            daysPaid={daysPaid}
            daysWorked={daysWorked}
            payment={payment}
            removeModal={closeEditModal}
          />
        ) : (
          <PaymentModalEditAdditional
            payment={payment}
            removeModal={closeEditModal}
          />
        ))}
    </div>
  );
};

PaymentActions.propTypes = {
  className: PT.string,
  daysPaid: PT.number.isRequired,
  daysWorked: PT.number.isRequired,
  payment: PT.shape({
    days: PT.number.isRequired,
    id: PT.string.isRequired,
    status: PT.string.isRequired,
  }).isRequired,
};

export default PaymentActions;
