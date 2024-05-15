import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from './components/menu/menu.component';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { UserTaskRelatedComponent } from './components/user-task-related/user-task-related.component';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';

@NgModule({
  declarations: [MenuComponent, UserTaskRelatedComponent],
  exports: [MenuComponent],
  imports: [
    CommonModule,
    MenubarModule,
    ButtonModule,
    OverlayPanelModule,
    ToastModule,
    TableModule,
  ],
})
export class AppCommonModule {}
