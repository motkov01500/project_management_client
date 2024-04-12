import { Component, Input } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {
  items:MenuItem[] = [];

  get itemsArray(): MenuItem[] {
    return this.items;
  }

  @Input()
  set itemsArray(value: MenuItem[]) {
    this.items = value;
  }
}
