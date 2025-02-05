export const userLogin = async (
  id: string,
  password: string,
): Promise<string> => {
  try {
    const response = await fetch("http://localhost:3000/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: id, password: password }),
    });

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
