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
    if (!response.ok) {
      throw new Error(`Error status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
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
  } catch (error) {
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
    if (!response.ok) {
      throw new Error(`Error status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Login Failed:", error);
    throw error;
  }
}

export async function submitPost(payload: EventForm) {
  try {
    const response = await fetch(import.meta.env.VITE_API_BASE + "/api/posts", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw new Error(`Error status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Post submission failed:", error);
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
