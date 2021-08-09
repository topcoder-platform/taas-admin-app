import axios from "./axios";
import config from "../../config";

// skills cache
let skills;

/**
 * Returns the list of roles.
 *
 * @return {Promise<Array>} Array of roles
 */
export function getRoles() {
  return axios.get(`${config.API.V5}/taas-roles`);
}

/**
 * Creates a role.
 *
 * @param {Object} body role body
 * @return {Promise<Object>} Created role from the response
 */
export function createRole(body) {
  return axios.post(`${config.API.V5}/taas-roles`, body);
}

/**
 * Updates a role.
 *
 * @param {string} id Role ID
 * @param {Object} body role body
 * @return {Promise<Object>} Updated role from the response
 */
export function updateRole(id, body) {
  return axios.patch(`${config.API.V5}/taas-roles/${id}`, body);
}

/**
 * Deletes a role.
 *
 * @param {string} id Role ID
 * @return {Promise}
 */
export function deleteRole(id) {
  return axios.delete(`${config.API.V5}/taas-roles/${id}`);
}

/**
 * Search skills by name.
 *
 * @param {string} name skill name
 * @return {Promise<Object>} Role Object
 */
export async function searchSkills(name) {
  if (!skills) {
    skills = await getAllTopcoderSkills();
  }

  return {
    data: skills.filter((s) =>
      s.name.toLowerCase().includes(name.toLowerCase())
    ),
  };
}

/**
 * Retrieves all TC skills from the paginated endpoint.
 *
 * @returns {Promise<Array>} skills
 */
async function getAllTopcoderSkills() {
  let page = 1;
  const perPage = 100;
  const result = [];

  const firstPageResponse = await axios.get(
    `${config.API.V5}/taas-teams/skills`,
    {
      params: { page, perPage },
    }
  );
  result.push(...firstPageResponse.data);

  const total = firstPageResponse.headers["x-total"];
  while (page++ * perPage <= total) {
    const newPageResponse = await axios.get(
      `${config.API.V5}/taas-teams/skills`,
      {
        params: { page, perPage },
      }
    );
    result.push(...newPageResponse.data);
  }
  return result;
}
