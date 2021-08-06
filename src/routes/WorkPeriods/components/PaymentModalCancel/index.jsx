import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import PT from "prop-types";
import Modal from "components/Modal";
import Spinner from "components/Spinner";
import { makeToast } from "components/ToastrMessage";
import { setWorkPeriodPaymentData } from "store/actions/workPeriods";
import { loadWorkPeriodAfterPaymentCancel } from "store/thunks/workPeriods";
import { cancelWorkPeriodPayment } from "services/workPeriods";

/**
 * Displays a Cancel button. Shows a modal with payment cancelling confirmation
 * when clicking this button.
 *
 * @param {Object} props component properties
 * @param {Object} props.payment payment object with id, workPeriodId and status
 * @param {() => void} props.removeModal function called when the closing
 * animation of the modal is finished
 * @param {number} [props.timeout] timeout the delay after cancelling payment
 * after which an attempt will be made to update working period's data from the server
 * @returns {JSX.Element}
 */
const PaymentModalCancel = ({ payment, removeModal, timeout = 3000 }) => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [isCancelPending, setIsCancelPending] = useState(false);
  const [isCancelSuccess, setIsCancelSuccess] = useState(false);
  const dispatch = useDispatch();
  const { id: paymentId, workPeriodId: periodId } = payment;

  const onApprove = useCallback(() => {
    setIsCancelPending(true);
  }, []);

  const onDismiss = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  useEffect(() => {
    if (!isCancelPending) {
      return;
    }
    cancelWorkPeriodPayment(paymentId)
      .then((paymentData) => {
        dispatch(setWorkPeriodPaymentData(paymentData));
        setIsCancelSuccess(true);
      })
      .catch((error) => {
        makeToast(error.toString());
        setIsCancelPending(false);
      });
  }, [isCancelPending, paymentId, dispatch]);

  useEffect(() => {
    let timeoutId = 0;
    if (!isCancelSuccess) {
      return;
    }
    timeoutId = window.setTimeout(async () => {
      timeoutId = 0;
      await dispatch(loadWorkPeriodAfterPaymentCancel(periodId, paymentId));
      setIsModalOpen(false);
      setIsCancelSuccess(false);
      setIsCancelPending(false);
    }, timeout);
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
    <Modal
      approveText="Mark as cancelled"
      dismissText="Cancel cancelling"
      title={title}
      isOpen={isModalOpen}
      controls={controls}
      onApprove={onApprove}
      onClose={removeModal}
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
  );
};

PaymentModalCancel.propTypes = {
  payment: PT.shape({
    id: PT.string.isRequired,
    status: PT.string.isRequired,
    workPeriodId: PT.string.isRequired,
  }).isRequired,
  removeModal: PT.func.isRequired,
  timeout: PT.number,
};

export default PaymentModalCancel;
