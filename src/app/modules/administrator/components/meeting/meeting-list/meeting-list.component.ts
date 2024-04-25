import { Component, OnInit } from '@angular/core';
import { MeetingResponse } from '../../../../../models/meeting/meeting-response';
import { MeetingsService } from '../../../../../services/meetings.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { MeetingEdit } from '../../../../../models/meeting/meeting-edit';
import { WebSocketService } from '../../../../../services/web-socket.service';

@Component({
  selector: 'app-meeting-list',
  templateUrl: './meeting-list.component.html',
  styleUrl: './meeting-list.component.css',
})
export class MeetingListComponent implements OnInit {
  items: MeetingResponse[] = [];
  visibleSidebar: boolean = false;
  meetingDetails: MeetingResponse | any;
  date: Date = new Date();
  statuses: string[] = ['UPCOMING', 'STARTED', 'END'];
  selectedStatus: string = '';

  constructor(
    private service: MeetingsService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private websocketService: WebSocketService
  ) {}

  ngOnInit(): void {
    this.service.getAll().subscribe({
      next: (meetings: MeetingResponse[]) => {
        this.items = meetings;
      },
    });
  }

  onEdit(meetingId: number) {
    this.visibleSidebar = true;
    this.service.getById(meetingId).subscribe({
      next: (meeting: MeetingResponse) => {
        this.meetingDetails = meeting;
      },
    });
  }

  onDelete(meetingId: number) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to proceed?',
      header: 'Confirmation',
      accept: () => {
        this.service.delete(meetingId).subscribe({});
        this.items = this.items.filter((item) => item.id != meetingId);
        this.messageService.add({
          severity: 'success',
          summary: 'Meeting Delete',
          detail: 'via admin',
        });
        this.websocketService.sendMessage(`Meeting is deleted`);
      },
      reject: () => {
        this.confirmationService.close();
      },
      key: 'positionDialog',
    });
  }

  onSubmit() {
    let updatedMeeting: MeetingEdit = {
      date: this.date,
      status: this.selectedStatus,
    };
    let itemIndex: number = this.items.findIndex(
      (item) => item.id == this.meetingDetails.id
    );
    this.service.editById(this.meetingDetails?.id, updatedMeeting).subscribe({
      next: (meeting: MeetingResponse) => {
        this.items[itemIndex] = meeting;
        this.messageService.add({
          severity: 'success',
          summary: 'Meeting Edit',
          detail: 'via admin',
        });
      },
    });
    this.visibleSidebar = false;
  }
}
