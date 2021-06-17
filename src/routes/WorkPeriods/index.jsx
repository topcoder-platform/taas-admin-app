import React from "react";
import withAuthentication from "hoc/withAuthentication";
import Sidebar from "components/Sidebar";
import Content from "components/Content";
import ContentBlock from "components/ContentBlock";
import Page from "components/Page";
import PeriodsContentHeader from "./components/PeriodsContentHeader";
import PeriodFilters from "./components/PeriodFilters";
import Periods from "./components/Periods";
import PeriodCount from "./components/PeriodCount";
import PeriodsPagination from "./components/PeriodsPagination";
import PeriodsSelectionMessage from "./components/PeriodsSelectionMessage";
import PeriodWeekPicker from "./components/PeriodWeekPicker";
import { ADMIN_ROLES } from "../../constants";
import styles from "./styles.module.scss";

/**
 * Displays route component for Working Days' route.
 *
 * @returns {JSX.Element}
 */
const WorkPeriods = () => (
  <Page className={styles.container}>
    <Sidebar>
      <PeriodFilters />
    </Sidebar>
    <Content>
      <PeriodsContentHeader />
      <ContentBlock className={styles.periodsBlock}>
        <div className={styles.periodsHeader}>
          <PeriodCount className={styles.periodCount} />
          <PeriodWeekPicker className={styles.periodWeekPicker} />
          <PeriodsPagination
            className={styles.periodsPagination}
            id="periods-pagination-top"
          />
        </div>
        <PeriodsSelectionMessage />
        <Periods />
        <div className={styles.periodsFooter}>
          <PeriodsPagination
            className={styles.periodPagination}
            id="periods-pagination-bottom"
          />
        </div>
      </ContentBlock>
    </Content>
  </Page>
);

export default withAuthentication(WorkPeriods, ADMIN_ROLES);
