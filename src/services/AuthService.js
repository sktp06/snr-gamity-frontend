import apiClient from "@/services/AxiosClient.js";
import GStore from "@/store";
import Swal from "sweetalert2";

export default {
  login(user) {
    console.log(user);
    return apiClient
      .post("/auth/", user)
      .then((response) => {
        console.log(response);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        GStore.currentUser = response.data.user;
        Swal.fire("Success", "Logged in successfully!", "success");
        return Promise.resolve(response.data);
      })
      .catch((error) => {
        Swal.fire("Error", error.response.data.message, "error");
        return Promise.reject(error);
      });
  },
  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    GStore.currentUser = null;
    Swal.fire("Success", "Logged out successfully!", "success");
  },
  register(user) {
    return apiClient
      .post("/auth/register", user)
      .then((response) => {
        console.log(response);
        Swal.fire("Success", response.data.message, "success");
        return Promise.resolve(response.data);
      })
      .catch((error) => {
        Swal.fire("Error", error.response.data.message, "error");
        return Promise.reject(error);
      });
  },
};
