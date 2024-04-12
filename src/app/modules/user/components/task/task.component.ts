import { Component, OnInit } from '@angular/core';
import { TasksService } from '../../../../services/tasks.service';
import { TaskResponse } from '../../../../models/task/task-response';
import { TaskProgress } from '../../../../models/task/task-update-progress';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrl: './task.component.css',
})
export class TaskComponent implements OnInit {
  items: TaskResponse[] = [];
  newProgress: TaskProgress = {
    progress: 0,
  };
  currentTaskId: number = 0;
  visibleSidebar: boolean = false;

  constructor(private taskService: TasksService) {}

  ngOnInit(): void {
    this.taskService.getCurrentUserRelatedTasks().subscribe({
      next: (tasks: TaskResponse[]) => {
        this.items = tasks;
      },
    });
  }

  onUpdateProgress(taskId: number) {
    this.visibleSidebar = true;
    this.currentTaskId = taskId;
  }

  onSubmit() {
    let findIndex: number = this.items.findIndex(
      (item) => item.id == this.currentTaskId
    );
    this.taskService
      .updateProgress(this.currentTaskId, this.newProgress)
      .subscribe({
        next: (updateTask: TaskResponse) => {
          this.items[findIndex] = updateTask;
        },
      });
    this.visibleSidebar = false;
  }
}
