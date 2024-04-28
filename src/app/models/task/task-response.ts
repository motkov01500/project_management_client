import { ProjectResponse } from '../project/project-response';
import { TaskStatus } from '../task-status';

export interface TaskResponse {
  id: number;
  progress: number;
  initialEstimation: number;
  hoursSpent: number;
  project: ProjectResponse;
  taskStatus: TaskStatus;
}
