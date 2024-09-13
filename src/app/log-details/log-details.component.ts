import { Component, HostListener } from '@angular/core';
import { SharedDataService } from '../services/log-details.service';
import { ExcelService } from '../services/excel.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthStorageService } from '../services/authstorage.service';
import { MatDialog } from '@angular/material/dialog';
import { ConnectdatabaseComponent } from '../connectdatabase/connectdatabase.component';
import { EntitylistService } from '../services/entitylist.service';
import { ColumnDTO } from '../models/ColumnDTO';

declare var $: any;

@Component({
  selector: 'app-log-details',
  templateUrl: './log-details.component.html',
  styleUrls: ['./log-details.component.css'],
})
export class LogDetailsComponent {

  logParent: any;
  parentId: number | undefined;
  logChildren!: any[];
  columns: ColumnDTO[] = [];
  
  entityName: string = ''; // Initialize entityName variable
  entityId: number;
  logId: number;


  showPopup: boolean = false;
  selectedErrorRowNumber: string = '';

  constructor(
    private router: Router,
    private sharedDataService: SharedDataService,
    private ExcelService: ExcelService,
    private authStorageService: AuthStorageService,
    private dialog: MatDialog,
    private entityService: EntitylistService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {

    this.route.params.subscribe((params) => {
      this.logId = params['logId'];
    });
    
    // Subscribe to the shared service to get log details data
    this.sharedDataService.getLogByParentId(this.logId).subscribe((data: any) => {
      if (data.isSuccess) {

        this.logParent = data.result.logParentDTOs;
        this.logChildren = data.result.childrenDTOs;
        this.entityId = this.logParent.entity_Id;
          this.entityService.getTableById(this.entityId).subscribe((entity: any) => {
            if (entity.isSuccess) {
            this.entityName = entity.result.entityName;
          }

          this.entityService.getColumnsByEntityId(this.entityId).subscribe((columns: any)=>{
            if(columns.isSuccess){
              this.columns = columns.result;
            }
          })
        });
      }
    });
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

  BacktoView() {
    this.router.navigate([`entity/${this.entityName}`]);
  }

  truncateErrorRowNumber(errorRowNumber: number): string {
    const truncatedNumber = errorRowNumber.toString().slice(0, 10);
    return truncatedNumber;
  }

  exportData(): void {
    const parentId = this.logId;
    if (parentId != undefined) {
      this.generateExcelTemplates(parentId);
    } else {
    }
  }

  exportbtn(): void {
    this.exportData();
  }

  logout() {
    this.authStorageService.clearAuthInfo();
    this.router.navigate(['']);
  }

  generateExcelTemplates(parentId: number) {
    if (this.columns.length === 0) {
      return;
    }
    this.ExcelService.ExportExcelFiles(parentId, this.columns).subscribe(
      (data: Blob) => {
        const blob = new Blob([data], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.entityName}_Export.xlsx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      },
      (error: any) => {}
    );
  }

  showErrorDetailsPopup(errorRowNumber: string): void {
    this.selectedErrorRowNumber = errorRowNumber;
    this.showPopup = true;
  }

  closePopup(): void {
    this.showPopup = false;
  }
}
