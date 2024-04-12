import { ProjectResponse } from "../project/project-response";

export interface MeetingResponse {
    id:number;
    date : Date;
    status: string;
    project: ProjectResponse
}