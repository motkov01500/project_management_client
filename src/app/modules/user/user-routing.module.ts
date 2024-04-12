import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { MainComponent } from './components/main/main.component';
import { ProjectComponent } from './components/project/project.component';
import { MeetingComponent } from './components/meeting/meeting.component';
import { MyProfileComponent } from './components/my-profile/my-profile.component';
import { TaskComponent } from './components/task/task.component';

const routes: Route[] = [
  {
    path: '',
    component: MainComponent,
    children: [
      { path: 'projects', component: ProjectComponent },
      { path: 'meetings', component: MeetingComponent },
      { path: 'my-profile', component: MyProfileComponent },
      { path: 'task', component: TaskComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
