import axios from "axios";

const AuthURL = process.env.NEXT_PUBLIC_API_URL;

const instance = axios.create({
  baseURL: AuthURL,
  timeout: 10000,
});

//Get User Data
export const GetUserData = async () => {
  try {
    const res = await instance.get("/user", {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    return {
      error:
        error.response?.data?.message || "Error al obtener datos del usuario",
    };
  }
};
