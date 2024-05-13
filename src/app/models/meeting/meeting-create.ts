export interface MeetingCreate {
  date: Date;
  title: string;
  projectId: number | undefined;
}
