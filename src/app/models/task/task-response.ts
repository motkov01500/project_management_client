import { ProjectResponse } from '../project/project-response';

export interface TaskResponse {
  id: number;
  progress: number;
  status: string;
  initialEstimation: number;
  hoursSpent: number;
  project: ProjectResponse;
}
