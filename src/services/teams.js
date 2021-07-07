import axios from "./axios";
import config from "../../config";

/**
 * Get member suggestions
 *
 * @param {string} fragment text for suggestions
 *
 * @returns {Promise}
 */
export const getMemberSuggestions = (fragment) => {
  return axios.get(`${config.API.V5}/taas-teams/members-suggest/${fragment}`);
};
