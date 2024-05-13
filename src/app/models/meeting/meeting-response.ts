import { ProjectResponse } from '../project/project-response';

export interface MeetingResponse {
  id: number;
  date: Date;
  title: string;
  project: ProjectResponse;
}
