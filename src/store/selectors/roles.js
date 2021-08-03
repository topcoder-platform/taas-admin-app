/**
 * Returns roles state.
 *
 * @param {Object} state redux root state
 * @returns {Object}
 */
export const getRolesState = (state) => state.roles;

/**
 * Returns currently loaded roles.
 *
 * @param {Object} state redux root state
 * @returns {Array}
 */
export const getRoles = (state) => state.roles.list;

/**
 * Returns roles filter state.
 *
 * @param {Object} state redux root state
 * @returns {Object}
 */
export const getRolesFilter = (state) => state.roles.filter;

/**
 * Returns roles error state.
 *
 * @param {Object} state redux root state
 * @returns {Object}
 */
export const getRolesError = (state) => state.roles.error;

/**
 * Returns roles isLoading state.
 *
 * @param {Object} state redux root state
 * @returns {Object}
 */
export const getRolesIsLoading = (state) => state.roles.isLoading;

/**
 * Returns roles isModalOpen state.
 *
 * @param {Object} state redux root state
 * @returns {Object}
 */
export const getRolesIsModalOpen = (state) => state.roles.isModalOpen;

/**
 * Returns roles isModalLoading state.
 *
 * @param {Object} state redux root state
 * @returns {Object}
 */
export const getRolesIsModalLoading = (state) => state.roles.isModalLoading;

/**
 * Returns modalRole.
 *
 * @param {Object} state redux root state
 * @returns {Object}
 */
export const getRolesModalRole = (state) => state.roles.modalRole;

/**
 * Returns modalError.
 *
 * @param {Object} state redux root state
 * @returns {Object}
 */
export const getRolesModalError = (state) => state.roles.modalError;
