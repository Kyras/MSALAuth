import React, {useState} from "react";
import {AuthenticatedTemplate, UnauthenticatedTemplate, useMsal} from "@azure/msal-react";
import {loginRequest} from "./authConfig";
import {PageLayout} from "./components/PageLayout";
import {ProfileData} from "./components/ProfileData";
import {callMsGraph} from "./graph";
import Button from "react-bootstrap/Button";
import "./styles/App.css";
import {ShowTodos} from "./components/ShowTodos";
import {AddTodo} from "./components/AddTodo";

/**
 * Renders information about the signed-in user or a button to retrieve data about the user
 */
const ProfileContent = () => {
    const {instance, accounts} = useMsal();
    const [graphData, setGraphData] = useState({
        userInfo: null,
        userThumbnailPicture: null,
    });

    function RequestProfileData() {
        // Silently acquires an access token which is then attached to a request for MS Graph data
        instance.acquireTokenSilent({
            ...loginRequest,
            account: accounts[0]
        }).then((response) => {
            callMsGraph(response.accessToken).then(response => {
                console.log('Setting userInfo', response)
                setGraphData({
                    userInfo: response,
                    userThumbnailPicture: graphData.userThumbnailPicture
                })
            });
        });
    }

    function RequestProfileThumbnail() {
        instance.acquireTokenSilent({
            ...loginRequest,
            account: accounts[0]
        }).then((response) => {
            callMsGraph(response.accessToken, 'beta', '/photo/$value', 'BLOB').then(response => {
                console.log('Setting userThumbnailPicture', response)
                setGraphData({
                    userInfo: graphData.userInfo,
                    userThumbnailPicture: URL.createObjectURL(response),
                })
            })
        })
    }

    return (
        <>
            <h5 className="card-title">Welcome {accounts[0].name}</h5>
            {graphData.userInfo != null ?
                <ProfileData userInfo={graphData.userInfo}/>
                :
                <Button variant="secondary" onClick={RequestProfileData}>Request Profile Information</Button>
            }
        </>
    );
}

/**
 * If a user is authenticated the ProfileContent component above is rendered. Otherwise a message indicating a user is not authenticated is rendered.
 */
const MainContent = () => {
        return (
            <div className="App">
                <AuthenticatedTemplate>
                    <AddTodo/>
                    <ShowTodos todos={[{id: 0, description: "todo-task", owner: "you", done: true}]}/>
                    {/*<ProfileContent/>*/}
                </AuthenticatedTemplate>

                <UnauthenticatedTemplate>
                    <h5 className="card-title">Please sign-in to see your profile information.</h5>
                </UnauthenticatedTemplate>
            </div>
        );
    }
;

export default function App() {
    return (
        <PageLayout>
            <MainContent/>
        </PageLayout>
    );
}