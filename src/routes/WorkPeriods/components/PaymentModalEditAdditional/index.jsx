import React, { useCallback, useEffect, useState } from "react";
import PT from "prop-types";
import debounce from "lodash/debounce";
import Modal from "components/Modal";
import Spinner from "components/Spinner";
import TextField from "components/TextField";
import ValidationError from "components/ValidationError";
import { makeToast } from "components/ToastrMessage";
import { patchWorkPeriodPayment } from "services/workPeriods";
import { useUpdateEffect } from "utils/hooks";
import { preventDefault, validateAmount } from "utils/misc";
import styles from "./styles.module.scss";

/**
 * Displays a modal allowing to edit additional payment amount.
 *
 * @param {Object} props component properties
 * @returns {JSX.Element}
 */
const PaymentModalEditAdditional = ({ payment, removeModal }) => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [amount, setAmount] = useState(payment.amount);
  const [isAmountValid, setIsAmountValid] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const amountControlId = `edit_pmt_amt_${payment.id}`;

  const onApprove = () => {
    let isAmountValid = validateAmount(amount);
    if (isAmountValid) {
      setIsProcessing(true);
    }
    setIsAmountValid(isAmountValid);
  };

  const onDismiss = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const onAmountChange = useCallback((amount) => {
    setAmount((amount || "").trim());
  }, []);

  const validateAmountDebounced = useCallback(
    debounce(
      (amount) => {
        setIsAmountValid(validateAmount(amount));
      },
      500,
      { leading: false }
    ),
    []
  );

  useUpdateEffect(() => {
    setIsAmountValid(true);
    validateAmountDebounced(amount);
  }, [amount]);

  useEffect(() => {
    if (!isProcessing) {
      return;
    }
    patchWorkPeriodPayment(payment.id, { amount })
      .then(() => {
        makeToast("Payment was successfully updated", "success");
        setIsModalOpen(false);
      })
      .catch((error) => {
        makeToast(error.toString());
      })
      .finally(() => {
        setIsProcessing(false);
      });
  }, [amount, isProcessing, payment.id]);

  return (
    <Modal
      approveColor="primary"
      approveDisabled={!isAmountValid || isProcessing}
      approveText="Update"
      title="Edit Additional Payment"
      controls={isProcessing ? null : undefined}
      isOpen={isModalOpen}
      onApprove={onApprove}
      onClose={removeModal}
      onDismiss={onDismiss}
    >
      {isProcessing ? (
        <Spinner />
      ) : (
        <>
          <form className={styles.form} onSubmit={preventDefault} action="#">
            <div className={styles.fieldRow}>
              <div className={styles.fieldLabel}>
                <label htmlFor={amountControlId}>Amount:</label>
              </div>
              <div className={styles.fieldControl}>
                <TextField
                  id={amountControlId}
                  isValid={isAmountValid}
                  name="edit_payment_amount"
                  onChange={onAmountChange}
                  value={amount}
                />
                {!isAmountValid && (
                  <ValidationError>
                    Amount should be greater than 0 and less than 100,000.
                  </ValidationError>
                )}
              </div>
            </div>
          </form>
          <div className={styles.notice}>
            Notice: please, update payment amount in PACTS too.
          </div>
        </>
      )}
    </Modal>
  );
};

PaymentModalEditAdditional.propTypes = {
  payment: PT.shape({
    amount: PT.number.isRequired,
    id: PT.string.isRequired,
  }).isRequired,
  removeModal: PT.func.isRequired,
};

export default PaymentModalEditAdditional;
