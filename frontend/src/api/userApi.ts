export const userLogin = async (
  id: string,
  password: string,
): Promise<string> => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/users/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: id, password: password }),
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const token = await response.json();
    return token;
  } catch (error) {
    console.log("Login Error: ", error);
    throw error;
  }
};
