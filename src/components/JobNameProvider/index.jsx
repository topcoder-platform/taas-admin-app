import React, { createContext, useCallback, useState } from "react";
import PT from "prop-types";
import { fetchJob } from "services/workPeriods";
import { increment } from "utils/misc";
import {
  JOB_NAME_ERROR,
  JOB_NAME_LOADING,
  JOB_NAME_NONE,
} from "constants/workPeriods";

const names = {};
const errors = {};
const promises = {};

/**
 * Returns a tuple containing job name and possibly an error.
 *
 * @param {number|string} id job id
 * @returns {Array}
 */
const getName = (id) => (id ? [names[id], errors[id]] : [JOB_NAME_NONE, null]);

export const JobNameContext = createContext([
  getName,
  (id) => {
    `${id}`;
  },
]);

const JobNameProvider = ({ children }) => {
  const [, setCount] = useState(Number.MIN_SAFE_INTEGER);

  const fetchName = useCallback((id) => {
    if (!id || ((id in names || id in promises) && !(id in errors))) {
      return;
    }
    names[id] = JOB_NAME_LOADING;
    delete errors[id];
    setCount(increment);
    const [promise] = fetchJob(id);
    promises[id] = promise
      .then((data) => {
        names[id] = data.title;
      })
      .catch((error) => {
        names[id] = JOB_NAME_ERROR;
        errors[id] = error;
      })
      .finally(() => {
        delete promises[id];
        setCount(increment);
      });
  }, []);

  return (
    <JobNameContext.Provider value={[getName, fetchName]}>
      {children}
    </JobNameContext.Provider>
  );
};

JobNameProvider.propTypes = {
  children: PT.node,
};

export default JobNameProvider;
