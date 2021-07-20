import {protectedResources} from "./authConfig";

export async function callApi(accessToken, endpoint, method, body = null) {
    console.log(`Calling ${endpoint} endpoint`)
    const headers = new Headers()
    const bearer = `Bearer ${accessToken}`;

    headers.append("Authorization", bearer)
    let options = {
        method,
        headers: headers,
    }

    if (body != null) {
        headers.append("Content-Type", "application/json")
        options.body = JSON.stringify(body)
    }
    return fetch(endpoint, options)
        .then(response => response.json())
}

export async function getMyTodos(accessToken) {
    return callApi(accessToken, protectedResources.todoListApi.endpoint, "GET")
}

export async function addNewTodo(accessToken, todo) {
    return callApi(accessToken, protectedResources.todoListApi.endpoint, "POST", todo)
}