import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import PT from "prop-types";
import debounce from "lodash/debounce";
import Modal from "components/Modal";
import Spinner from "components/Spinner";
import CurrencyField from "components/CurrencyField";
import { updateWorkPeriodPayment } from "store/thunks/workPeriods";
import { useUpdateEffect } from "utils/hooks";
import { preventDefault, validateAmount } from "utils/misc";
import { ERROR_MESSAGE } from "constants/workPeriods";
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
  const [isTouched, setIsTouched] = useState(false);
  const dispatch = useDispatch();

  const { id: paymentId, workPeriodId: periodId } = payment;
  const amountControlId = `edit_pmt_amt_${paymentId}`;

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

  const onChangeAmount = useCallback((amount) => {
    setIsTouched(true);
    setAmount(amount);
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
    (async function () {
      let ok = await dispatch(
        updateWorkPeriodPayment(periodId, paymentId, { amount })
      );
      setIsModalOpen(!ok);
      setIsProcessing(false);
    })();
  }, [amount, isProcessing, paymentId, periodId, dispatch]);

  return (
    <Modal
      approveColor="primary"
      approveDisabled={!isTouched || !isAmountValid || isProcessing}
      approveText="Update"
      title="Edit Additional Payment"
      controls={isProcessing ? null : undefined}
      isDisabled={isProcessing}
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
                <CurrencyField
                  error={
                    isAmountValid ? null : ERROR_MESSAGE.AMOUNT_OUT_OF_BOUNDS
                  }
                  id={amountControlId}
                  isTouched={isTouched}
                  name="edit_payment_amount"
                  onChange={onChangeAmount}
                  value={amount}
                />
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
    workPeriodId: PT.string.isRequired,
  }).isRequired,
  removeModal: PT.func.isRequired,
};

export default PaymentModalEditAdditional;
