import Swal from "sweetalert2";
import apiClient from "@/services/AxiosClient.js";
import GStore from "@/store";

export default {
  login(user) {
    return apiClient
      .post("/auth/", user)
      .then((response) => {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        GStore.currentUser = response.data.user;
        return Promise.resolve(response.data);
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error.response.data.message,
        });
        return Promise.reject(error);
      });
  },
  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    GStore.currentUser = null;
  },
  register(user) {
    return apiClient
      .post("/auth/register", user)
      .then((response) => {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: response.data.message,
        });
        return Promise.resolve(response.data);
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error.response.data.message,
        });
        return Promise.reject(error);
      });
  },
};
