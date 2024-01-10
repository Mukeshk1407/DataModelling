import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ColumnsService } from '../services/create-entity.service';
import { TableColumnDTO } from '../models/TableColumnDTO.model';
import { Router } from '@angular/router';
import { ToastrService } from '../services/ToastrService';
import { SharedDataService } from '../services/log-details.service';
import { LogDetailsDTO } from '../models/LogDetailsDTO';
import { AuthStorageService } from '../services/authstorage.service';
import { ConnectdatabaseComponent } from '../connectdatabase/connectdatabase.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-entity-details',
  templateUrl: './entity-details.component.html',
  styleUrls: ['./entity-details.component.css'],
})
export class EntityDetailsComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;
  entityName!: string;
  columns: TableColumnDTO[] = [];
  defaultValueForEntityId: number = 0;
  // Add these properties to store additional parameters
  hostname: string = '';
  dbname: string = '';
  username: string = '';
  password: string = '';
  columnList: any[] = [];
  originalEntityList: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private columnsService: ColumnsService,
    private authStorageService: AuthStorageService,
    private router: Router,
    private toastrService: ToastrService,
    private sharedDataService: SharedDataService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.entityName = params['entityName'];
      this.fetchColumnsData();
    });

    this.columnsService.getColumnsForEntity(this.entityName).subscribe(
      (data: any) => {
        if (data.isSuccess) {
          this.columns = data.result.map((columnData: any) => {
            const column: TableColumnDTO = {
              entityname: this.entityName,
              id: columnData.id,
              entityColumnName: columnData.entityColumnName,
              entityId: columnData.entityId,
              datatype: columnData.datatype,
              length: columnData.length,
              minLength: columnData.minLength,
              maxLength: columnData.maxLength,
              minRange: columnData.minRange,
              maxRange: columnData.maxRange,
              dateMinValue: columnData.dateMinValue,
              dateMaxValue: columnData.dateMaxValue,
              description: columnData.description,
              isNullable: columnData.isNullable,
              defaultValue: columnData.defaultValue,
              ColumnPrimaryKey: columnData.columnPrimaryKey,
              True: columnData.true,
              False: columnData.false,
              ListEntityId: columnData.listEntityId,
              ListEntityKey: columnData.listEntityKey,
              ListEntityValue: columnData.listEntityValue,
              S_ListEntityId: columnData.s_ListEntityId,
              S_ListEntityKey: columnData.s_ListEntityKey,
              S_ListEntityValue: columnData.s_ListEntityValue,
            };
            this.columnList = this.columns;
            return column;
          });
        } else {
          // Handle the error as needed
        }
      },
      (error) => {
        // Handle the error as needed
      }
    );
    this.setPage(this.currentPage); // Initialize the first page
  }

  pagedData: TableColumnDTO[] = [];
  currentPage = 1;
  itemsPerPage = 5; // Number of items per page

  searchText = ''; // Variable to store user input for search

  setPage(page: number) {
    const startIndex = (page - 1) * this.itemsPerPage;
    const endIndex = Math.min(
      startIndex + this.itemsPerPage,
      this.columns.length
    );
    this.pagedData = this.columns.slice(startIndex, endIndex);
  }

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

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.setPage(this.currentPage);
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.setPage(this.currentPage);
    }
  }

  onSearch(searchTerm: string) {
    // Filter entity names based on the search term
    this.columnList = this.columns.filter((entity) =>
      entity.entityColumnName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  get totalPages(): number {
    return Math.ceil(this.columns.length / this.itemsPerPage);
  }

  private downloadExcelFile(data: string) {
    const blob = new Blob([data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${this.entityName}_template.xlsx`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  }

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
    this.columnsService.uploadTemplate(formData, tableName).subscribe(
      (res: any) => {
        const response = JSON.parse(res);
        if (response.isSuccess) {
          const logDetails: LogDetailsDTO = JSON.parse(res);
          this.sharedDataService.setLogDetails(logDetails);
          this.toastrService.showSuccess(response.errorMessage[0]);
          // Navigate to LogDetailsComponent
          this.router.navigate(['/log_details']);
        } else {
          const logDetails: LogDetailsDTO = JSON.parse(res);
          this.sharedDataService.setLogDetails(logDetails);
          this.toastrService.showError(response.errorMessage[0]);
          this.router.navigate(['/log_details']);
        }
      },
      (error: any) => {
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
    localStorage.removeItem('logDetailsData');
    this.authStorageService.clearAuthInfo();
    this.router.navigate(['']);
  }
  generateExcelTemplate() {
    // Log the content of this.columns for debugging
    this.hostname = localStorage.getItem('hostname') || '';
    this.dbname = localStorage.getItem('dbname') || '';
    this.username = localStorage.getItem('username') || '';
    this.password = localStorage.getItem('password') || '';
    if (this.columns.length === 0) {
      return; // Do nothing if there are no columns
    }
    // Make a request to your backend to generate the Excel file
    this.columnsService.generateExcelFile(this.columns).subscribe(
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

  fetchColumnsData(): void {
    this.columnsService.getColumnsForEntity(this.entityName).subscribe(
      (data: any) => {
        if (data.isSuccess) {
          this.columns = data.result.map((columnData: any) => {
            const column: TableColumnDTO = {
              entityname: this.entityName,
              id: columnData.id,
              entityColumnName: columnData.entityColumnName,
              entityId:
                columnData.entityid !== undefined
                  ? columnData.entityid
                  : this.defaultValueForEntityId,
              datatype: columnData.datatype,
              length: columnData.length,
              minLength: columnData.minLength,
              maxLength: columnData.maxLength,
              minRange: columnData.minRange,
              maxRange: columnData.maxRange,
              dateMinValue: columnData.dateMinValue,
              dateMaxValue: columnData.dateMaxValue,
              description: columnData.description,
              isNullable: columnData.isNullable,
              defaultValue: columnData.defaultValue,
              ColumnPrimaryKey: columnData.columnPrimaryKey,
              True: columnData.true,
              False: columnData.false,
              ListEntityId: columnData.listEntityId,
              ListEntityKey: columnData.listEntityKey,
              ListEntityValue: columnData.listEntityValue,
              S_ListEntityId: columnData.s_ListEntityId,
              S_ListEntityKey: columnData.s_ListEntityKey,
              S_ListEntityValue: columnData.s_ListEntityValue,
            };
            return column;
          });
        } else {
          // Handle the error as needed
        }
      },
      (error) => {
        // Handle the error as needed
      }
    );
  }

  toggleNullable(column: TableColumnDTO): void {
    column.isNullable = !column.isNullable;
  }

  // Function to toggle the value of isPrimaryKey property
  togglePrimaryKey(column: TableColumnDTO): void {
    column.ColumnPrimaryKey = !column.ColumnPrimaryKey;
  }
}
