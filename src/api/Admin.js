import axios from "axios";

const AuthURL = process.env.NEXT_PUBLIC_API_URL;

const instance = axios.create({
  baseURL: AuthURL,
  timeout: 10000,
});

//Get Admin Data
export const GetAdminData = async () => {
  try {
    const res = await instance.get("/token/data", {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    return {
      error:
        error.response?.data?.message ||
        "Error al obtener datos de administrador",
    };
  }
};

//Get Admin Logs
export const GetAdminLogs = async () => {
  try {
    const res = await instance.get("/token/logs", {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    return {
      error:
        error.response?.data?.message ||
        "Error al obtener datos de administrador",
    };
  }
};

//Update Admin Data
export const UpdateData = async (_id, typeData, data) => {
  try {
    const res = await instance.put(`/token/${_id}?typeData=${typeData}`, data, {
      withCredentials: true,
    });
    return res.data;
  } catch (err) {
    return {
      error:
        err.response?.data?.message || "Error al editar datos de administrador",
    };
  }
};

//Delete Admin Data
export const DeleteAdminData = async (_id, typeData) => {
  // console.log("Deleting data:", _id, typeData);
  try {
    const res = await instance.delete(`/token/${_id}?typeData=${typeData}`, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    return {
      error:
        error.response?.data?.message ||
        "Error al eliminar datos de administrador",
    };
  }
};

//Post Services
export const PostService = async (serviceData) => {
  try {
    const res = await instance.post("/token", serviceData, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    return {
      error: error.response?.data?.message || "Error al crear servicio",
    };
  }
};
