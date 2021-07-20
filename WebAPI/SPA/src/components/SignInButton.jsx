import React from "react";
import {useMsal} from "@azure/msal-react";
import {loginRequest} from "../authConfig";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/esm/Dropdown";

/**
 * Renders a drop down button with child buttons for logging in with a popup or redirect
 */
export const SignInButton = () => {
    const {instance} = useMsal();

    const handleLogin = (loginType, role = "user") => {
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
    return (
        <DropdownButton variant="secondary" className="ml-auto" drop="left" title="Sign In">
            <Dropdown.Item as="button" onClick={() => handleLogin("popup")}>Sign in using Popup</Dropdown.Item>
            <Dropdown.Item as="button" onClick={() => handleLogin("popup", "admin")}>Sign in using Popup (Admin)</Dropdown.Item>
            <Dropdown.Item as="button" onClick={() => handleLogin("redirect")}>Sign in using Redirect</Dropdown.Item>
            <Dropdown.Item as="button" onClick={() => handleLogin("redirect", "admin")}>Sign in using Redirect (Admin)</Dropdown.Item>
        </DropdownButton>
    )
}