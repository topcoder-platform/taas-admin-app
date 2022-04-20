import React, { useLayoutEffect } from "react";
import { Provider } from "react-redux";
import { Router, Redirect } from "@reach/router";
import store from "store";
import {
  disableSidebarForRoute,
  setNotificationPlatform,
  PLATFORM,
} from "@topcoder/mfe-header";
import WorkPeriods from "routes/WorkPeriods";
import Freelancers from "routes/Freelancers";
import Roles from "routes/Roles";
import {
  APP_BASE_PATH,
  FREELANCERS_PATH,
  WORK_PERIODS_PATH,
  ROLES_PATH,
} from "./constants";
import "styles/global.scss";

export default function Root() {
  useLayoutEffect(() => {
    disableSidebarForRoute(`${APP_BASE_PATH}/*`);
    setNotificationPlatform(PLATFORM.TAAS);
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <Redirect from={APP_BASE_PATH} to={WORK_PERIODS_PATH} exact noThrow />
        <WorkPeriods path={WORK_PERIODS_PATH} />
        <Freelancers path={FREELANCERS_PATH} />
        <Roles path={ROLES_PATH} />
      </Router>
    </Provider>
  );
}
