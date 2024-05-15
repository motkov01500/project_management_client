import { ProjectResponse } from '../project/project-response';

export interface TaskResponse {
  id: number;
  title: string;
  progress?: number;
  initialEstimation?: number;
  isUsersAvailable?: boolean;
  hoursSpent?: number;
  project?: ProjectResponse;
  taskStatus?: string;
}
