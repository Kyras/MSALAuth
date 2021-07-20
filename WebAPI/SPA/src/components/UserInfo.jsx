import React, {useState} from "react";
import {loginRequest} from "../authConfig";
import {callMsGraph} from "../graph";
import {AuthenticatedTemplate, UnauthenticatedTemplate, useIsAuthenticated, useMsal} from "@azure/msal-react";
import {Nav, NavDropdown} from "react-bootstrap";

export const UserInfo = () => {
    const {instance, accounts} = useMsal()
    const [thumbnail, setThumbnail] = useState(null);

    if (useIsAuthenticated() && thumbnail == null) {
        RequestAccountThumbnail()
    }

    function RequestAccountThumbnail() {
        instance.acquireTokenSilent({
            ...loginRequest,
            account: accounts[0]
        }).then((response) => {
            callMsGraph(response.accessToken, 'beta', '/photos/48x48/$value', 'BLOB')
                .then(response => setThumbnail(URL.createObjectURL(response)))
                .catch(error => console.error(error))
        })
    }

    const handleLogout = (logoutType) => {
        if (logoutType === "popup") {
            instance.logoutPopup({
                postLogoutRedirectUri: "/",
                mainWindowRedirectUri: "/"
            });
        } else if (logoutType === "redirect") {
            instance.logoutRedirect({
                postLogoutRedirectUri: "/",
            });
        }
    }

    return (
        <>
            
            <Nav PullRight className="pull-right">
                <NavDropdown id="basic-nav-dropdown" title={<div className="pull-left">
                    <img 
                        className="img-thumbnail" 
                        src={thumbnail} 
                        alt="Thumbnail"/>
                    {accounts[0].name}
                </div>}>
                </NavDropdown>
            </Nav>
        </>
    )
}