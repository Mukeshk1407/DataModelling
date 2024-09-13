import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TableColumnDTO } from '../models/TableColumnDTO.model';
import { Router } from '@angular/router';
import { ToastrService } from '../services/ToastrService';
import { SharedDataService } from '../services/log-details.service';
import { LogDetailsDTO } from '../models/LogDetailsDTO';
import { AuthStorageService } from '../services/authstorage.service';
import { ConnectdatabaseComponent } from '../connectdatabase/connectdatabase.component';
import { MatDialog } from '@angular/material/dialog';
import { EntitylistService } from '../services/entitylist.service';
import { ExcelService } from '../services/excel.service';
import { ColumnDTO } from '../models/ColumnDTO';

@Component({
  selector: 'app-entity-details',
  templateUrl: './entity-details.component.html',
  styleUrls: ['./entity-details.component.css'],
})
export class EntityDetailsComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;
  entityName!: string;
  columns: any[] = [];
  defaultValueForEntityId: number = 0;
  // Add these properties to store additional parameters
  hostname: string = '';
  dbname: string = '';
  username: string = '';
  password: string = '';
  columnsList: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private entityService: EntitylistService,
    private authStorageService: AuthStorageService,
    private router: Router,
    private toastrService: ToastrService,
    private sharedDataService: SharedDataService,
    private dialog: MatDialog,
    private ExcelService: ExcelService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.entityName = params['entityName'];
    });
    this.entityService
      .getColumnsByHostProviderDatabaseTableName(this.entityName)
      .subscribe(
        (data: any) => {
          if (data.isSuccess) {
            this.columnsList = data.result;
            this.columns = this.columnsList;
          } else {
          }
        },
        (error) => {}
      );
  }

  searchText = ''; // Variable to store user input for search

  BacktoView() {
    this.router.navigate(['entitylist']);
  }

  switchView() {
    // Clear localStorage data
    localStorage.removeItem('databaseDetails');
    this.router.navigate(['']);

    const dialogRef = this.dialog.open(ConnectdatabaseComponent, {
      width: '400px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result: string | undefined) => {
      if (result) {
        // Handle the selected database
      } else {
        // Handle modal close event
      }
    });
  }

  //   onSearch(searchTerm: string) {
  //   console.log(searchTerm);
  //   this.columnsList = this.columns.filter((entity) =>
  //     entity.columnName.toLowerCase().includes(searchTerm.toLowerCase())
  //   );
  //   console.log(this.columnsList);
  // }

  hasColumns(): boolean {
    return this.columns.length > 0;
  }

  openFileInput() {
    const fileInput = this.fileInput.nativeElement;
    fileInput.click();
  }

  uploadTemplate(event: any) {
    const file = event.target.files[0];
    const tableName = this.entityName;
    const formData = new FormData();
    formData.append('file', file);
    // Create an instance of LogDetailsDTO and populate it
    this.ExcelService.uploadTemplate(formData, tableName).subscribe(
      (res: any) => {
        const response = JSON.parse(res);
        var logId = response.result;
        if (response.isSuccess) {
          this.toastrService.showSuccess(response.errorMessage[0]);
          // Navigate to LogDetailsComponent
          this.router.navigate([`/log_details/${logId}`]);
        } else {
          this.toastrService.showError(response.errorMessage[0]);
          this.router.navigate([`/log_details/${logId}`]);
        }
      },
      (error: any) => {
        window.location.reload();
        const errorResponse = JSON.parse(error.error);
        if (errorResponse != null) {
          if (errorResponse.errorMessage[0] != null) {
            this.toastrService.showError(errorResponse.errorMessage[0]);
          } else {
            this.toastrService.showError(
              'An error occurred while uploading the template.'
            );
          }
        } else {
          this.toastrService.showError(
            'An error occurred while uploading the template.'
          );
        }
      }
    );
  }

  goBackToList() {
    this.router.navigate(['/entitylist']);
  }

  logout() {
    this.authStorageService.clearAuthInfo();
    this.router.navigate(['']);
  }

  generateExcelTemplate() {
    if (this.columns.length === 0) {
      return; // Do nothing if there are no columns
    }
    // Make a request to your backend to generate the Excel file
    this.ExcelService.generateExcelFile(this.columnsList).subscribe(
      (data: Blob) => {
        // Create a blob from the response data
        const blob = new Blob([data], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });

        // Create a temporary URL and trigger the download
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.entityName}_template.xlsx`;
        document.body.appendChild(a);
        a.click();
        // Clean up the temporary URL
        window.URL.revokeObjectURL(url);
      },
      (error: any) => {
        // Handle the error as needed
      }
    );
  }

  toggleNullable(column: TableColumnDTO): void {
    column.isNullable = !column.isNullable;
  }

  togglePrimaryKey(column: TableColumnDTO): void {
    column.ColumnPrimaryKey = !column.ColumnPrimaryKey;
  }
}
