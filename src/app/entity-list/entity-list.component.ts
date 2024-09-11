import { Component, OnInit } from '@angular/core';
import { EntitylistService } from '../services/entitylist.service';
import { AuthStorageService } from '../services/authstorage.service';
import { Router } from '@angular/router';
import { ConnectdatabaseComponent } from '../connectdatabase/connectdatabase.component';
import { MatDialog } from '@angular/material/dialog';
import { EntityListDto } from '../models/EntitylistDto.model';

@Component({
  selector: 'app-entity-list',
  templateUrl: './entity-list.component.html',
  styleUrls: ['./entity-list.component.css'],
})
export class EntityListComponent implements OnInit {
  tableNames: EntityListDto[] = [];
  originalEntityList: any[] = [];
  errorMessage: string = '';
  currentPage = 1;
  entityList: any[] = [];
  pagedData: any[] = [];

  constructor(
    private entitylistService: EntitylistService,
    private authStorageService: AuthStorageService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.entitylistService.getTablesByHostProviderDatabase().subscribe(
      (data: any) => {
        this.tableNames = data.result;
        this.pagedData = this.tableNames;
        // Make the second API call inside this block
        const tableNames = this.pagedData.map((table) => table.entityName);
        console.log('tableNames', tableNames);
      },
      (error) => {
        this.errorMessage = 'No Data Available'; // Update error message
      }
    );
    this.setPage(this.currentPage); // Initialize the first page
    this.loadEntityList();
  }

  editTable(entityName: string) {
    // Implement your editTable logic here
  }

  loadEntityList() {
    this.entitylistService.getTablesByHostProviderDatabase().subscribe(
      (data: any) => {
        this.originalEntityList = data.result || [];
        this.entityList = [...this.originalEntityList];
      },
      (error) => {
        // Handle error as needed
      }
    );
  }
  setPage(page: number) {
    this.pagedData = this.tableNames;
  }
  logout() {
    this.authStorageService.clearAuthInfo();
    this.router.navigate(['']);
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

  onSearch(searchTerm: string) {
    // Filter entity names based on the search term
    this.entityList = this.originalEntityList.filter((entity) =>
      entity.entityName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  CreateEntity() {
    this.router.navigate(['createentity']);
  }

  ViewEntity(entityName: string) {
    this.router.navigate(['entity/:${entityName}']);
  }

  addValidation(entityName: string) {
    // Navigate to the validation route using the entityName
    this.router.navigate([`Edit-Entity/${entityName}`]);
  }
  Viewattribute(entityName: string) {
    // Navigate to the view route using the entityName
    this.router.navigate([`entity/${entityName}`]);
  }
}
