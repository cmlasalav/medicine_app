import axios from "axios";

const AuthURL = process.env.NEXT_PUBLIC_API_URL;

const instance = axios.create({
  baseURL: AuthURL,
  timeout: 10000,
});

// Get Treatment
export const GetTreatments = async () => {
  try {
    const res = await instance.get("/treatment", {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    return {
      error:
        error.response?.data?.message ||
        "Error al obtener datos de las medicinas",
    };
  }
};

//Post Treatment
export const PostTreatment = async (treatmentData) => {
  try {
    const res = await instance.post("/treatment", treatmentData, {
      withCredentials: true,
    });
    return {
      data: res.data,
      status: res.status,
    };
  } catch (error) {
    return {
      error:
        error.response?.data?.message ||
        "Error al almacenar los datos de la medicina",
      status:
        error.response?.status ||
        "Tu sesión expiró. Por favor, vuelve a iniciar sesión.",
    };
  }
};

//Put Treatment
export const PatchTreatment = async (treatmentData, editando) => {
  try {
    const res = await instance.patch(`/treatment/${editando}`, treatmentData, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    return {
      error:
        error.response?.data?.message ||
        "Error al actualizar los datos de la medicina",
      status:
        error.response?.status ||
        "Tu sesión expiró. Por favor, vuelve a iniciar sesión.",
    };
  }
};

//Delete Treatment
export const DeleteTreatment = async (treatmentId) => {
  try {
    const res = await instance.delete(`/treatment/${treatmentId}`, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    return {
      error:
        error.response?.data?.message ||
        "Error al eliminar los datos de la medicina",
      status:
        error.response?.status ||
        "Tu sesión expiró. Por favor, vuelve a iniciar sesión.",
    };
  }
};
