import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import ContentHeader from "components/ContentHeader";
import Button from "components/Button";
import PageTitle from "components/PageTitle";
import {
  getWorkPeriodsHasSelectedItems,
  getWorkPeriodsIsProcessingPayments,
  getWorkPeriodsIsSelectedAll,
} from "store/selectors/workPeriods";
import { processPayments } from "store/thunks/workPeriods";
import styles from "./styles.module.scss";

const PeriodsContentHeader = () => {
  const hasSelectedItems = useSelector(getWorkPeriodsHasSelectedItems);
  const isProcessingPayments = useSelector(getWorkPeriodsIsProcessingPayments);
  const isSelectedAll = useSelector(getWorkPeriodsIsSelectedAll);
  const dispatch = useDispatch();

  const onProcessPaymentsClick = useCallback(() => {
    dispatch(processPayments);
  }, [dispatch]);

  return (
    <ContentHeader className={styles.container}>
      <PageTitle text="Working Periods" />
      <Button
        className={styles.button}
        variant="contained"
        isDisabled={
          isProcessingPayments || !(hasSelectedItems || isSelectedAll)
        }
        onClick={onProcessPaymentsClick}
      >
        Process Payment
      </Button>
    </ContentHeader>
  );
};

export default PeriodsContentHeader;
