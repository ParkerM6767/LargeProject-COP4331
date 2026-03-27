export async function login(payload: LoginForm) {
    try {
        const response = await fetch("http://localhost:8000/api/users/login", {
            method: "POST",
            credentials: "include",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(payload)
        });
    if (!response.ok) {
        throw new Error(`Error status: ${response.status}`);
    }

    return await response.json();

    } catch(error) {
        console.error("Login Failed:", error);
        throw error;
    }
}

export async function logout() {
    try {
        const response = await fetch("http://localhost:8000/api/users/logout", {
            method: "POST",
            credentials: "include",
        });
    if (!response.ok) {
        throw new Error(`Error status: ${response.status}`);
    }

    return await response.json();

    } catch(error) {
        console.error("Login Failed:", error);
        throw error;
    }
}

export async function signup(payload: SignupForm) {
    try {
        const response = await fetch("http://localhost:8000/api/users/createUser", {
            method: "POST",
            credentials: "include",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(payload),
        });
    if (!response.ok) {
        throw new Error(`Error status: ${response.status}`);
    }

    return await response.json();

    } catch(error) {
        console.error("Login Failed:", error);
        throw error;
    }
}