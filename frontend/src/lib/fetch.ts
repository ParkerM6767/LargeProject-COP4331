export async function login(payload: LoginForm) {
    try {
        const response = await fetch("http://localhost:8000/api/users/login", {
            method: "POST",
            credentials: "include",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!response.ok) {
            const err = new Error();
            (err as any).message = data.message;
            (err as any).status = response.status;
            throw err;
        }

        return data

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
        const data = await response.json();

        if (!response.ok) {
            const err = new Error(data.message || `Error status: ${response.status}`);
            (err as any).status = response.status;
            throw err;
        }

        return data
    } catch(error) {
        console.error("Signup Failed:", error);
        throw error;
    }
}

export async function submitPost(payload: FormData): Promise<EventFormResponse> {
    try {
        const response = await fetch("http://localhost:8000/api/posts", {
            method: "POST",
            credentials: "include",
            body: payload
        });

        const data = await response.json();

        if (!response.ok) {
            const err = new Error(data.message || `Error status: ${response.status}`);
            (err as any).status = response.status;
            throw err;
        }

        return data as EventFormResponse;

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

export async function verify( email: string | null, code: string | null) {
    try {
        const response = await fetch("http://localhost:8000/api/users/verify-email", {
            method: "POST",
            credentials: "include",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                email: email,
                code: code
            })
        });
        
        const data = await response.json();

        if (!response.ok) {
            const err = new Error(data.message || `Error status: ${response.status}`);
            (err as any).status = response.status;
            throw err;
        }

        return data

    } catch(error) {
        console.error("Verification failed:", error);
        throw error;
    }
}

export async function forgotPassword( email: string | null) {
    try {
        const response = await fetch("http://localhost:8000/api/users/forgot-password", {
            method: "POST",
            credentials: "include",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                email: email
            })
        });
        const data = await response.json();

        if (!response.ok) {
            const err = new Error(data.message || `Error status: ${response.status}`);
            (err as any).status = response.status;
            throw err;
        }

        return data

    } catch(error) {
        console.error("Reset failed:", error);
        throw error;
    }
}

export async function updatePassword( token: string | null, password: string | null) {
    try {
        const response = await fetch("http://localhost:8000/api/users/reset-password", {
            method: "PUT",
            credentials: "include",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                token: token,
                newPassword: password
            })
        });
        
        const data = await response.json();

        if (!response.ok) {
            const err = new Error(data.message || `Error status: ${response.status}`);
            (err as any).status = response.status;
            throw err;
        }

        return data

    } catch(error) {
        console.error("Update Password failed:", error);
        throw error;
    }
}