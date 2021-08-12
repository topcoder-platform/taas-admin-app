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
  const [isOpenAddPaymentModal, setIsOpenAddPaymentModal] = useState(false);
  const [isOpenUpdateBAModal, setIsOpenUpdateBAModal] = useState(false);
  const payments = periodData.payments;

  const closeAddPaymentModal = useCallback(() => {
    setIsOpenAddPaymentModal(false);
  }, []);

  const closeUpdateBAModal = useCallback(() => {
    setIsOpenUpdateBAModal(false);
  }, []);

  const actions = useMemo(() => {
    let actions = [
      {
        label: "Additional Payment",
        action() {
          setIsOpenAddPaymentModal(true);
        },
      },
    ];
    if (payments?.length) {
      actions.push({
        label: "Update BA for payments",
        action() {
          setIsOpenUpdateBAModal(true);
        },
      });
    }
    return actions;
  }, [payments]);

  return (
    <div className={cn(styles.container, className)}>
      <ActionsMenu
        items={actions}
        popupStrategy="fixed"
        stopClickPropagation={true}
      />
      {isOpenAddPaymentModal && (
        <PaymentModalAdditional
          period={period}
          removeModal={closeAddPaymentModal}
        />
      )}
      {isOpenUpdateBAModal && (
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
