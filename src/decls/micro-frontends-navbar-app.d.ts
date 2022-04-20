declare module "@topcoder/mfe-header" {
  export const disableSidebarForRoute: (route: string) => void;
  export const getAuthUserProfile: () => Promise<any>;
  export const getAuthUserTokens: () => Promise<{
    tokenV2: string;
    tokenV3: string;
  }>;
  export const setAppMenu: (route: string, obj: Record<string, any>) => void;
  export const login: () => void;
  export const logout: () => void;
  export const setNotificationPlatform: (platform: string) => void
  export const PLATFORM: {[key: string]: string};
}
