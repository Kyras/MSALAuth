import {graphConfig} from "./authConfig";

/**
 * Attaches a given access token to a Microsoft Graph API call. Returns information about the user
 * @param accessToken
 * @param version
 * @param optionalUri
 * @param format
 */
export async function callMsGraph(accessToken, version = "v1.0", optionalUri = undefined, format = 'JSON') {
    let callEndpoint = graphConfig.graphMeEndpoint.replace("{version}", version)
    if (optionalUri != null) {
        callEndpoint += optionalUri
    }
    console.log("Calling graph endpoint: ", callEndpoint)
    const headers = new Headers();
    const bearer = `Bearer ${accessToken}`;

    headers.append("Authorization", bearer);

    const options = {
        method: "GET",
        headers: headers
    };

    return fetch(callEndpoint, options)
        .then(response => {
            switch (format) {
                case "JSON":
                    response = response.json()
                    return response
                case "BLOB":
                    response = response.blob()
                    return response
                default:
                    throw new RangeError(`Unknown format ${format}`)
            }
        })
        .catch(error => console.log(error));
}