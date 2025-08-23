import axiosInstance from "./axiosInstance";

interface CalendarEvent {
  id: number;
  title: string;
  start: string; // ISO 8601 format
  end: string; // ISO 8601 format
}

export function getEvents() {
  return axiosInstance
    .get("/schedule")
    .then((response) => {
      const data = response.data;
      return Promise.resolve(data);
    })
    .catch((e) => {
      return Promise.reject(e);
    });
}

export function postEvent(event: CalendarEvent) {
  return axiosInstance
    .post("/schedule", event)
    .then((response) => {
      return Promise.resolve(response.data);
    })
    .catch((e) => {
      return Promise.reject(e);
    });
}
