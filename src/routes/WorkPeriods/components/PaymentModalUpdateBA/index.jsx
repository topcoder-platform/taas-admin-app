import React, { useCallback, useEffect, useState } from "react";
import PT from "prop-types";
import cn from "classnames";
import moment from "moment";
import JobName from "components/JobName";
import Modal from "components/Modal";
import ProjectName from "components/ProjectName";
import Spinner from "components/Spinner";
import SelectField from "components/SelectField";
import { makeToast } from "components/ToastrMessage";
import {
  fetchBillingAccounts,
  patchWorkPeriodPayments,
} from "services/workPeriods";
import {
  createAssignedBillingAccountOption,
  normalizeBillingAccounts,
} from "utils/workPeriods";
import { preventDefault } from "utils/misc";
import {
  BILLING_ACCOUNTS_ERROR,
  BILLING_ACCOUNTS_LOADING,
  BILLING_ACCOUNTS_NONE,
} from "constants/workPeriods";
import styles from "./styles.module.scss";

/**
 * Displays a modal that allows to update billing account for all working period
 * payments.
 *
 * @param {Object} props component properties
 * @returns {JSX.Element}
 */
const PaymentModalUpdateBA = ({ payments = [], period, removeModal }) => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [billingAccountId, setBillingAccountId] = useState(
    period.billingAccountId
  );
  const [billingAccounts, setBillingAccounts] = useState([
    { label: BILLING_ACCOUNTS_LOADING, value: billingAccountId },
  ]);
  const [billingAccountsDisabled, setBillingAccountsDisabled] = useState(true);
  const [billingAccountsError, setBillingAccountsError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const [bilAccsPromise] = fetchBillingAccounts(period.projectId);
    bilAccsPromise
      .then((data) => {
        const accounts = normalizeBillingAccounts(data);
        let accountId = period.billingAccountId;
        let hasAssignedAccount = false;
        for (let account of accounts) {
          if (account.value === accountId) {
            hasAssignedAccount = true;
            break;
          }
        }
        if (accountId > 0 && !hasAssignedAccount) {
          accounts.unshift(createAssignedBillingAccountOption(accountId));
        }
        let accountsDisabled = false;
        if (!accounts.length) {
          accounts.push({
            value: accountId,
            label: BILLING_ACCOUNTS_NONE,
          });
          accountsDisabled = true;
        }
        setBillingAccountsDisabled(accountsDisabled);
        setBillingAccounts(accounts);
      })
      .catch((error) => {
        let accounts = [];
        let accountsDisabled = true;
        let accountId = period.billingAccountId;
        if (accountId) {
          accounts.push(createAssignedBillingAccountOption(accountId));
          accountsDisabled = false;
        } else {
          accounts.push({
            value: accountId,
            label: BILLING_ACCOUNTS_ERROR,
          });
        }
        setBillingAccountsDisabled(accountsDisabled);
        setBillingAccountsError(error.toString());
        setBillingAccounts(accounts);
      });
  }, [period.billingAccountId, period.projectId]);

  useEffect(() => {
    if (!isProcessing) {
      return;
    }
    const paymentsUpdated = [];
    for (let { id } of payments) {
      paymentsUpdated.push({ id, billingAccountId });
    }
    patchWorkPeriodPayments(paymentsUpdated)
      .then(() => {
        makeToast(
          "Billing account was successfully updated for all the payments",
          "success"
        );
        setIsModalOpen(false);
      })
      .catch((error) => {
        makeToast(error.toString());
      })
      .finally(() => {
        setIsProcessing(false);
      });
  }, [billingAccountId, isProcessing, payments, period.id]);

  const onApprove = useCallback(() => {
    setIsProcessing(true);
  }, []);

  const onDismiss = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const accountIdsHash = {};
  for (let payment of payments) {
    accountIdsHash[payment.billingAccountId] = true;
  }

  return (
    <Modal
      approveColor="primary"
      approveDisabled={!payments.length}
      approveText="Update BA for payments"
      dismissText="Cancel"
      title="Update Billing Account for Payments"
      className={styles.modal}
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
            Update Billing account for all the payments done during the Work
            Period.
          </div>
          <div className={styles.periodInfo}>
            <table>
              <tbody>
                <tr>
                  <th>Work Period:</th>
                  <td>
                    {moment(period.start).format("MM/DD")}&nbsp;-&nbsp;
                    {moment(period.end).format("MM/DD")}
                  </td>
                </tr>
                <tr>
                  <th>Resource Booking:</th>
                  <td>{period.userHandle}</td>
                </tr>
                <tr>
                  <th>Job Name:</th>
                  <td>
                    <JobName className={styles.jobName} jobId={period.jobId} />
                  </td>
                </tr>
                <tr>
                  <th>Team Name:</th>
                  <td>
                    <ProjectName
                      className={styles.teamName}
                      projectId={period.projectId}
                    />
                  </td>
                </tr>
                <tr>
                  <th>Current BA(s) used:</th>
                  <td className={styles.accountIds}>
                    {Object.keys(accountIdsHash).join(", ") || "-"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <form className={styles.form} onSubmit={preventDefault} action="#">
            <SelectField
              className={cn(styles.accountsSelect, {
                [styles.accountsError]: billingAccountsError,
              })}
              id={`upd_bil_acc_${period.id}`}
              isDisabled={billingAccountsDisabled}
              label="New Billing Account"
              labelClassName={styles.accountsSelectLabel}
              size="medium"
              onChange={setBillingAccountId}
              options={billingAccounts}
              value={billingAccountId}
            />
          </form>
        </>
      )}
    </Modal>
  );
};

PaymentModalUpdateBA.propTypes = {
  payments: PT.arrayOf(
    PT.shape({
      id: PT.oneOfType([PT.number, PT.string]).isRequired,
      billingAccountId: PT.number.isRequired,
    })
  ).isRequired,
  period: PT.shape({
    id: PT.string.isRequired,
    jobId: PT.oneOfType([PT.number, PT.string]).isRequired,
    projectId: PT.oneOfType([PT.number, PT.string]).isRequired,
    billingAccountId: PT.number,
    userHandle: PT.string.isRequired,
    start: PT.oneOfType([PT.number, PT.string]).isRequired,
    end: PT.oneOfType([PT.number, PT.string]).isRequired,
  }).isRequired,
  removeModal: PT.func.isRequired,
};

export default PaymentModalUpdateBA;
