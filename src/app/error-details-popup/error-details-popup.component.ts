import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-error-details-popup',
  templateUrl: './error-details-popup.component.html',
  styleUrls: ['./error-details-popup.component.css']
})
export class ErrorDetailsPopupComponent {
  @Input() errorRowNumber: string;
  @Output() closePopupEvent: EventEmitter<void> = new EventEmitter<void>();

  closePopup(): void {
    this.closePopupEvent.emit();
  }
}
