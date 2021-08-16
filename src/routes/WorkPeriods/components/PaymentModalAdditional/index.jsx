import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import PT from "prop-types";
import moment from "moment";
import debounce from "lodash/debounce";
import Modal from "components/Modal";
import Spinner from "components/Spinner";
import CurrencyField from "components/CurrencyField";
import { addWorkPeriodPayment } from "store/thunks/workPeriods";
import { useUpdateEffect } from "utils/hooks";
import { preventDefault, validateAmount } from "utils/misc";
import { ERROR_MESSAGE } from "constants/workPeriods";
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
  const [amount, setAmount] = useState("");
  const [isAmountValid, setIsAmountValid] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const dispatch = useDispatch();

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
        addWorkPeriodPayment(period.id, { days: 0, amount })
      );
      setIsModalOpen(!ok);
      setIsProcessing(false);
    })();
  }, [amount, isProcessing, period.id, dispatch]);

  return (
    <Modal
      approveColor="primary"
      approveDisabled={!amount || !isAmountValid || isProcessing}
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
            &quot; for the week &quot;{moment(period.start).format("MM/DD")}
            &nbsp;-&nbsp;{moment(period.end).format("MM/DD")}&quot;
          </div>
          <form className={styles.form} action="#" onSubmit={preventDefault}>
            <CurrencyField
              className={styles.amountField}
              error={isAmountValid ? null : ERROR_MESSAGE.AMOUNT_OUT_OF_BOUNDS}
              isTouched={true}
              label="Amount ($)"
              name={`payment_amount_${period.id}`}
              onChange={setAmount}
              value={amount}
            />
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
