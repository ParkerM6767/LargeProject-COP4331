export async function login(payload: LoginForm) {
  try {
    const response = await fetch(
      import.meta.env.VITE_API_BASE + "/api/users/login",
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );

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
    const response = await fetch(
      import.meta.env.VITE_API_BASE + "/api/users/logout",
      {
        method: "POST",
        credentials: "include",
      },
    );
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
    const response = await fetch(
      import.meta.env.VITE_API_BASE + "/api/users/createUser",
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );
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

export async function submitPost(payload: EventFormResponse) {
  try {
    const response = await fetch(import.meta.env.VITE_API_BASE + "/api/posts", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
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

export async function fetchPosts(
  search: string = "",
  page: number = 0,
  limit: number = 0,
): Promise<{ posts: Post[]; totalPosts: number }> {
  try {
    const url = new URL(import.meta.env.VITE_API_BASE + "/api/posts");
    url.searchParams.append("search", search);
    url.searchParams.append("page", page.toString());
    url.searchParams.append("limit", limit.toString());

    const response = await fetch(url, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`Error status: ${response.status}`);
    }
    const data = await response.json();
    return { posts: data.posts, totalPosts: data.count };
  } catch (error) {
    console.error("Fetch Posts failed:", error);
    throw error;
  }
}

export async function upvotePost(postId: string) {
  try {
    const response = await fetch(
      import.meta.env.VITE_API_BASE + `/api/posts/${postId}/upvote`,
      {
        method: "PUT",
        credentials: "include",
      },
    );
    if (!response.ok) {
      throw new Error(`Error status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Post upvote failed:", error);
    throw error;
  }
}

export async function downvotePost(postId: string) {
  try {
    const response = await fetch(
      import.meta.env.VITE_API_BASE + `/api/posts/${postId}/downvote`,
      {
        method: "PUT",
        credentials: "include",
      },
    );
    if (!response.ok) {
      throw new Error(`Error status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Post downvote failed:", error);
    throw error;
  }
}
