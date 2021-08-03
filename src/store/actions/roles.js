import * as ACTION_TYPE from "store/actionTypes/roles";

/**
 * Creates an action for setting roles.
 *
 * @returns {Object}
 */
export const setRoles = (payload) => ({
  type: ACTION_TYPE.SET_ROLES,
  payload,
});

/**
 * Creates an action denoting the creation of role.
 *
 * @param {Object} payload action payload
 * @returns {Object}
 */
export const createRole = (payload) => ({
  type: ACTION_TYPE.CREATE_ROLE,
  payload,
});

/**
 * Creates an action denoting the update of role.
 *
 * @param {string} roleId role id
 * @param {Object} payload action payload
 * @returns {Object}
 */
export const updateRole = (roleId, payload) => ({
  type: ACTION_TYPE.UPDATE_ROLE,
  roleId,
  payload,
});

/**
 * Creates an action denoting the deletion of role.
 *
 * @param {string} roleId role id
 * @returns {Object}
 */
export const deleteRole = (roleId) => ({
  type: ACTION_TYPE.DELETE_ROLE,
  roleId,
});

/**
 * Creates an action for setting filter.
 *
 * @param {boolean} payload payload
 * @returns {Object}
 */
export const setFilter = (payload) => ({
  type: ACTION_TYPE.SET_FILTER,
  payload,
});

/**
 * Creates an action for setting isLoading.
 *
 * @param {boolean} payload payload
 * @returns {Object}
 */
export const setIsLoading = (payload) => ({
  type: ACTION_TYPE.SET_IS_LOADING,
  payload,
});

/**
 * Creates an action for setting isModalLoading.
 *
 * @param {boolean} payload payload
 * @returns {Object}
 */
export const setIsModalLoading = (payload) => ({
  type: ACTION_TYPE.SET_IS_MODAL_LOADING,
  payload,
});

/**
 * Creates an action for setting isModalOpen.
 *
 * @param {boolean} payload payload
 * @returns {Object}
 */
export const setIsModalOpen = (payload) => ({
  type: ACTION_TYPE.SET_IS_MODAL_OPEN,
  payload,
});

/**
 * Creates an action for setting modalRole.
 *
 * @returns {Object}
 */
export const setModalRole = (payload) => ({
  type: ACTION_TYPE.SET_MODAL_ROLE,
  payload,
});

/**
 * Creates an action denoting the error with role actions.
 *
 * @param {Object} payload payload
 * @returns {Object}
 */
export const setError = (payload) => ({
  type: ACTION_TYPE.SET_ERROR,
  payload,
});

/**
 * Creates an action denoting the error with the modal operation.
 *
 * @param {Object} payload payload
 * @returns {Object}
 */
export const setModalError = (payload) => ({
  type: ACTION_TYPE.SET_MODAL_ERROR,
  payload,
});
