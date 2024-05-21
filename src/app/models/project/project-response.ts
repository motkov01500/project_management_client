import { RecentMeeting } from 'app/models';

export interface ProjectResponse {
  id: number;
  key: string;
  title: string;
  isUsersAvailable: boolean;
  remainingTasks?: number;
  mostRecentMeeting?: RecentMeeting;
}
