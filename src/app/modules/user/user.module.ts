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
import { MyProfileComponent } from './components/my-profile/my-profile.component';
import { CardModule } from 'primeng/card';
import { ImageModule } from 'primeng/image';
import { FileUploadModule } from 'primeng/fileupload';
import { FormsModule } from '@angular/forms';
import { TaskComponent } from './components/task/task.component';
import { ToastModule } from 'primeng/toast';

@NgModule({
  declarations: [
    MainComponent,
    ProjectComponent,
    MeetingComponent,
    MyProfileComponent,
    TaskComponent,
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
  ],
})
export class UserModule {}
