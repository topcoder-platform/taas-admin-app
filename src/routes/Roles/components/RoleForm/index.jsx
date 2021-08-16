/**
 * Role Form
 * Form component for role creation & edit operations.
 */
import React, { useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import cn from "classnames";
import { getRolesModalRole, getRolesModalError } from "store/selectors/roles";
import { setModalRole, setModalError } from "store/actions/roles";
import { searchSkills } from "services/roles";
import { humanReadableTimeToHours } from "utils/misc";
import FallbackIcon from "../../../../assets/images/icon-role-fallback.svg";
import IconExclamationMark from "components/Icons/ExclamationMarkCircled";
import Popover from "components/Popover";
import Typeahead from "components/Typeahead";
import IntegerField from "components/IntegerField";
import IconArrowSmall from "components/Icons/ArrowSmall";
import styles from "./styles.module.scss";

function RoleForm() {
  const dispatch = useDispatch();
  const roleState = useSelector(getRolesModalRole);
  const modalError = useSelector(getRolesModalError);
  const [typeaheadInputValue, setTypeaheadInputValue] = useState("");
  const [expandedRateIdx, setExpandedRateIdx] = useState(null);
  const [error, setError] = useState(false);
  const onImgError = useCallback(() => setError(true), []);

  const onChange = useCallback(
    (changes) => {
      dispatch(setModalRole({ ...roleState, ...changes }));
      if ("imageUrl" in changes) {
        setError(false);
      }
    },
    [dispatch, roleState]
  );

  const toggleRate = useCallback(
    (index) => {
      if (expandedRateIdx === index) {
        // collapse
        setExpandedRateIdx(null);
      } else {
        // expand
        setExpandedRateIdx(index);
      }
    },
    [expandedRateIdx]
  );

  const addSkill = useCallback(
    (value) => {
      if (value && !roleState.listOfSkills.includes(value)) {
        dispatch(
          setModalRole({
            ...roleState,
            listOfSkills: [...roleState.listOfSkills, value],
          })
        );
        setTypeaheadInputValue("");
      }
    },
    [dispatch, roleState]
  );

  // add new rates with initial values
  const addRate = useCallback(() => {
    dispatch(
      setModalRole({
        ...roleState,
        rates: [
          ...roleState.rates,
          {
            global: 1000,
            inCountry: 1000,
            offShore: 1000,
            niche: 1000,
            rate30Niche: 1000,
            rate30Global: 1000,
            rate30InCountry: 1000,
            rate30OffShore: 1000,
            rate20Niche: 1000,
            rate20Global: 1000,
            rate20InCountry: 1000,
            rate20OffShore: 1000,
          },
        ],
      })
    );
  }, [dispatch, roleState]);

  const editRate = useCallback(
    (index, changes) => {
      dispatch(
        setModalRole({
          ...roleState,
          rates: [
            ...roleState.rates.slice(0, index),
            { ...roleState.rates[index], ...changes },
            ...roleState.rates.slice(index + 1),
          ],
        })
      );
    },
    [dispatch, roleState]
  );

  const deleteRate = useCallback(
    (index) => {
      dispatch(
        setModalRole({
          ...roleState,
          rates: [
            ...roleState.rates.slice(0, index),
            ...roleState.rates.slice(index + 1),
          ],
        })
      );
      setExpandedRateIdx(null);
    },
    [dispatch, roleState]
  );

  const removeSkill = useCallback(
    (value) => {
      dispatch(
        setModalRole({
          ...roleState,
          listOfSkills: roleState.listOfSkills.filter((s) => s !== value),
        })
      );
    },
    [dispatch, roleState]
  );

  return (
    <div className={styles.form}>
      <div className={styles.preview}>
        {roleState.imageUrl && !error ? (
          <img
            src={roleState.imageUrl}
            onError={onImgError}
            alt="Preview"
            className={styles["role-icon"]}
          />
        ) : (
          <FallbackIcon className={styles["role-icon"]} />
        )}
        Role Icon Preview
      </div>
      {modalError && (
        <div className={styles["modal-error"]}>
          {modalError}
          <button title="Dismiss" onClick={() => dispatch(setModalError(null))}>
            X
          </button>
        </div>
      )}
      <div className={styles["two-col"]}>
        <div className={styles.left}>
          <label>
            Role Name
            <input
              className={styles.input}
              type="text"
              placeholder="Role Name"
              value={roleState.name}
              onChange={(event) => onChange({ name: event.target.value })}
            />
          </label>
        </div>
        <div className={styles.right}>
          <label>
            Image URL
            <input
              className={styles.input}
              type="text"
              placeholder="Image URL"
              value={roleState.imageUrl}
              onChange={(event) => onChange({ imageUrl: event.target.value })}
            />
          </label>
        </div>
      </div>
      <label htmlFor="skills">
        Add Skills
        <Typeahead
          id="skills"
          name="skills"
          placeholder="Search skills..."
          enforceListOnlySelection={true}
          onChange={(val) => addSkill(val)}
          onInputChange={(val) => setTypeaheadInputValue(val)}
          minLengthForSuggestions={1} // retrieve suggestions with min. 1 characters. Useful for skills like "C"
          value={typeaheadInputValue}
          getSuggestions={searchSkills}
          targetProp="name"
        />
      </label>
      <div className={styles.skills}>
        {roleState.listOfSkills.length > 0 ? (
          roleState.listOfSkills.map((s, i) => (
            <button
              className={styles.skill}
              title="Remove"
              onClick={() => removeSkill(s)}
              key={i}
            >
              {s}
            </button>
          ))
        ) : (
          <p>No skills added.</p>
        )}
      </div>
      <div className={styles.table}>
        <div className={styles.cell}>
          <th># of Members</th>
          <IntegerField
            className={styles.number}
            name="numberOfMembers"
            minValue={1}
            readOnly={false}
            displayButtons={false}
            value={roleState.numberOfMembers}
            onInputChange={(val) => onChange({ numberOfMembers: val })}
          />
        </div>
        <div className={styles.cell}>
          <th># of Available Members</th>
          <IntegerField
            className={styles.number}
            name="numberOfMembersAvailable"
            minValue={1}
            readOnly={false}
            displayButtons={false}
            value={roleState.numberOfMembersAvailable}
            onInputChange={(val) => onChange({ numberOfMembersAvailable: val })}
          />
        </div>
        <div className={styles.cell}>
          <th>Time to Interview</th>
          <div className={styles["input-container"]}>
            {!!roleState.timeToInterview &&
              humanReadableTimeToHours(roleState.timeToInterview) === 0 && (
                <Popover
                  className={styles.popup}
                  stopClickPropagation={true}
                  content={
                    <>
                      Example values:
                      <ul>
                        <li>12 hours</li>
                        <li>3 days</li>
                        <li>2 weeks</li>
                        <li>2 weeks 3 days</li>
                        <li>1 month</li>
                        <li>...</li>
                      </ul>
                    </>
                  }
                  strategy="fixed"
                >
                  <IconExclamationMark className={styles.icon} />
                </Popover>
              )}
            <input
              className={cn(styles["text-input"], {
                error:
                  !!roleState.timeToInterview &&
                  humanReadableTimeToHours(roleState.timeToInterview) === 0,
              })}
              name="timeToInterview"
              value={roleState.timeToInterview}
              onChange={(event) =>
                onChange({
                  timeToInterview: event.target.value,
                })
              }
            />
          </div>
        </div>
        <div className={styles.cell}>
          <th>Time to Candidate</th>
          <div className={styles["input-container"]}>
            {!!roleState.timeToCandidate &&
              humanReadableTimeToHours(roleState.timeToCandidate) === 0 && (
                <Popover
                  className={styles.popup}
                  stopClickPropagation={true}
                  content={
                    <>
                      Example values:
                      <ul>
                        <li>12 hours</li>
                        <li>3 days</li>
                        <li>2 weeks</li>
                        <li>2 weeks 3 days</li>
                        <li>1 month</li>
                        <li>...</li>
                      </ul>
                    </>
                  }
                  strategy="fixed"
                >
                  <IconExclamationMark className={styles.icon} />
                </Popover>
              )}
            <input
              className={cn(styles["text-input"], {
                error:
                  !!roleState.timeToCandidate &&
                  humanReadableTimeToHours(roleState.timeToCandidate) === 0,
              })}
              name="timeToCandidate"
              value={roleState.timeToCandidate}
              onChange={(event) =>
                onChange({
                  timeToCandidate: event.target.value,
                })
              }
            />
          </div>
        </div>
      </div>
      <label htmlFor="">
        Rates
        <div className={styles.rates}>
          {roleState.rates.map((r, i) => (
            <>
              <button
                key={i}
                className={styles.rate}
                onClick={() => toggleRate(i)}
              >
                Rate {i + 1}
                <IconArrowSmall
                  className={styles.arrow}
                  direction={i === expandedRateIdx ? "up" : "down"}
                  isActive={false}
                />
              </button>
              {i === expandedRateIdx && (
                <div className={styles["rate-content"]}>
                  <div className={styles["col-group"]}>
                    <th>
                      <div>Global</div>
                      <div className={styles["time-unit"]}>/week</div>
                    </th>
                    <th>
                      <div>In Country</div>
                      <div className={styles["time-unit"]}>/week</div>
                    </th>
                    <th>
                      <div>Offshore</div>
                      <div className={styles["time-unit"]}>/week</div>
                    </th>
                    <th>
                      <div>Niche</div>
                      <div className={styles["time-unit"]}>/week</div>
                    </th>
                  </div>
                  <div className={styles["content-group"]}>
                    <IntegerField
                      className={cn(styles.number, styles.cell)}
                      name={`rate[${i}]-global-rate`}
                      value={roleState.rates[i].global}
                      minValue={1}
                      readOnly={false}
                      displayButtons={false}
                      onInputChange={(num) =>
                        editRate(i, { global: num || undefined })
                      }
                    />
                    <IntegerField
                      className={cn(styles.number, styles.cell)}
                      name={`rate[${i}]-inCountry-rate`}
                      value={roleState.rates[i].inCountry}
                      minValue={1}
                      readOnly={false}
                      displayButtons={false}
                      onInputChange={(num) =>
                        editRate(i, { inCountry: num || undefined })
                      }
                    />
                    <IntegerField
                      className={cn(styles.number, styles.cell)}
                      name={`rate[${i}]-offShore-rate`}
                      value={roleState.rates[i].offShore}
                      minValue={1}
                      readOnly={false}
                      displayButtons={false}
                      onInputChange={(num) =>
                        editRate(i, { offShore: num || undefined })
                      }
                    />
                    <IntegerField
                      className={cn(styles.number, styles.cell)}
                      name={`rate[${i}]-niche-rate`}
                      value={roleState.rates[i].niche}
                      minValue={1}
                      readOnly={false}
                      displayButtons={false}
                      onInputChange={(num) =>
                        editRate(i, { niche: num || undefined })
                      }
                    />
                  </div>
                  <th>Rate 30</th>
                  <div className={styles["content-group"]}>
                    <IntegerField
                      className={cn(styles.number, styles.cell)}
                      name={`rate[${i}]-rate30-global-rate`}
                      value={roleState.rates[i].rate30Global}
                      minValue={1}
                      readOnly={false}
                      displayButtons={false}
                      onInputChange={(num) =>
                        editRate(i, { rate30Global: num || undefined })
                      }
                    />
                    <IntegerField
                      className={cn(styles.number, styles.cell)}
                      name={`rate[${i}]-rate30-inCountry-rate`}
                      value={roleState.rates[i].rate30InCountry}
                      minValue={1}
                      readOnly={false}
                      displayButtons={false}
                      onInputChange={(num) =>
                        editRate(i, { rate30InCountry: num || undefined })
                      }
                    />
                    <IntegerField
                      className={cn(styles.number, styles.cell)}
                      name={`rate[${i}]-rate30-offShore-rate`}
                      value={roleState.rates[i].rate30OffShore}
                      minValue={1}
                      readOnly={false}
                      displayButtons={false}
                      onInputChange={(num) =>
                        editRate(i, { rate30OffShore: num || undefined })
                      }
                    />
                    <IntegerField
                      className={cn(styles.number, styles.cell)}
                      name={`rate[${i}]-rate30-niche-rate`}
                      value={roleState.rates[i].rate30Niche}
                      minValue={1}
                      readOnly={false}
                      displayButtons={false}
                      onInputChange={(num) =>
                        editRate(i, { rate30Niche: num || undefined })
                      }
                    />
                  </div>
                  <th>Rate 20</th>
                  <div className={styles["content-group"]}>
                    <IntegerField
                      className={cn(styles.number, styles.cell)}
                      name={`rate[${i}]-rate20-global-rate`}
                      value={roleState.rates[i].rate20Global}
                      minValue={1}
                      readOnly={false}
                      displayButtons={false}
                      onInputChange={(num) =>
                        editRate(i, { rate20Global: num || undefined })
                      }
                    />
                    <IntegerField
                      className={cn(styles.number, styles.cell)}
                      name={`rate[${i}]-rate20-inCountry-rate`}
                      value={roleState.rates[i].rate20InCountry}
                      minValue={1}
                      readOnly={false}
                      displayButtons={false}
                      onInputChange={(num) =>
                        editRate(i, { rate20InCountry: num || undefined })
                      }
                    />
                    <IntegerField
                      className={cn(styles.number, styles.cell)}
                      name={`rate[${i}]-rate20-offShore-rate`}
                      value={roleState.rates[i].rate20OffShore}
                      minValue={1}
                      readOnly={false}
                      displayButtons={false}
                      onInputChange={(num) =>
                        editRate(i, { rate20OffShore: num || undefined })
                      }
                    />
                    <IntegerField
                      className={cn(styles.number, styles.cell)}
                      name={`rate[${i}]-rate20-niche-rate`}
                      value={roleState.rates[i].rate20Niche}
                      minValue={1}
                      readOnly={false}
                      displayButtons={false}
                      onInputChange={(num) =>
                        editRate(i, { rate20Niche: num || undefined })
                      }
                    />
                  </div>
                  <button
                    className={cn(styles["link-button"], styles["hover-red"])}
                    onClick={() => deleteRate(i)}
                  >
                    Delete This Rate
                  </button>
                </div>
              )}
            </>
          ))}
          <button className={styles["link-button"]} onClick={addRate}>
            Add Rate
          </button>
        </div>
      </label>
      <label>
        Role Description
        <textarea
          placeholder="Description"
          value={roleState.description}
          onChange={(event) => onChange({ description: event.target.value })}
        ></textarea>
      </label>
    </div>
  );
}

export default RoleForm;
