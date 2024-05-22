import { RecentMeeting } from 'app/models';

export interface ProjectResponse {
  id: number;
  key: string;
  title: string;
  usersAvailable?: number;
  isDeleted?: boolean;
}
