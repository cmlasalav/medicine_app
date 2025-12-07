import axios from "axios";

const AuthURL = process.env.NEXT_PUBLIC_API_URL;

const instance = axios.create({
  baseURL: AuthURL,
  timeout: 10000,
});

//Register
export const RegisterUser = async (userData) => {
  try {
    const res = await instance.post("/auth", userData);
    return res.data;
  } catch (error) {
    return {
      error: error.response?.data?.message || "Error al Registrarse",
    };
  }
};

//Login
export const LoginUser = async (userData) => {
  try {
    const res = await instance.post("auth/login", userData, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    // console.error("Error in LoginUser:", error);
    return {
      error: error.response?.data?.message || "Error al Iniciar Sesión",
    };
  }
};

//Logout
export const LogoutUser = async () => {
  try {
    const res = await instance.delete("/auth", {
      withCredentials: true,
    });
    if (res.status === 200) {
      return res.status;
    }
  } catch (error) {
    // console.error("Error signing out: ", error);
    return {
      error: error.response?.data?.message || "Error al Cerrar Sesión",
    };
  }
};

//User Type
export const UserType = async () => {
  try {
    const res = await instance.get("/token", {
      withCredentials: true,
    });
    return res.status === 200 ? res.data : null;
  } catch (error) {
    //console.error("Error in UserType:", error);
    return {
      error:
        error.response?.data?.message || "Error al obtener el tipo de usuario",
    };
  }
};
