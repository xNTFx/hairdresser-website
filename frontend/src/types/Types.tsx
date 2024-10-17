interface ServiceTypes {
  id: number;
  name: string;
  duration: string;
  price: number;
}

interface EmployeesType {
  employeeId: number;
  firstName: string;
  lastName: string | undefined;
}

interface CreateReservationTypes {
  userId: string | null;
  reservationDate: string;
  serviceId?: number;
  employeeId?: number | undefined;
  startTime: string | undefined;
  endTime: string | undefined;
  service?: { id: number };
  employee?: { employeeId: number | undefined };
}

interface AvailableHoursTypes {
  id: number;
  employeeId: number;
  startTime: string;
  endTime: string;
}

export type {
  ServiceTypes,
  EmployeesType,
  CreateReservationTypes,
  AvailableHoursTypes,
};
