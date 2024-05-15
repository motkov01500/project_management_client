import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { MainComponent } from './components/main/main.component';
import { UserListComponent } from './components/user/user-list/user-list.component';
import { UserCreateComponent } from './components/user/user-create/user-create.component';
import { ProjectListComponent } from './components/project/project-list/project-list.component';
import { ProjectCreateComponent } from './components/project/project-create/project-create.component';
import { TaskListComponent } from './components/task/task-list/task-list.component';
import { TaskCreateComponent } from './components/task/task-create/task-create.component';
import { MeetingListComponent } from './components/meeting/meeting-list/meeting-list.component';
import { MeetingCreateComponent } from './components/meeting/meeting-create/meeting-create.component';
import { AssignUserToProjectComponent } from './components/user/assign-user-to-project/assign-user-to-project.component';
import { ProjectsWithoutUsersComponent } from './components/project/projects-without-users/projects-without-users.component';
import { UserProjectRelatedComponent } from '../app-common/components/user-project-related/user-project-related.component';
import { UserMeetingRelatedComponent } from '../app-common/components/user-meeting-related/user-meeting-related.component';
import { UserTaskRelatedComponent } from '../app-common/components/user-task-related/user-task-related.component';
import { MyProfileComponent } from '../app-common/components/my-profile/my-profile.component';

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
          { path: 'assign-user', component: AssignUserToProjectComponent },
        ],
      },
      {
        path: 'project',
        children: [
          { path: 'get-all', component: ProjectListComponent },
          { path: 'create', component: ProjectCreateComponent },
          {
            path: 'project-without-assignees',
            component: ProjectsWithoutUsersComponent,
          },
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
