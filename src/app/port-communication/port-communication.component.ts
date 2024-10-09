import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-port-communication',
  templateUrl: './port-communication.component.html',
  styleUrls: ['./port-communication.component.css'],
})
export class PortCommunicationComponent {
  portNumber: string = '';
  ipAddress: string = '';
  currentTime: string = '';

  constructor(private dialog: MatDialog) {}
  getCurrentTime() {
    const now = new Date();
    this.currentTime = now.toLocaleTimeString();
  }

  submitData() {
    const data = {
      portNumber: this.portNumber,
      ipAddress: this.ipAddress,
      currentTime: this.currentTime,
    };
    console.log('Data to be sent to backend:', data);
  }

  closePopup(): void {
    const dialogRef = this.dialog.closeAll();
  }
}
