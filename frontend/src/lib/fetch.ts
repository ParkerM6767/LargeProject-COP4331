import type { LoginForm, SignupForm } from "../types";

export async function login(payload: LoginForm) {
    try {
        const response = await fetch("/api/login.ts", {
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

export async function signup(payload: SignupForm) {
    try {
        const response = await fetch("/api/register.ts", {
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