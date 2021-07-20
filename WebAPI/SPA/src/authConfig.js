import {LogLevel} from "@azure/msal-browser";

/**
 * Configuration object to be passed to MSAL instance on creation.
 * For a full list of MSAL.js configuration parameters, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/configuration.md
 */
export const msalConfig = {
    auth: {
        clientId: "00e3e875-b5ba-4908-bc6e-f7b197a40846",
        authority: "https://login.microsoftonline.com/3ec34a84-5d02-452d-acda-5fd4e567ce38",
        redirectUri: "http://localhost:3000/"
    },
    cache: {
        cacheLocation: "sessionStorage", // This configures where your cache will be stored
        storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
    },
    system: {
        loggerOptions: {
            loggerCallback: (level, message, containsPii) => {
                if (containsPii) {
                    return;
                }
                switch (level) {
                    case LogLevel.Error:
                        console.error(message);
                        return;
                    case LogLevel.Info:
                        console.info(message);
                        return;
                    case LogLevel.Verbose:
                        console.debug(message);
                        return;
                    case LogLevel.Warning:
                        console.warn(message);
                        return;
                }
            }
        }
    }
};

export const protectedResources = {
    todoListApi: {
        request: {
            scopes: ["api://b77a69ed-4b4f-4664-96ca-9888ef2c0b1b/access_as_user"]
        },
        endpoint: "https://localhost:5001/api/Todo",
    },
    adminTodoListApi: {
        request: {
            scopes: ["api://b77a69ed-4b4f-4664-96ca-9888ef2c0b1b/access_as_admin", "api://b77a69ed-4b4f-4664-96ca-9888ef2c0b1b/access_as_user"]
        },
        endpoint: "https://localhost:5001/api/Todo",
    }
}

/**
 * Scopes you add here will be prompted for user consent during sign-in.
 * By default, MSAL.js will add OIDC scopes (openid, profile, email) to any login request.
 * For more information about OIDC scopes, visit:
 * https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-permissions-and-consent#openid-connect-scopes
 */
export const loginRequest = {
    adminLoginRequest: {
        scopes: [
            "User.Read",
            "api://b77a69ed-4b4f-4664-96ca-9888ef2c0b1b/access_as_user",
            "api://b77a69ed-4b4f-4664-96ca-9888ef2c0b1b/access_as_admin",
        ]
    },
    userLoginRequest: {
        scopes: [
            "User.Read",
            "api://b77a69ed-4b4f-4664-96ca-9888ef2c0b1b/access_as_user",
        ]
    }
};

/**
 * Add here the scopes to request when obtaining an access token for MS Graph API. For more information, see:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/resources-and-scopes.md
 */
export const graphConfig = {
    graphMeEndpoint: "https://graph.microsoft.com/{version}/me"
};