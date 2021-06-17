import axios from "axios";
import get from "lodash/get";
import { getAuthUserTokens } from "@topcoder/micro-frontends-navbar-app";

export const CancelToken = axios.CancelToken;

const axiosInstance = axios.create({
  headers: { "Content-Type": "application/json" },
});

axiosInstance.interceptors.request.use(async (config) => {
  let tokenV3 = null;
  try {
    ({ tokenV3 } = await getAuthUserTokens());
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error.toString());
  }
  if (tokenV3) {
    config.headers.Authorization = `Bearer ${tokenV3}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (config) => config,
  (error) => {
    const message = get(error, "response.data.message");
    if (message) {
      error.message = message;
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
