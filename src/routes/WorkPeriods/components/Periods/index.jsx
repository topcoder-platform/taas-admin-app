import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { globalHistory } from "@reach/router";
import ContentMessage from "components/ContentMessage";
import PeriodList from "../PeriodList";
import {
  getWorkPeriodsError,
  getWorkPeriodsIsLoading,
  getWorkPeriodsPagination,
  getWorkPeriodsSorting,
} from "store/selectors/workPeriods";
import { updateStateFromQuery } from "store/actions/workPeriods";
import {
  loadWorkPeriodsPage,
  updateQueryFromState,
} from "store/thunks/workPeriods";

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

  // Load working periods' page only if page number, page size or sorting changes.
  useEffect(() => {
    dispatch(loadWorkPeriodsPage);
  }, [dispatch, pagination.pageNumber, pagination.pageSize, sorting]);

  useEffect(() => {
    dispatch(updateQueryFromState(true));
    return globalHistory.listen(({ action, location }) => {
      if (action === "POP") {
        dispatch(updateStateFromQuery(location.search));
      }
    });
  }, [dispatch]);

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
