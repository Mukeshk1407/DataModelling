import { Component,HostListener } from '@angular/core';
import { TableColumnDTO } from '../models/TableColumnDTO.model';
import { SharedDataService } from '../services/log-details.service';
import { ColumnsService } from '../services/create-entity.service';
import { Router } from '@angular/router';
import { AuthStorageService } from '../services/authstorage.service';
import { MatDialog } from '@angular/material/dialog';
import { ConnectdatabaseComponent } from '../connectdatabase/connectdatabase.component';

declare var $: any; // Add this line to declare the jQuery variable


@Component({ 
  selector: 'app-log-details',
  templateUrl: './log-details.component.html',
  styleUrls: ['./log-details.component.css']
})
export class LogDetailsComponent {
  logParent: any;
  parentId: number | undefined;
  logChildren!: any[];
  columns: TableColumnDTO[] = [];
  entityName: string = ''; // Initialize entityName variable

  
  constructor(private router: Router,
    private sharedDataService: SharedDataService,
    private columnsService: ColumnsService,
    private authStorageService: AuthStorageService, private dialog:MatDialog) { }

  ngOnInit(): void {
    // Subscribe to the shared service to get log details data
    this.sharedDataService.getLogDetailsData().subscribe((data: any) => {
      if (data) {
        this.logParent = data.result.logParentDTOs; 
        this.logChildren = data.result.childrenDTOs; 
        console.log("errorrow", this.logChildren);
        this.entityName = this.extractEntityName(this.logParent.fileName);
        this.parentId = this.logParent.id
        console.log(this.logChildren)
      }
    });

    const savedData = localStorage.getItem('logDetailsData');

    if (savedData) {
      // If data exists in localStorage, parse and set it
      const parsedData = JSON.parse(savedData);
      this.logParent = parsedData.logParent;
      this.logChildren = parsedData.logChildren;
      this.entityName = parsedData.entityName;
      this.parentId = parsedData.parentId;
    } else {
      // If no data in localStorage, fetch it from the shared service
      this.sharedDataService.getLogDetailsData().subscribe((data: any) => {
        if (data) {
          this.logParent = data.result.logParentDTOs; 
          this.logChildren = data.result.childrenDTOs; 
          this.entityName = this.extractEntityName(this.logParent.fileName);
          this.parentId = this.logParent.id;

          // Save data to localStorage
          this.saveDataToLocalStorage();
        }
      });
    }

  }

  saveDataToLocalStorage(): void {
    const dataToSave = {
      logParent: this.logParent,
      logChildren: this.logChildren,
      entityName: this.entityName,
      parentId: this.parentId
    };
    localStorage.setItem('logDetailsData', JSON.stringify(dataToSave));
  }

  onButtonClick(): void {
    this.fetchColumnsData(this.entityName);
    const entityName = this.entityName;
    const parentId = this.parentId;
    if (parentId !== undefined) {
      $('#exportModal').modal('show');
    } else {
      console.error('parentId is undefined. Unable to generate Excel template.');
    }
  }
  

  switchView() {
    // Clear localStorage data
 localStorage.removeItem('databaseDetails');
   this.router.navigate(['']);

   const dialogRef = this.dialog.open(ConnectdatabaseComponent, {
     width: '400px',
     disableClose:true
   });
 
   dialogRef.afterClosed().subscribe((result: string | undefined) => {
     if (result) {
       // Handle the selected database
       console.log('Selected Database:', result);
     } else {
       // Handle modal close event
       console.log('Modal closed');
     }
   });
 }

  BacktoView(entityName : string) {
    this.router.navigate([`entity/${entityName}`]);
    localStorage.removeItem('logDetailsData');
    // Dispatch the logout action
    // this.store.dispatch(authActions.logout());
  }

  truncateErrorRowNumber(errorRowNumber: number): string {
    const truncatedNumber = errorRowNumber.toString().slice(0, 10);
    return truncatedNumber;
  }
  
  exportData(): void {
    const entityName = this.entityName;
    const parentId = this.parentId;
    if (parentId !== undefined) {
      this.fetchColumnsData(entityName);
      this.generateExcelTemplates(parentId);
      this.closeModal();
    } else {
      console.error('parentId is undefined. Unable to generate Excel template.');
    }
    
  }
  exportbtn():void{
    console.log("first")
   this.exportData();
   this.exportData();
  }

  closeModal(): void {
    $('#exportModal').modal('hide');
  }


  ngOnDestroy(): void {
    // Clear the data from localStorage when the component is destroyed
    localStorage.removeItem('logDetailsData');
  }

  logout() {
    localStorage.removeItem('logDetailsData');
    this.authStorageService.clearAuthInfo();
      this.router.navigate(['']);
     
    
  }

  fetchColumnsData(entityName: string): void {
    this.columnsService.getColumnsForEntitys(entityName).subscribe(
      (data: any) => {
        if (data.isSuccess) {
          this.columns = data.result.map((columnData: any) => {
            const column: TableColumnDTO = {
              entityname: this.entityName,
              id: columnData.id,
              entityColumnName: columnData.entityColumnName,
              entityId: columnData.entityid,
              datatype: columnData.datatype,
              length: columnData.length,
              description: columnData.description,
              isNullable: columnData.isNullable,
              defaultValue: columnData.defaultValue,
              ColumnPrimaryKey: columnData.columnPrimaryKey,
              True: columnData.true,
              False: columnData.false,
              minLength:columnData.minLength,
              maxLength:columnData.maxLength,
              minRange: columnData.minRange,
              maxRange:columnData.maxRange,
              dateMinValue:columnData.dateMinValue,
              dateMaxValue:columnData.dateMaxValue,
              ListEntityId:columnData.listEntityId,
              ListEntityKey:columnData.listEntityKey,
              ListEntityValue:columnData.listEntityValue
            };
            return column;
          });
        } else {
        }
      },
      (error) => {
      }
    );
  }

  generateExcelTemplates(parentId: number) {
    if (this.columns.length === 0) {
      return; 
    }
    this.columnsService.generateExcelFiles(parentId,this.columns).subscribe(
      (data: Blob) => {
        const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.entityName}_Export.xlsx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      },
      (error: any) => {
      }
    );
  }
  


  saveExcelFiles(data: Blob): void {
    const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${this.entityName}_ExportData.xlsx`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  }
  
  extractEntityName(fullFileName: string): string {
    const parts = fullFileName.split('_');
    if (parts.length > 0) {
      return parts[0]; 
    }
    return ''; 
  }

 
}
