import React, { useCallback, useMemo, useState } from "react";
import PT from "prop-types";
import cn from "classnames";
import ActionsMenu from "components/ActionsMenu";
import PaymentModalAdditional from "../PaymentModalAdditional";
import PaymentModalUpdateBA from "../PaymentModalUpdateBA";
import styles from "./styles.module.scss";

/**
 * Displays period actions' dropdown menu.
 *
 * @param {Object} props component properties
 * @returns {JSX.Element}
 */
const PeriodActions = ({ className, period, periodData }) => {
  const [isAddPaymentModalOpen, setIsAddPaymentModalOpen] = useState(false);
  const [isUpdateBAModalOpen, setIsUpdateBAModalOpen] = useState(false);
  const payments = periodData.payments;

  const openAddPaymentModal = useCallback(() => {
    setIsAddPaymentModalOpen(true);
  }, []);

  const closeAddPaymentModal = useCallback(() => {
    setIsAddPaymentModalOpen(false);
  }, []);

  const openUpdateBAModal = useCallback(() => {
    setIsUpdateBAModalOpen(true);
  }, []);

  const closeUpdateBAModal = useCallback(() => {
    setIsUpdateBAModalOpen(false);
  }, []);

  const actions = useMemo(() => {
    let actions = [
      { label: "Additional Payment", action: openAddPaymentModal },
    ];
    if (payments?.length) {
      actions.push({
        label: "Update BA for payments",
        action: openUpdateBAModal,
      });
    }
    return actions;
  }, [payments, openAddPaymentModal, openUpdateBAModal]);

  return (
    <div className={cn(styles.container, className)}>
      <ActionsMenu
        items={actions}
        popupStrategy="fixed"
        stopClickPropagation={true}
      />
      {isAddPaymentModalOpen && (
        <PaymentModalAdditional
          period={period}
          removeModal={closeAddPaymentModal}
        />
      )}
      {isUpdateBAModalOpen && (
        <PaymentModalUpdateBA
          payments={payments}
          period={period}
          removeModal={closeUpdateBAModal}
        />
      )}
    </div>
  );
};

PeriodActions.propTypes = {
  className: PT.string,
  period: PT.shape({
    id: PT.string.isRequired,
    start: PT.oneOfType([PT.number, PT.string]).isRequired,
    end: PT.oneOfType([PT.number, PT.string]).isRequired,
  }).isRequired,
  periodData: PT.shape({
    payments: PT.array,
  }).isRequired,
};

export default PeriodActions;
