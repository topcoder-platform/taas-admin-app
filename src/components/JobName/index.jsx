import React, { memo, useContext, useEffect } from "react";
import PT from "prop-types";
import cn from "classnames";
import { JobNameContext } from "components/JobNameProvider";
import { JOB_NAME_LOADING } from "constants/workPeriods";
import styles from "./styles.module.scss";

const JobName = ({ className, jobId }) => {
  const [getName, fetchName] = useContext(JobNameContext);
  const [jobName, error] = getName(jobId);

  useEffect(() => {
    fetchName(jobId);
  }, [fetchName, jobId]);

  return (
    <span
      className={cn(styles.container, { [styles.error]: !!error }, className)}
    >
      {jobName || JOB_NAME_LOADING}
    </span>
  );
};

JobName.propTypes = {
  className: PT.string,
  jobId: PT.oneOfType([PT.number, PT.string]).isRequired,
};

export default memo(JobName);
