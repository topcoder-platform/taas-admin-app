import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import ContentMessage from "components/ContentMessage";
import PeriodList from "../PeriodList";
import {
  getWorkPeriodsError,
  getWorkPeriodsIsLoading,
  getWorkPeriodsPagination,
  getWorkPeriodsSorting,
} from "store/selectors/workPeriods";
import { loadWorkPeriodsPage } from "store/thunks/workPeriods";
import { useUpdateEffect } from "utils/hooks";

/**
 * Displays working periods' list or a "Loading..." message or an error message.
 *
 * @returns {JSX.Element}
 */
const Periods = () => {
  const pagination = useSelector(getWorkPeriodsPagination);
  const sorting = useSelector(getWorkPeriodsSorting);
  const error = useSelector(getWorkPeriodsError);
  const isLoading = useSelector(getWorkPeriodsIsLoading);
  const dispatch = useDispatch();

  // Load working periods' first page once when page loads and then
  // only if page size or sorting changes.
  useEffect(() => {
    dispatch(loadWorkPeriodsPage(1));
  }, [dispatch, pagination.pageSize, sorting]);

  // Load working periods' new page if page number changes.
  useUpdateEffect(() => {
    dispatch(loadWorkPeriodsPage());
  }, [dispatch, pagination.pageNumber]);

  return (
    <>
      {!error && <PeriodList />}
      {isLoading && <ContentMessage>Loading...</ContentMessage>}
      {!isLoading && error && (
        <ContentMessage type="error">{error}</ContentMessage>
      )}
      {!isLoading && !error && !pagination.totalCount && (
        <ContentMessage>No resource bookings found.</ContentMessage>
      )}
    </>
  );
};

export default Periods;
