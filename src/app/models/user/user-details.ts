import { UserRole } from './user-role';

export interface UserDetails {
  username: string;
  fullName: string;
  role: UserRole;
}
