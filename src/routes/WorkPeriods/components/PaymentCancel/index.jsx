import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import PT from "prop-types";
import cn from "classnames";
import Button from "components/Button";
import Modal from "components/Modal";
import Spinner from "components/Spinner";
import { makeToast } from "components/ToastrMessage";
import { PAYMENT_STATUS } from "constants/workPeriods";
import { setWorkPeriodPaymentData } from "store/actions/workPeriods";
import { cancelWorkPeriodPayment } from "services/workPeriods";
import styles from "./styles.module.scss";
import { loadWorkPeriodAfterPaymentCancel } from "store/thunks/workPeriods";

/**
 * Displays a Cancel button. Shows a modal with payment cancelling confirmation
 * when clicking this button.
 *
 * @param {Object} props component properties
 * @param {string} [props.className] class name to be added to root element
 * @param {Object} props.item payment object with id, workPeriodId and status
 * @param {number} [props.timeout] timeout the delay after cancelling payment
 * after which an attempt will be made to update working period's data from the server
 * @returns {JSX.Element}
 */
const PaymentCancel = ({ className, item, timeout = 3000 }) => {
  const { id: paymentId, workPeriodId: periodId } = item;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCancelPending, setIsCancelPending] = useState(false);
  const [isCancelSuccess, setIsCancelSuccess] = useState(false);
  const dispatch = useDispatch();

  const onApprove = useCallback(() => {
    setIsCancelPending(true);
  }, []);

  const onDismiss = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const openModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  useEffect(() => {
    if (isCancelPending) {
      cancelWorkPeriodPayment(paymentId)
        .then((paymentData) => {
          dispatch(setWorkPeriodPaymentData(paymentData));
          setIsCancelSuccess(true);
        })
        .catch((error) => {
          makeToast(error.toString());
          setIsCancelPending(false);
        });
    }
  }, [isCancelPending, paymentId, dispatch]);

  useEffect(() => {
    let timeoutId = 0;
    if (isCancelSuccess) {
      timeoutId = window.setTimeout(async () => {
        timeoutId = 0;
        await dispatch(loadWorkPeriodAfterPaymentCancel(periodId, paymentId));
        setIsModalOpen(false);
        setIsCancelSuccess(false);
        setIsCancelPending(false);
      }, timeout);
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isCancelSuccess, paymentId, periodId, timeout, dispatch]);

  let title, controls;
  if (isCancelPending) {
    controls = null;
    title = "Marking as cancelled...";
  } else {
    controls = undefined;
    title = "Warning!";
  }

  return (
    <div className={cn(styles.container, className)}>
      <Button
        isDisabled={
          item.status === PAYMENT_STATUS.CANCELLED ||
          item.status === PAYMENT_STATUS.IN_PROGRESS
        }
        size="small"
        color="error"
        variant="contained"
        onClick={openModal}
      >
        Cancel
      </Button>
      <Modal
        approveText={"Mark as cancelled"}
        dismissText={"Cancel cancelling"}
        title={title}
        isOpen={isModalOpen}
        controls={controls}
        onApprove={onApprove}
        onDismiss={onDismiss}
      >
        {isCancelPending ? (
          <Spinner />
        ) : (
          `Cancelling payment here will only mark it as cancelled in TaaS system.
        Before cancelling it here, make sure that actual payment is cancelled in
        PACTS first, and only after that you may mark it as cancelled here.`
        )}
      </Modal>
    </div>
  );
};

PaymentCancel.propTypes = {
  className: PT.string,
  item: PT.shape({
    id: PT.string.isRequired,
    status: PT.string.isRequired,
    workPeriodId: PT.string.isRequired,
  }).isRequired,
  timeout: PT.number,
};

export default PaymentCancel;
