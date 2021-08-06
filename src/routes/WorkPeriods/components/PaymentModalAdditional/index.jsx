import React, { useCallback, useEffect, useState } from "react";
import PT from "prop-types";
import moment from "moment";
import debounce from "lodash/debounce";
import Modal from "components/Modal";
import Spinner from "components/Spinner";
import TextField from "components/TextField";
import ValidationError from "components/ValidationError";
import { makeToast } from "components/ToastrMessage";
import { postWorkPeriodPayment } from "services/workPeriods";
import { useUpdateEffect } from "utils/hooks";
import { preventDefault, validateAmount } from "utils/misc";
import styles from "./styles.module.scss";

/**
 * Displays a modal which allows to schedule arbitrary payment for specific
 * working period.
 *
 * @param {Object} props component properties
 * @returns {JSX.Element}
 */
const PaymentModalAdditional = ({ period, removeModal }) => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [amount, setAmount] = useState("0");
  const [isAmountValid, setIsAmountValid] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

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
    postWorkPeriodPayment({ workPeriodId: period.id, days: 0, amount })
      .then(() => {
        makeToast("Additional payment scheduled for resource", "success");
        setIsModalOpen(false);
      })
      .catch((error) => {
        makeToast(error.toString());
      })
      .finally(() => {
        setIsProcessing(false);
      });
  }, [amount, isProcessing, period.id]);

  return (
    <Modal
      approveColor="primary"
      approveDisabled={!isAmountValid || isProcessing}
      approveText="Process Payment"
      dismissText="Cancel"
      title="Additional Payment"
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
          <div className={styles.description}>
            Additional payment for Resource Booking &quot;{period.userHandle}
            &quot; for week &quot;{moment(period.start).format("MM/DD")}
            &nbsp;-&nbsp;{moment(period.end).format("MM/DD")}&quot;
          </div>
          <form className={styles.form} action="#" onSubmit={preventDefault}>
            <TextField
              className={styles.amountField}
              isValid={isAmountValid}
              label="Amount ($)"
              name={`payment_amount_${period.id}`}
              value={amount}
              onChange={onChangeAmount}
            />
            {!isAmountValid && (
              <ValidationError className={styles.amountError}>
                Amount should be greater than 0 and less than 100,000.
              </ValidationError>
            )}
          </form>
        </>
      )}
    </Modal>
  );
};

PaymentModalAdditional.propTypes = {
  period: PT.shape({
    id: PT.string.isRequired,
    userHandle: PT.string.isRequired,
    start: PT.oneOfType([PT.number, PT.string]).isRequired,
    end: PT.oneOfType([PT.number, PT.string]).isRequired,
  }).isRequired,
  removeModal: PT.func.isRequired,
};

export default PaymentModalAdditional;
