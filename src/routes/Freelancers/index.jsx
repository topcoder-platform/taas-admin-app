import React from "react";
import withAuthentication from "hoc/withAuthentication";
import Content from "components/Content";
import ContentBlock from "components/ContentBlock";
import ContentHeader from "components/ContentHeader";
import Page from "components/Page";
import PageTitle from "components/PageTitle";
import Sidebar from "components/Sidebar";

/**
 * Displays route component for Freelancers' route.
 *
 * @returns {JSX.Element}
 */
const Freelancers = () => (
  <Page>
    <Sidebar></Sidebar>
    <Content>
      <ContentHeader>
        <PageTitle text="Freelancers" />
      </ContentHeader>
      <ContentBlock></ContentBlock>
    </Content>
  </Page>
);

export default withAuthentication(Freelancers);
