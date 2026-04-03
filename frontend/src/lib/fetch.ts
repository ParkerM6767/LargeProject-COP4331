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

export async function submitPost(payload: EventForm) {
    try {
        const response = await fetch("http://localhost:8000/api/posts", {
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
        console.error("Post submission failed:", error);
        throw error;
    }
}

export async function fetchPosts(): Promise<Post[]> {
    try {
        const response = await fetch("http://localhost:8000/api/posts", {
            method: "GET",
            credentials: "include"
        });
    if (!response.ok) {
        throw new Error(`Error status: ${response.status}`);
    }
    const data = await response.json();
    return data.posts;

    } catch(error) {
        console.error("Fetch Posts failed:", error);
        throw error;
    }
}