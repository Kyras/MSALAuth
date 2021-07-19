import React, {useState} from "react";
import {loginRequest} from "../authConfig";
import {callMsGraph} from "../graph";
import {AuthenticatedTemplate, UnauthenticatedTemplate, useIsAuthenticated, useMsal} from "@azure/msal-react";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/esm/Dropdown";
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
            {/*<div className="UserActions">*/}
            {/*    <AuthenticatedTemplate>*/}
            {/*        <img className="img-thumbnail" src={thumbnail} alt="Avatar" width="64px" height="64px"/>*/}
            {/*        <DropdownButton variant="secondary" className="ml-auto" drop="down" title={accounts[0].name}>*/}
            {/*            <Dropdown.Item as="button" onClick={() => handleLogout('popup')}>Sign out using*/}
            {/*                Popup</Dropdown.Item>*/}
            {/*        </DropdownButton>*/}
            {/*    </AuthenticatedTemplate>*/}
            {/*</div>*/}
        </>
    )
}