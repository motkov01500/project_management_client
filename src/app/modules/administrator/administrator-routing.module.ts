import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import {
  UserProjectRelatedComponent,
  MyProfileComponent,
  UserMeetingRelatedComponent,
  UserTaskRelatedComponent,
} from '../app-common/components';
import {
  MainComponent,
  TaskListComponent,
  MeetingListComponent,
  MeetingCreateComponent,
  TaskCreateComponent,
  UserListComponent,
  UserCreateComponent,
  ProjectListComponent,
  ProjectCreateComponent,
} from './components';

const routes: Route[] = [
  {
    path: '',
    component: MainComponent,
    children: [
      { path: 'projects/users', component: UserProjectRelatedComponent },
      { path: 'projects/tasks', component: TaskListComponent },
      { path: 'projects/meetings', component: MeetingListComponent },
      { path: 'my-profile', component: MyProfileComponent },
      {
        path: 'projects/meetings/users',
        component: UserMeetingRelatedComponent,
      },
      { path: 'projects/meetings/create', component: MeetingCreateComponent },
      { path: 'projects/tasks/create', component: TaskCreateComponent },
      { path: 'projects/tasks/users', component: UserTaskRelatedComponent },
      {
        path: 'user',
        children: [
          { path: 'get-all', component: UserListComponent },
          { path: 'create', component: UserCreateComponent },
        ],
      },
      {
        path: 'project',
        children: [
          { path: 'get-all', component: ProjectListComponent },
          { path: 'create', component: ProjectCreateComponent },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdministratorRoutingModule {}
