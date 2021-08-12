import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import PT from "prop-types";
import Modal from "components/Modal";
import Spinner from "components/Spinner";
import { cancelWorkPeriodPayment } from "store/thunks/workPeriods";

/**
 * Displays a Cancel button. Shows a modal with payment cancelling confirmation
 * when clicking this button.
 *
 * @param {Object} props component properties
 * @param {Object} props.payment payment object with id, workPeriodId and status
 * @param {() => void} props.removeModal function called when the closing
 * animation of the modal is finished
 * @returns {JSX.Element}
 */
const PaymentModalCancel = ({ payment, removeModal }) => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const dispatch = useDispatch();
  const { id: paymentId, workPeriodId: periodId } = payment;

  const onApprove = useCallback(() => {
    setIsProcessing(true);
  }, []);

  const onDismiss = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  useEffect(() => {
    if (!isProcessing) {
      return;
    }
    (async function () {
      let ok = await dispatch(cancelWorkPeriodPayment(periodId, paymentId));
      setIsModalOpen(!ok);
      setIsProcessing(false);
    })();
  }, [isProcessing, paymentId, periodId, dispatch]);

  let title, controls;
  if (isProcessing) {
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
      isDisabled={isProcessing}
      isOpen={isModalOpen}
      controls={controls}
      onApprove={onApprove}
      onClose={removeModal}
      onDismiss={onDismiss}
    >
      {isProcessing ? (
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
};

export default PaymentModalCancel;
