import { Component, EventEmitter, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from '../services/ToastrService';
import { Router } from '@angular/router';
import { EntitylistService } from '../services/entitylist.service';

@Component({
  selector: 'app-connectdatabase',
  templateUrl: './connectdatabase.component.html',
  styleUrls: ['./connectdatabase.component.css']
})
export class ConnectdatabaseComponent {

  constructor(private dialog: MatDialog,
    private entityService: EntitylistService,
    private toastrService : ToastrService,
    private router : Router) {
  }
  boxes = [
    { content: 'Dynamo', imageSrc: 'assets/images/dynamo.png', selected: false },
    { content: 'postgresql', imageSrc: 'assets/images/postgre.png', selected: false },
    { content: 'MY SQL', imageSrc: 'assets/images/Db1-mysql.png', selected: false },
    { content: 'MS SQL', imageSrc: 'assets/images/sql.png', selected: false },
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
      provider: this.selectedContent,
    };
    localStorage.setItem('databaseDetails', JSON.stringify(databaseDetails));
      this.entityService.getClientEntity().subscribe(
        (response) => {
          console.log(response)
          if(response.isSuccess){
            const dialogRef = this.dialog.closeAll();
            this.toastrService.showSuccess('Your Database Connected Successfully');
            this.router.navigate(['/entitylist']);
          }
          else if(response.errorMessages[0] != null){
            this.toastrService.showError(response.errorMessages);
          }
          else{
            this.toastrService.showError(response.result);
          }
        },
        (error) => {
          this.toastrService.showError("Invalid Credentials");
        }
      );
  
    } else {
      this.toastrService.showError('Please fill in all fields');
    }
  }


  closePopup() {
    // Implement logic to close the popup when the close icon is clicked
    const dialogRef = this.dialog.closeAll();
  }
}
