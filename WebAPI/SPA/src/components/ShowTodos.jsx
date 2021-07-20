import React, {useState} from "react"
import {useMsal} from "@azure/msal-react";
import {loginRequest, protectedResources} from "../authConfig";
import {Button, Container, Spinner} from "react-bootstrap";
import {getMyTodos} from "../todos";

export const ShowTodos = () => {
    const {instance, accounts} = useMsal();
    const [todos, setTodos] = useState({
        data: [],
        isLoading: false,
    });

    function loadTodos() {
        instance.acquireTokenSilent({
            ...protectedResources.todoListApi.request,
            account: accounts[0]
        }).then((response) => {
            getMyTodos(response.accessToken)
                .then(response => {
                    console.log("Got todos response: ", response)
                    setTodos({
                        data: response || [],
                        isLoading: false,
                    })
                })
                .catch(error => {
                    console.error("Failed calling todos", error);
                    setTodos({
                        data: [],
                        isLoading: false,
                    })
                })
        })
    }

    function switchLoading() {
        console.log('Swapping loading')
        setTodos({
            data: todos.data,
            isLoading: !todos.isLoading,
        })
    }

    function formatTodo(todo) {
        return (
            <>
                <tr>
                    <td>{todo.id}</td>
                    <td>{todo.description}</td>
                    <td>{todo.owner}</td>
                    <td>{todo.done ? "finished" : "unfinished"}</td>
                </tr>
            </>
        )
    }

    return (
        <>
            <h1>Your Todos</h1>
            <Container>
                {
                    todos.isLoading
                        ? <Button variant="primary" onClick={switchLoading}>
                            <Spinner
                                as="span"
                                animation="grow"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                            />
                            Loading...
                        </Button>
                        : <Button variant="primary" onClick={loadTodos}>Load</Button>
                }
            </Container>
            <Container className="table-responsive">
                <table className="align-items-center table">
                    <thead>
                    <tr>
                        <th>Id</th>
                        <th>Description</th>
                        <th>Owner</th>
                        <th>IsDone</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        todos.data.map(formatTodo)
                    }
                    </tbody>
                </table>
            </Container>
        </>
    )
}