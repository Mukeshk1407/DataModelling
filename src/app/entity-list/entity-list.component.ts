import { Component, OnInit } from '@angular/core';
import { EntitylistService } from '../services/entitylist.service';

@Component({
  selector: 'app-entity-list',
  templateUrl: './entity-list.component.html',
  styleUrls: ['./entity-list.component.css']
})
export class EntityListComponent implements OnInit{
  
  originalEntityList: any[] = [];
  entityList: any[] = [];
 
  constructor(private entitylistService: EntitylistService) {}
 
  ngOnInit() {
    this.loadEntityList();
  }
  loadEntityList() {
    console.log('test');
    this.entitylistService.getEntityList().subscribe(
      (data: any) => {
        console.log('API Response:', data);
        this.originalEntityList = data.result || [];
        this.entityList = [...this.originalEntityList];
        console.log('Entity List:', this.entityList); // Add this line for debugging
      },
      error => {
        console.error('Error fetching entity list:', error);
        // Handle error as needed
      }
    );
  }
  logout() {
    // Your logout logic
    console.log('Logging out...');
  }

  switchView() {
    // Implement switch view logic
    console.log('Switching view...');
  }

  onSearch(searchTerm: string) {
    // Filter entity names based on the search term
    this.entityList = this.originalEntityList.filter(entity =>
      entity.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
}
