import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppCommonModule } from '../app-common/app-common.module';
import { MainComponent } from './components/main/main.component';
import { UserRoutingModule } from './user-routing.module';
import { ProjectComponent } from './components/project/project.component';
import { MeetingComponent } from './components/meeting/meeting.component';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SidebarModule } from 'primeng/sidebar';
import { MyProfileComponent } from '../app-common/components/my-profile/my-profile.component';
import { CardModule } from 'primeng/card';
import { ImageModule } from 'primeng/image';
import { FileUploadModule } from 'primeng/fileupload';
import { FormsModule } from '@angular/forms';
import { TaskComponent } from './components/task/task.component';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { UserMeetingRelatedComponent } from '../app-common/components/user-meeting-related/user-meeting-related.component';
import { UserProjectRelatedComponent } from '../app-common/components/user-project-related/user-project-related.component';

@NgModule({
  declarations: [
    MainComponent,
    ProjectComponent,
    MeetingComponent,
    MyProfileComponent,
    TaskComponent,
    UserMeetingRelatedComponent,
    UserProjectRelatedComponent,
  ],
  imports: [
    CommonModule,
    AppCommonModule,
    UserRoutingModule,
    FormsModule,
    TableModule,
    ButtonModule,
    SidebarModule,
    CardModule,
    ImageModule,
    FileUploadModule,
    InputTextModule,
    ToastModule,
    TooltipModule,
  ],
})
export class UserModule {}
