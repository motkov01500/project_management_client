import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { SidebarModule } from 'primeng/sidebar';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import {
  MenuComponent,
  NotFoundResourceComponent,
  UserTaskRelatedComponent,
} from './components';

@NgModule({
  declarations: [
    MenuComponent,
    UserTaskRelatedComponent,
    NotFoundResourceComponent,
  ],
  exports: [MenuComponent, NotFoundResourceComponent],
  imports: [
    CommonModule,
    MenubarModule,
    ButtonModule,
    OverlayPanelModule,
    ToastModule,
    TableModule,
    DropdownModule,
    SidebarModule,
    FormsModule,
    InputTextModule,
    MultiSelectModule,
  ],
})
export class AppCommonModule {}
