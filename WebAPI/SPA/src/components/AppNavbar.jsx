import Navbar from "react-bootstrap/Navbar";
import {
    Container,
    Image,
    Nav,
    NavDropdown,
} from "react-bootstrap";
import {AuthenticatedTemplate, UnauthenticatedTemplate, useIsAuthenticated, useMsal} from "@azure/msal-react";
import React, {useState} from "react";
import {loginRequest} from "../authConfig";
import {callMsGraph} from "../graph";
import Dropdown from "react-bootstrap/Dropdown";

export const AppNavbar = () => {
    const {instance, accounts} = useMsal()
    const [thumbnail, setThumbnail] = useState(null)

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

    const HandleLogin = (loginType, role = "user") => {
        let promise = undefined;
        let request = undefined;
        if (role === "user") {
            request = loginRequest.userLoginRequest
        } else if (role === "admin") {
            request = loginRequest.adminLoginRequest
        } else {
            throw new RangeError(`Expected user or admin role, got: ${role}`)
        }

        if (loginType === "popup") {
            promise = instance.loginPopup(request);
        } else if (loginType === "redirect") {
            promise = instance.loginRedirect(request);
        } else {
            throw new TypeError(`Unknown loginType ${loginType}`)
        }

        promise
            .then()
            .catch(e => {
                console.log(e);
            })
    }

    const HandleLogout = (logoutType) => {
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
        <Navbar bg="light" expand="lg">
            <Container>
                <Navbar.Brand href="#home">SPA Application</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                    <Nav className="justify-content-end">
                        <AuthenticatedTemplate>
                            <Image
                                src={thumbnail}
                                thumbnail
                            />
                            <NavDropdown title={accounts.length > 0 ? accounts[0].name : ""} id="basic-nav-dropdown"
                                         className="justify-content-end">
                                <NavDropdown.Item onClick={() => HandleLogout("popup")}>LogOut (PopUp)</NavDropdown.Item>
                                <NavDropdown.Item onClick={() => HandleLogout("redirect")}>LogOut
                                    (Redirect)</NavDropdown.Item>
                            </NavDropdown>
                        </AuthenticatedTemplate>

                        <UnauthenticatedTemplate>
                            <NavDropdown title="LogIn" id="basic-nav-dropdown" className="justify-content-end">
                                <Dropdown.Item as="button" onClick={() => HandleLogin("popup")}>Sign in using Popup</Dropdown.Item>
                                <Dropdown.Item as="button" onClick={() => HandleLogin("popup", "admin")}>Sign in using Popup (Admin)</Dropdown.Item>
                                <Dropdown.Item as="button" onClick={() => HandleLogin("redirect")}>Sign in using Redirect</Dropdown.Item>
                                <Dropdown.Item as="button" onClick={() => HandleLogin("redirect", "admin")}>Sign in using Redirect (Admin)</Dropdown.Item>
                            </NavDropdown>
                        </UnauthenticatedTemplate>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}