import API from "./api";

export async function registerUser(formData) {
  try {
    const res = await API.post("/auth/register", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (err) {
    return { error: true, msg: err?.response?.data?.msg || err.message };
  }
}

export async function loginUser(credentials) {
  try {
    const res = await API.post("/auth/login", credentials);
    return res.data;
  } catch (err) {
    return { error: true, msg: err?.response?.data?.msg || err.message };
  }
}
