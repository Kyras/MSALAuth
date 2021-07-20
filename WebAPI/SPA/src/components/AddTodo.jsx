import React, {useState} from "react";
import {Container, Form, FormControl} from "react-bootstrap";
import {addNewTodo} from "../todos";
import {useMsal} from "@azure/msal-react";
import {protectedResources} from "../authConfig";

export const AddTodo = () => {
    const {instance, accounts} = useMsal()
    const [state, setState] = useState({
        Description: "",
        Done: false
    });

    function handleSubmit(e) {
        e.preventDefault()
        console.log("Submitting new todo: ", state)
        instance
            .acquireTokenSilent({
                ...protectedResources.todoListApi.request,
                account: accounts[0]
            })
            .then(response => addNewTodo(response.accessToken, state))
            .then(response => alert(`Created new todo: ${JSON.stringify(response)}`))
            .catch(error => {
                console.error("Failed calling todos", error);
            })
    }

    return (
        <>
            <h1>Create New Todo</h1>
            <Container>
                <Form onSubmit={e => handleSubmit(e)}>
                    <Form.Group className="mb-3">
                        <Form.Label>
                            Description
                        </Form.Label>
                        <FormControl type="text" name="description"
                                     onChange={e => setState({Description: e.target.value, Done: state.Done})}/>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>
                            Is Done
                        </Form.Label>
                        <FormControl type="checkbox" name="done" key="done"
                                     onChange={e => setState({Description: state.Description, Done: !state.Done})}/>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <FormControl type="submit" value="Submit"/>
                    </Form.Group>
                </Form>
            </Container>
        </>
    )
}