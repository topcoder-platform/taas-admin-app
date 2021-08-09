import * as actions from "store/actions/roles";
import * as services from "services/roles";
import { extractResponseData } from "utils/misc";
import { makeToast } from "components/ToastrMessage";

/**
 * Thunk that loads the roles.
 *
 * @returns {Promise}
 */
export const loadRoles = async (dispatch) => {
  dispatch(actions.setIsLoading(true));
  dispatch(actions.setError(null));
  dispatch(actions.setRoles([]));
  try {
    // For parameter description see:
    // https://topcoder-platform.github.io/taas-apis/#/Roles/get_taas_roles
    const response = await services.getRoles();
    const roles = extractResponseData(response);
    dispatch(actions.setRoles(roles));
  } catch (error) {
    dispatch(actions.setError(error));
  } finally {
    dispatch(actions.setIsLoading(false));
  }
};

/**
 * Thunk that creates a role.
 *
 * @param {Object} body role body
 * @returns {Promise<void>}
 */
export const createRole = (body) => async (dispatch) => {
  dispatch(actions.setModalError(null));
  dispatch(actions.setIsModalLoading(true));
  try {
    const response = await services.createRole(body);
    const role = extractResponseData(response);
    dispatch(actions.createRole(role));
    dispatch(actions.setIsModalOpen(false));
    makeToast("Successfully created the role.", "success");
  } catch (error) {
    dispatch(
      actions.setModalError(`Failed to create the role.\n${error.toString()}`)
    );
  } finally {
    dispatch(actions.setIsModalLoading(false));
  }
};

/**
 * Thunk that updates a role.
 *
 * @param {string} roleId roleId
 * @param {Object} body role body
 * @returns {Promise<void>}
 */
export const updateRole = (roleId, body) => async (dispatch) => {
  dispatch(actions.setModalError(null));
  dispatch(actions.setIsModalLoading(true));
  try {
    const response = await services.updateRole(roleId, body);
    const role = extractResponseData(response);
    dispatch(actions.updateRole(roleId, role));
    dispatch(actions.setIsModalOpen(false));
    makeToast("Successfully updated the role.", "success");
  } catch (error) {
    dispatch(
      actions.setModalError(`Failed to update the role.\n${error.toString()}`)
    );
  } finally {
    dispatch(actions.setIsModalLoading(false));
  }
};

/**
 * Thunk that deletes a role.
 *
 * @param {string} roleId role id
 * @returns {Promise<void>}
 */
export const deleteRole = (roleId) => async (dispatch) => {
  dispatch(actions.setIsModalLoading(true));
  try {
    await services.deleteRole(roleId);
    dispatch(actions.deleteRole(roleId));
    makeToast("Successfully deleted the role.", "success");
  } catch (error) {
    makeToast(`Failed to delete the role.\n${error.toString()}`);
  } finally {
    dispatch(actions.setIsModalLoading(false));
    dispatch(actions.setIsModalOpen(false));
  }
};
