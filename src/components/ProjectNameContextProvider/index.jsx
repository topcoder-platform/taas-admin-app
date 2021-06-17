import React, { createContext, useCallback, useState } from "react";
import PT from "prop-types";
import { fetchProject } from "services/workPeriods";
import { increment, noop } from "utils/misc";

const names = {};
const promises = {};

const getName = (id) => names[id];

export const ProjectNameContext = createContext([
  getName,
  (id) => {
    `${id}`;
  },
]);

const ProjectNameProvider = ({ children }) => {
  const [, setCount] = useState(Number.MIN_SAFE_INTEGER);

  const fetchName = useCallback((id) => {
    if (id in names || id in promises) {
      return;
    }
    promises[id] = fetchProject(id)
      .then((data) => {
        names[id] = data.name;
        setCount(increment);
      })
      .catch(noop)
      .finally(() => {
        delete promises[id];
      });
  }, []);

  return (
    <ProjectNameContext.Provider value={[getName, fetchName]}>
      {children}
    </ProjectNameContext.Provider>
  );
};

ProjectNameProvider.propTypes = {
  children: PT.node,
};

export default ProjectNameProvider;
