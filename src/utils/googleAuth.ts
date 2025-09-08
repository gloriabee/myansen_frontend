export async function handleGoogleLogin(credential: string, navigate: any) {
  try {
    const response = await fetch("http://localhost:8000/google-auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id_token: credential,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Google login failed");
    }

    const data = await response.json();
      
    localStorage.setItem("access_token", data.access_token);
    localStorage.setItem("user", JSON.stringify(data.user));
    window.dispatchEvent(new Event("userChanged"));
    navigate("/");
  } catch (err) {
    console.error("Google login failed", err);
  }
}
