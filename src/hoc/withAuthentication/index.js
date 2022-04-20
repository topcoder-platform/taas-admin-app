/**
 * Authentication
 *
 * wrap component for authentication
 *
 * - checks if user is logged-in, and if not, then redirects to the login page
 *
 * Also, this component load important data for `hasPermission` method:
 * - decodes user token and set in Redux Store `authUser.userId, handle, roles`
 *   - we need to know user `roles` to check if user user has Topcoder Roles
 */
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import { decodeToken } from "tc-auth-lib";
import { getAuthUserTokens, login } from "@topcoder/mfe-header";
import LoadingIndicator from "components/LoadingIndicator";
import { authUserSuccess, authUserError } from "./actions";

export default function withAuthentication(Component, rolesRequired) {
  return function AuthenticatedComponent(props) {
    const dispatch = useDispatch();
    const { isLoggedIn, roles, authError } = useSelector(
      (state) => state.authUser
    );

    const hasRolesRequired =
      !rolesRequired || roles.some((role) => rolesRequired.includes(role));
    /*
      Check if user is logged-in or redirect ot the login page
    */
    useEffect(() => {
      // prevent page redirecting to login page when unmount
      let isUnmount = false;

      if (!isLoggedIn) {
        getAuthUserTokens()
          .then(({ tokenV3 }) => {
            if (tokenV3) {
              const tokenData = decodeToken(tokenV3);
              dispatch(
                authUserSuccess(
                  _.pick(tokenData, ["userId", "handle", "roles"])
                )
              );
            } else if (!isUnmount) {
              login();
            }
          })
          .catch((error) => dispatch(authUserError(error)));
      }

      return () => {
        isUnmount = true;
      };
    }, [isLoggedIn, dispatch]);

    return (
      <>
        {/* Show loading indicator until we know if user is logged-in or no.
            Also, show loading indicator if we need to know team members but haven't loaded them yet.
            or load v5 user profile but haven't loaded them yet.
            In we got error during this process, show error */}
        {isLoggedIn === null && <LoadingIndicator error={authError} />}
        {isLoggedIn === true && !hasRolesRequired && (
          <LoadingIndicator
            error={"You don't have permission to access this page"}
          />
        )}
        {/* Show component only if user is logged-in and has required permissions */}
        {isLoggedIn === true && hasRolesRequired && <Component {...props} />}
      </>
    );
  };
}
