import { UserRole } from './user-role';

export interface UserResponse {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  role: UserRole;
  imageUrl: any;
  isDeleted?: boolean;
}
