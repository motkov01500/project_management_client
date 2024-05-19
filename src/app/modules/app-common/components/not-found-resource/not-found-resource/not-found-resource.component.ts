import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-not-found-resource',
  templateUrl: './not-found-resource.component.html',
  styleUrl: './not-found-resource.component.css',
})
export class NotFoundResourceComponent {
  @Input() totalRecords: number = 1;
}
