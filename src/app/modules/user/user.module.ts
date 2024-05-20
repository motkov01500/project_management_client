import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SidebarModule } from 'primeng/sidebar';
import { CardModule } from 'primeng/card';
import { ImageModule } from 'primeng/image';
import { FileUploadModule } from 'primeng/fileupload';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import {
  MainComponent,
  MeetingComponent,
  ProjectComponent,
  TaskComponent,
} from '.';
import {
  MyProfileComponent,
  UserMeetingRelatedComponent,
  UserProjectRelatedComponent,
} from 'app/modules/app-common';
import { AppCommonModule } from '../app-common/app-common.module';
import { UserRoutingModule } from './user-routing.module';
import { CheckboxModule } from 'primeng/checkbox';

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
    DropdownModule,
    MultiSelectModule,
    CheckboxModule,
  ],
})
export class UserModule {}
