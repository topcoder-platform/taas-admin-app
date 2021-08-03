import React, { useCallback, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import debounce from "lodash/debounce";
import omit from "lodash/omit";
import withAuthentication from "hoc/withAuthentication";
import {
  setFilter,
  setIsModalOpen,
  setModalError,
  setModalRole,
} from "store/actions/roles";
import { createRole, deleteRole, updateRole } from "store/thunks/roles";
import {
  getRolesIsModalOpen,
  getRolesIsModalLoading,
  getRolesModalRole,
} from "store/selectors/roles";
import Content from "components/Content";
import ContentBlock from "components/ContentBlock";
import ContentHeader from "components/ContentHeader";
import Page from "components/Page";
import PageTitle from "components/PageTitle";
import Sidebar from "components/Sidebar";
import Button from "components/Button";
import Modal from "components/Modal";
import RoleList from "./components/RoleList";
import RoleForm from "./components/RoleForm";
import Spinner from "components/Spinner";
import styles from "./styles.module.scss";
import modalStyles from "components/Modal/styles.module.scss";

/**
 * Displays route component for Roles' route.
 *
 * @returns {JSX.Element}
 */
const Roles = () => {
  const dispatch = useDispatch();
  const isModalOpen = useSelector(getRolesIsModalOpen);
  const isModalLoading = useSelector(getRolesIsModalLoading);
  const [modalOperationType, setModalOperationType] = useState("CREATE");
  const modalRole = useSelector(getRolesModalRole);
  const onFilterChange = useCallback(
    debounce(
      (filter) => {
        dispatch(setFilter(filter));
      },
      300,
      { leading: false }
    ),
    [dispatch]
  );

  const onCreateClick = useCallback(() => {
    setModalOperationType("CREATE");
    dispatch(setModalError(null));
    // role template with initial values
    dispatch(
      setModalRole({
        listOfSkills: [],
        rates: [],
        numberOfMembers: 0,
        numberOfMembersAvailable: 0,
        timeToCandidate: 0,
        timeToInterview: 0,
      })
    );
    dispatch(setIsModalOpen(true));
  }, [dispatch]);

  const onEditClick = useCallback(
    (role) => {
      setModalOperationType("EDIT");
      dispatch(setModalError(null));
      dispatch(setModalRole(role));
      dispatch(setIsModalOpen(true));
    },
    [dispatch]
  );

  const onDeleteClick = useCallback(
    (role) => {
      setModalOperationType("DELETE");
      dispatch(setModalError(null));
      dispatch(setModalRole(role));
      dispatch(setIsModalOpen(true));
    },
    [dispatch]
  );

  const onModalApproveClick = useCallback(() => {
    if (modalOperationType === "DELETE") {
      dispatch(deleteRole(modalRole.id));
    } else if (modalOperationType === "EDIT") {
      dispatch(
        updateRole(
          modalRole.id,
          omit(modalRole, [
            "id",
            "createdBy",
            "updatedBy",
            "createdAt",
            "updatedAt",
          ])
        )
      );
    } else {
      dispatch(createRole(modalRole));
    }
  }, [dispatch, modalOperationType, modalRole]);

  const onModalDismissClick = useCallback(() => {
    if (!isModalLoading) {
      dispatch(setIsModalOpen(false));
    }
  }, [dispatch, isModalLoading]);

  const modalTitle = useMemo(() => {
    if (modalOperationType === "DELETE") {
      return "Confirm Deletion";
    } else if (modalOperationType === "CREATE") {
      return "Create New Role";
    } else {
      return "Edit Role";
    }
  }, [modalOperationType]);

  const modalButtonApproveTxt = useMemo(() => {
    if (modalOperationType === "DELETE") {
      return isModalLoading ? (
        <div className={styles["spinner-container"]}>
          <Spinner width={25} className={styles.spinner} /> Deleting...
        </div>
      ) : (
        "Delete"
      );
    } else if (modalOperationType === "CREATE") {
      return isModalLoading ? (
        <div className={styles["spinner-container"]}>
          <Spinner width={25} className={styles.spinner} /> Creating...
        </div>
      ) : (
        "Create"
      );
    } else {
      return isModalLoading ? (
        <div className={styles["spinner-container"]}>
          <Spinner width={25} className={styles.spinner} /> Saving...
        </div>
      ) : (
        "Save"
      );
    }
  }, [isModalLoading, modalOperationType]);

  const modalButtonApproveColor = useMemo(() => {
    if (modalOperationType === "DELETE") {
      return "warning";
    } else {
      return "primary";
    }
  }, [modalOperationType]);

  return (
    <Page>
      <Sidebar></Sidebar>
      <Content>
        <ContentHeader>
          <PageTitle text="Roles" />
        </ContentHeader>
        <ContentBlock>
          <div className={styles.page}>
            <div className={styles.header}>
              <input
                className={styles.input}
                type="text"
                placeholder="Find a role..."
                onChange={(event) => onFilterChange(event.target.value)}
              />
              <Button variant="contained" onClick={onCreateClick}>
                Create New Role
              </Button>
            </div>
            <RoleList onEditClick={onEditClick} onDeleteClick={onDeleteClick} />
            <Modal
              controls={
                <div className={modalStyles.controls}>
                  <Button
                    className={modalStyles.button}
                    color={modalButtonApproveColor}
                    variant="contained"
                    onClick={onModalApproveClick}
                    isDisabled={isModalLoading}
                  >
                    {modalButtonApproveTxt}
                  </Button>
                  <Button
                    className={modalStyles.button}
                    onClick={onModalDismissClick}
                  >
                    Cancel
                  </Button>
                </div>
              }
              title={modalTitle}
              isOpen={isModalOpen}
              onDismiss={onModalDismissClick}
            >
              {modalOperationType === "DELETE" && (
                <p>
                  Are you sure you want to delete the{" "}
                  <strong>{modalRole.name}</strong> role?
                </p>
              )}
              {(modalOperationType === "EDIT" ||
                modalOperationType === "CREATE") && <RoleForm />}
            </Modal>
          </div>
        </ContentBlock>
      </Content>
    </Page>
  );
};

export default withAuthentication(Roles);
