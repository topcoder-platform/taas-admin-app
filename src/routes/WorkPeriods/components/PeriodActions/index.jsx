import React, { useCallback, useMemo, useState } from "react";
import PT from "prop-types";
import cn from "classnames";
import moment from "moment";
import ActionsMenu from "components/ActionsMenu";
import PaymentModalAdditional from "../PaymentModalAdditional";
import PaymentModalUpdateBA from "../PaymentModalUpdateBA";
import {
  REASON_DISABLED,
  REASON_DISABLED_MESSAGE_MAP,
} from "constants/workPeriods";
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
        checkDisabled() {
          let reasonsDisabled = [];
          if (moment(period.start).isAfter(Date.now())) {
            reasonsDisabled.push(
              REASON_DISABLED_MESSAGE_MAP[REASON_DISABLED.NOT_ALLOW_FUTURE_WEEK]
            );
          }
          if (!period.billingAccountId) {
            reasonsDisabled.push(
              REASON_DISABLED_MESSAGE_MAP[REASON_DISABLED.NO_BILLING_ACCOUNT]
            );
          }
          return reasonsDisabled.length ? reasonsDisabled : null;
        },
      },
    ];
    if (payments?.length) {
      // @ts-ignore
      actions.push({
        label: "Update BA for payments",
        action() {
          setIsOpenUpdateBAModal(true);
        },
      });
    }
    return actions;
  }, [period.billingAccountId, period.start, payments]);

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
    billingAccountId: PT.number,
    start: PT.oneOfType([PT.number, PT.string]).isRequired,
    end: PT.oneOfType([PT.number, PT.string]).isRequired,
  }).isRequired,
  periodData: PT.shape({
    payments: PT.array,
  }).isRequired,
};

export default PeriodActions;
