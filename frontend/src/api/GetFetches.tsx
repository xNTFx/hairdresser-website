const fetchServices = async () => {
  const response = await fetch("https://hairdresser-website-production.up.railway.app/services");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

const fetchEmployees = async () => {
  const response = await fetch("https://hairdresser-website-production.up.railway.app/employees");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

const fetchAvaiableHours = async (
  date: string | null,
  employeeId: number | undefined,
  serviceDuration: string
) => {
  if (employeeId === undefined) return;
  const response = await fetch(
    `https://hairdresser-website-production.up.railway.app/available_hours/employee/${employeeId}/reservation_date/${date}/duration/${serviceDuration}`
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

import axios, { AxiosError } from "axios";

const fetchActiveReservations = async (tokenId: string | null) => {
  try {
    const response = await axios.post(
      "https://hairdresser-website-production.up.railway.app/reservations/active",
      {},
      {
        headers: {
          Authorization: `Bearer ${tokenId}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching active reservations:",
      (error as AxiosError).response
        ? (error as AxiosError).response?.data
        : (error as Error).message
    );
    throw error;
  }
};

const fetchHistoryReservations = async (tokenId: string | null) => {
  try {
    const response = await axios.post(
      "https://hairdresser-website-production.up.railway.app/reservations/history",
      {},
      {
        headers: {
          Authorization: `Bearer ${tokenId}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching active reservations:",
      (error as AxiosError).response
        ? (error as AxiosError).response?.data
        : (error as Error).message
    );
    throw error;
  }
};

export {
  fetchServices,
  fetchEmployees,
  fetchAvaiableHours,
  fetchActiveReservations,
  fetchHistoryReservations,
};
