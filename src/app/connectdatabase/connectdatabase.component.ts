import { Component, EventEmitter, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-connectdatabase',
  templateUrl: './connectdatabase.component.html',
  styleUrls: ['./connectdatabase.component.css']
})
export class ConnectdatabaseComponent {

  constructor(private dialog: MatDialog) {
  }
  boxes = [
    { content: 'Dynamo', imageSrc: 'assets/images/dynamo.png', selected: false },
    { content: 'PostgreSQL', imageSrc: 'assets/images/postgre.png', selected: false },
    { content: 'MY SQL', imageSrc: 'assets/images/sql.png', selected: false },
    { content: 'MS SQL', imageSrc: 'assets/images/sql.png', selected: false },
    // ... other items
  ];  

  showInputFields = false;
  selectedBox: { id: number, content: string, selected: boolean } | null = null;
  showNextButton = false;
  selectedContent: string | null = null;

  back() {
    this.showInputFields = false;
  }

  selectBox(box: any ) {
    // Deselect all boxes
    this.boxes.forEach(b => b.selected = false);

    // Select the clicked box
    box.selected = true;
    this.selectedBox = box;

    this.showNextButton = true; // The Next button is always visible when a box is selected
  }

  showSelectedContent() {
    if (this.selectedBox) {
      this.selectedContent = this.selectedBox.content;
      console.log('Selected content:', this.selectedContent);
      this.showInputFields = true;
      // You can perform any action with the selected content here
    }
  }

  hostname: string = '';
  username: string = '';
  password: string = '';

  connect() {
    // Check if all required fields are filled
    if (this.hostname && this.username && this.password) {
      // Implement the logic to connect to the database using the entered credentials
      console.log('Connecting to the database...');
      console.log('Hostname:', this.hostname);
      console.log('Username:', this.username);
      console.log('Password:', this.password);
  
      // Close the popup
      const dialogRef = this.dialog.closeAll();
    } else {
      // Display an error message or perform any other action for incomplete fields
      console.log('Please fill in all fields.');
    }
  }

  closePopup() {
    // Implement logic to close the popup when the close icon is clicked
    const dialogRef = this.dialog.closeAll();
  }
}
