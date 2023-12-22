import { Component, OnInit } from '@angular/core';
import { EntitylistService } from '../services/entitylist.service';
import { AuthStorageService } from '../services/authstorage.service';
import { Router } from '@angular/router';
import { ConnectdatabaseComponent } from '../connectdatabase/connectdatabase.component';
import { MatDialog } from '@angular/material/dialog';
import { EntityListDto } from '../models/EntitylistDto.model';
import { SharedDataService } from '../services/log-details.service';

@Component({
  selector: 'app-entity-list',
  templateUrl: './entity-list.component.html',
  styleUrls: ['./entity-list.component.css']
})
export class EntityListComponent implements OnInit{
  tableNames: EntityListDto[] = [];
  originalEntityList: any[] = [];
  errorMessage: string = '';
  currentPage = 1;
  entityList: any[] = [];
  pagedData: any[] = [];
  hasValues: { [key: string]: boolean } = {};
 
  constructor(private entitylistService: EntitylistService , private authStorageService : AuthStorageService , private router : Router , private dialog : MatDialog, private SharedDataService :SharedDataService) {}
 
  ngOnInit() {
    this.entitylistService.getEntityList().subscribe(
      (data: any) => {
        this.tableNames = data.result;
        this.pagedData = this.tableNames;
        console.log(this.tableNames);
        // Make the second API call inside this block
        const tableNames = this.pagedData.map(table => table.entityName);
        this.SharedDataService.checkTablesHaveValues(this.pagedData.map(table => table.entityName))
        .subscribe(
          (tablesWithValues: { [key: string]: boolean }) => {
            this.hasValues = tablesWithValues;  // Assign the values to the component property
          },
          (error) => {
            console.error('Error checking tables for values:', error);
          }
        );
      },
      (error) => {
        this.errorMessage = 'No Data Available';  // Update error message
      }
    );
   
    this.setPage(this.currentPage); // Initialize the first page
    this.loadEntityList();
  }
  editTable(entityName: string) {
    // Implement your editTable logic here
  }

  loadEntityList() {
    this.entitylistService.getEntityList().subscribe(
      (data: any) => {
        this.originalEntityList = data.result || [];
        this.entityList = [...this.originalEntityList];
      },
      error => {
        console.error('Error fetching entity list:', error);
        // Handle error as needed
      }
    );
  }
  setPage(page: number) {
    // const startIndex = (page - 1) * this.itemsPerPage;
    // const endIndex = Math.min(startIndex + this.itemsPerPage, this.tableNames.length);
    this.pagedData = this.tableNames;
  }
  logout() {
    this.authStorageService.clearAuthInfo();
    this.router.navigate(['']);
    window.location.reload();
    // Your logout logic
  }

  switchView() {
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

  onSearch(searchTerm: string) {
    // Filter entity names based on the search term
    this.entityList = this.originalEntityList.filter(entity =>
      entity.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  CreateEntity(){
    this.router.navigate(['createentity'])
  }

  ViewEntity(entityName : string){
    this.router.navigate(['entity/:${entityName}'])
  }
}
