import { Component, EventEmitter, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from '../services/ToastrService';
import { Router } from '@angular/router';
import { EntitylistService } from '../services/entitylist.service';

@Component({
  selector: 'app-connectdatabase',
  templateUrl: './connectdatabase.component.html',
  styleUrls: ['./connectdatabase.component.css'],
})
export class ConnectdatabaseComponent {
  constructor(
    private dialog: MatDialog,
    private entityService: EntitylistService,
    private toastrService: ToastrService,
    private router: Router
  ) {}
  boxes = [
    {
      content: 'Dynamo',
      imageSrc: 'assets/images/dynamo.png',
      selected: false,
    },
    {
      content: 'postgresql',
      imageSrc: 'assets/images/postgre.png',
      selected: false,
    },
    {
      content: 'MY SQL',
      imageSrc: 'assets/images/Db1-mysql.png',
      selected: false,
    },
    { content: 'MS SQL', imageSrc: 'assets/images/sql.png', selected: false },
    {
      content: 'Timescale',
      imageSrc: 'assets/images/timescaledb.png',
      selected: false,
    },
    {
      content: 'Influx',
      imageSrc: 'assets/images/influxdb.png',
      selected: false,
    },
    {
      content: 'Scylla',
      imageSrc: 'assets/images/scylladb.png',
      selected: false,
    },
  ];

  showInputFields = false;
  selectedBox: { id: number; content: string; selected: boolean } | null = null;
  showNextButton = false;
  selectedContent: string | null = null;

  //Parameters for connection different database
  hostname: string = '';
  databaseName: string = '';
  username: string = '';
  password: string = '';
  accessKey: string = '';
  secretKey: string = '';
  region: string = '';
  influxDbToken: string = '';
  influxDbOrgId: string = '';
  influxDbBucket: string = '';
  influxDbURL: string = '';
  iPAddress: string = '';
  keySpace: string = '';
  ec2Instance: string = '';
  port: number;

  back() {
    this.showInputFields = false;
  }

  selectBox(box: any) {
    // Deselect all boxes
    this.boxes.forEach((b) => (b.selected = false));
    // Select the clicked box
    box.selected = true;
    this.selectedBox = box;
    // The Next button is always visible when a box is selected
    this.showNextButton = true;
  }

  showSelectedContent() {
    if (this.selectedBox) {
      this.selectedContent = this.selectedBox.content;
      this.showInputFields = true;
    }
  }

  connect() {
    // Check if all required fields are filled
    if (this.isFormValid()) {
      const databaseDetails = {
        hostname: encodeURIComponent(this.hostname),
        databaseName: this.databaseName,
        username: this.username,
        password: this.password,
        provider: this.selectedContent,
        accessKey: this.accessKey,
        secretKey: this.secretKey,
        region: this.region,
        influxDbToken: this.influxDbToken,
        influxDbOrgId: this.influxDbOrgId,
        influxDbBucket: this.influxDbBucket,
        influxDbURL: this.influxDbURL,
        iPAddress: this.iPAddress,
        keySpace: this.keySpace,
        ec2Instance: this.ec2Instance,
        port: this.port,
      };

      localStorage.setItem('databaseDetails', JSON.stringify(databaseDetails));
      this.entityService.getClientEntity().subscribe(
        (response) => {
          console.log('response', response);
          if (response.isSuccess) {
            this.dialog.closeAll();
            this.toastrService.showSuccess(
              'Your Database Connected Successfully'
            );
            this.router.navigate(['/entitylist']);
          } else {
            this.toastrService.showError(
              response.errorMessages || response.result
            );
          }
        },
        (error) => {
          this.toastrService.showError('Invalid Credentials');
        }
      );
    } else {
      this.toastrService.showError('Please fill in all fields');
    }
  }

  // Validation based on the selected database
  isFormValid(): boolean {
    if (this.selectedContent === 'Dynamo') {
      return this.accessKey && this.secretKey && this.region ? true : false;
    }
    if (this.selectedContent === 'Influx') {
      return this.influxDbToken &&
        this.influxDbOrgId &&
        this.influxDbBucket &&
        this.influxDbURL
        ? true
        : false;
    }
    if (this.selectedContent === 'Scylla') {
      return this.iPAddress && this.keySpace && this.ec2Instance && this.port
        ? true
        : false;
    }
    // For other databases (general validation)
    return this.hostname && this.databaseName && this.username && this.password
      ? true
      : false;
  }

  changeFieldBasedOnDB() {}
  closePopup() {
    // Implement logic to close the popup when the close icon is clicked
    const dialogRef = this.dialog.closeAll();
  }
}
