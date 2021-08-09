/**
 * Role List
 * Lists all available roles.
 * Allows filtering by name, editing & deleting roles.
 */
import React, { useState, useEffect } from "react";
import PT from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import {
  getRoles,
  getRolesError,
  getRolesFilter,
  getRolesIsLoading,
} from "store/selectors/roles";
import { loadRoles } from "store/thunks/roles";
import LoadingIndicator from "components/LoadingIndicator";
import ContentMessage from "components/ContentMessage";
import RoleItem from "../RoleItem";
import styles from "./styles.module.scss";

function RoleList({ onEditClick, onDeleteClick }) {
  const [filteredRoles, setFilteredRoles] = useState([]);
  const roles = useSelector(getRoles);
  const filter = useSelector(getRolesFilter);
  const error = useSelector(getRolesError);
  const isLoading = useSelector(getRolesIsLoading);
  const dispatch = useDispatch();

  // Load roles
  useEffect(() => {
    dispatch(loadRoles);
  }, [dispatch]);

  useEffect(() => {
    if (filter !== "") {
      setFilteredRoles(
        roles.filter((r) => r.name.toLowerCase().includes(filter.toLowerCase()))
      );
    } else {
      setFilteredRoles(roles);
    }
  }, [roles, filter]);

  return isLoading || error ? (
    <LoadingIndicator error={error} />
  ) : filteredRoles.length > 0 ? (
    <div className={styles.list}>
      {filteredRoles.map((role) => (
        <RoleItem
          key={role.id}
          id={role.id}
          name={role.name}
          imageUrl={role.imageUrl}
          onEditClick={() => onEditClick(role)}
          onDeleteClick={() => onDeleteClick(role)}
        />
      ))}
    </div>
  ) : (
    <ContentMessage>No role found.</ContentMessage>
  );
}

RoleList.propTypes = {
  onEditClick: PT.func,
  onDeleteClick: PT.func,
};

export default RoleList;
