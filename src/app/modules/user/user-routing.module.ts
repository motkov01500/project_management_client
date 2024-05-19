import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { MainComponent } from './components/main/main.component';
import { ProjectComponent } from './components/project/project.component';
import { MeetingComponent } from './components/meeting/meeting.component';
import { MyProfileComponent } from '../app-common/components/my-profile/my-profile.component';
import { TaskComponent } from './components/task/task.component';
import { UserMeetingRelatedComponent } from '../app-common/components/user-meeting-related/user-meeting-related.component';
import { UserProjectRelatedComponent } from '../app-common/components/user-project-related/user-project-related.component';
import { UserTaskRelatedComponent } from '../app-common/components/user-task-related/user-task-related.component';

const routes: Route[] = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: 'projects',
        component: ProjectComponent,
      },
      { path: 'projects/tasks', component: TaskComponent },
      { path: 'projects/tasks/users', component: UserTaskRelatedComponent },
      { path: 'projects/meetings', component: MeetingComponent },
      {
        path: 'projects/meetings/meeting-users',
        component: UserMeetingRelatedComponent,
      },
      { path: 'projects/users', component: UserProjectRelatedComponent },
      { path: 'my-profile', component: MyProfileComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
