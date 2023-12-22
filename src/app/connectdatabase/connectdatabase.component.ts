import { Component, EventEmitter, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DatabaseService } from '../services/database.service';
import { ToastrService } from '../services/ToastrService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-connectdatabase',
  templateUrl: './connectdatabase.component.html',
  styleUrls: ['./connectdatabase.component.css']
})
export class ConnectdatabaseComponent {

  constructor(private dialog: MatDialog,
    private dbService: DatabaseService,
    private toastrService : ToastrService,
    private router : Router) {
  }
  boxes = [
    { content: 'Dynamo', imageSrc: 'assets/images/dynamo.png', selected: false },
    { content: 'PostgreSQL', imageSrc: 'assets/images/postgre.png', selected: false },
    { content: 'MY SQL', imageSrc: 'assets/images/Db1-mysql.png', selected: false },
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
  databaseName: string = '';
  username: string = '';
  password: string = '';

  connect() {
    // Check if all required fields are filled
    if (this.hostname && this.username && this.password &&this. databaseName && this.selectedContent) {
       // Store the entered details in localStorage
    const databaseDetails = {
      hostname: this.hostname,
      databaseName: this.databaseName,
      username: this.username,
      password: this.password,
      selectedContent: this.selectedContent,
    };
    localStorage.setItem('databaseDetails', JSON.stringify(databaseDetails));
      // Use the DatabaseService to connect to the backend
      //this.selectedContent,
      this.dbService.getTableDetails( 
        this.hostname,this. databaseName, this.username, this.password).subscribe(
        (response) => {

          if(response.isSuccess){
            const dialogRef = this.dialog.closeAll();
            this.toastrService.showSuccess('Your Database Connected Successfully');
            this.router.navigate(['/entitylist']);
          }
          else{
            this.toastrService.showError(response.errorMessages);
          }
        },
        (error) => {
          this.toastrService.showError("Invalid Credentials");
        }
      );
  
    } else {
      // Display an error message or perform any other action for incomplete fields
      this.toastrService.showError('Please fill in all fields');
      console.log('Please fill in all fields');
    }
  }


  closePopup() {
    // Implement logic to close the popup when the close icon is clicked
    const dialogRef = this.dialog.closeAll();
  }
}
