import { UserRole } from './user-role';

export interface UserResponse {
  id: number;
  fullName: string;
  username: string;
  role: UserRole;
}
