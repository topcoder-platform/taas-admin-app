import React, { memo, useContext, useEffect } from "react";
import PT from "prop-types";
import cn from "classnames";
import { ProjectNameContext } from "components/ProjectNameContextProvider";
import styles from "./styles.module.scss";

const ProjectName = ({ className, projectId }) => {
  const [getName, fetchName] = useContext(ProjectNameContext);

  useEffect(() => {
    fetchName(projectId);
  }, [fetchName, projectId]);

  const projectName = getName(projectId) || projectId;

  return (
    <span className={cn(styles.container, className)} title={projectName}>
      {projectName}
    </span>
  );
};

ProjectName.propTypes = {
  className: PT.string,
  projectId: PT.number.isRequired,
};

export default memo(ProjectName);
