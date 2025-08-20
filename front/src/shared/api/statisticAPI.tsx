import axiosInstance from "./axiosInstance";

export function getRating() {
  return axiosInstance
    .get("/rating")
    .then((response) => {
      const data = response.data;
      return Promise.resolve(data);
    })
    .catch((e) => {
      return Promise.reject(e);
    });
}