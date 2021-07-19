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

    const HandleLogin = (loginType) => {
        let promise = undefined;

        if (loginType === "popup") {
            promise = instance.loginPopup(loginRequest);
        } else if (loginType === "redirect") {
            promise = instance.loginRedirect(loginRequest);
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
                                <NavDropdown.Item onClick={() => HandleLogin("popup")}>LogIn (PopUp)</NavDropdown.Item>
                                <NavDropdown.Item onClick={() => HandleLogin("redirect")}>LogIn
                                    (Redirect)</NavDropdown.Item>
                            </NavDropdown>
                        </UnauthenticatedTemplate>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}