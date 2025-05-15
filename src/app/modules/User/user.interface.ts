import { UserRole, UserStatus } from "@prisma/client";

export interface IUser {
  id: string;
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  profilePhoto?: string | null;
  address: string;
  role: UserRole;
  needPasswordChange: boolean;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
}