import { Component, OnInit } from '@angular/core';
import { EntitylistService } from '../services/entitylist.service';
import { AuthStorageService } from '../services/authstorage.service';
import { Router } from '@angular/router';
import { ConnectdatabaseComponent } from '../connectdatabase/connectdatabase.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-entity-list',
  templateUrl: './entity-list.component.html',
  styleUrls: ['./entity-list.component.css']
})
export class EntityListComponent implements OnInit{
  
  originalEntityList: any[] = [];
  entityList: any[] = [];
 
  constructor(private entitylistService: EntitylistService , private authStorageService : AuthStorageService , private router : Router , private dialog : MatDialog) {}
 
  ngOnInit() {
    this.loadEntityList();
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
