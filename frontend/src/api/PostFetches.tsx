import axios from "axios";
import { AxiosError } from "axios";
import { CreateReservationTypes } from "../types/Types";

const createReservation = async (
  reservationData: CreateReservationTypes,
  idToken: string | null
) => {
  try {
    const response = await axios.post(
      "http://localhost:3000/reservations/create",
      reservationData,
      {
        headers: {
          Authorization: idToken ? `Bearer ${idToken}` : "",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error creating reservation:",
      (error as AxiosError).response
        ? (error as AxiosError).response?.data
        : (error as Error).message
    );
    throw error;
  }
};

const cancelReservation = async (
  reservationId: number | null,
  idToken: string | null
) => {
  try {
    const response = await axios.put(
      `http://localhost:3000/reservations/cancel/${reservationId}`,
      {},
      {
        headers: {
          Authorization: idToken ? `Bearer ${idToken}` : "",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error cancelling reservation:",
      (error as AxiosError).response
        ? (error as AxiosError).response?.data
        : (error as Error).message
    );
    throw error;
  }
};

export { createReservation, cancelReservation };