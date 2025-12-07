import axios from "axios";

const AuthURL = process.env.NEXT_PUBLIC_API_URL;

const instance = axios.create({
  baseURL: AuthURL,
  timeout: 10000,
});

//Get Medicines
export const GetMedicines = async () => {
  try {
    const res = await instance.get("/medicine", {
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

//Post Medicines
export const PostMedicines = async (medicineData) => {
  try {
    const res = await instance.post("/medicine", medicineData, {
      withCredentials: true,
    });
    return res.data;
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

//Put Medicines
export const PutMedicines = async (medicineData) => {
  try {
    const res = await instance.put(
      `/medicine/${medicineData._id}`,
      medicineData,
      {
        withCredentials: true,
      }
    );
    return res.data;
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
