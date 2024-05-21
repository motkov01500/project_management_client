import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdministratorRoutingModule } from './administrator-routing.module';
import { AppCommonModule } from '../app-common/app-common.module';
import { MainComponent } from './components/main/main.component';
import { UserListComponent } from './components/user/user-list/user-list.component';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { UserCreateComponent } from './components/user/user-create/user-create.component';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { SidebarModule } from 'primeng/sidebar';
import { ProjectListComponent } from './components/project/project-list/project-list.component';
import { ProjectCreateComponent } from './components/project/project-create/project-create.component';
import { TaskListComponent } from './components/task/task-list/task-list.component';
import { TaskCreateComponent } from './components/task/task-create/task-create.component';
import { MeetingListComponent } from './components/meeting/meeting-list/meeting-list.component';
import { MeetingCreateComponent } from './components/meeting/meeting-create/meeting-create.component';
import { CalendarModule } from 'primeng/calendar';

@NgModule({
  declarations: [
    MainComponent,
    UserListComponent,
    UserCreateComponent,
    ProjectListComponent,
    ProjectCreateComponent,
    TaskListComponent,
    TaskCreateComponent,
    MeetingListComponent,
    MeetingCreateComponent,
  ],
  imports: [
    CommonModule,
    AdministratorRoutingModule,
    AppCommonModule,
    TableModule,
    ButtonModule,
    FormsModule,
    InputTextModule,
    ConfirmDialogModule,
    DropdownModule,
    SidebarModule,
    ToastModule,
    CalendarModule,
  ],
  providers: [
    ConfirmationService,
    MessageService,
    { provide: 'LOCALE_ID', useValue: 'bg_BG' },
  ],
})
export class AdministratorModule {}
