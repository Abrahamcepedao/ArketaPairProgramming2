export type ClassItem = {
  id: string;
  name: string;
  instructor: string;
  datetime: string;
  capacity: number;
  bookedUsers: number;
};

export type MockUser = {
  id: string;
  name: string;
};

export type Booking = {
  userId: string;
  classId: string;
};

export type ClassStatus = "past" | "booked" | "full" | "available";
