import { ProjectResponse } from '../project/project-response';

export interface TaskResponse {
  id: number;
  title: string;
  progress?: number;
  initialEstimation?: number;
  usersAvailable?: number;
  hoursSpent?: number;
  project?: ProjectResponse;
  taskStatus?: string;
}
