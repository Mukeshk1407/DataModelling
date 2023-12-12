import { Component } from '@angular/core';

@Component({
  selector: 'app-entity-list',
  templateUrl: './entity-list.component.html',
  styleUrls: ['./entity-list.component.css']
})
export class EntityListComponent {
  originalEntityList: string[] = [
    'Entity 1',
    'Entity 2',
    'Entity 3',
    'Entity 4',
    'Entity 5',
    'Entity 6',
    'Entity 7',
    'Entity 8',
    'Entity 9',
    'Entity 10',
    'Entity 11',
    'Entity 12',
    // Add more entity names as needed
  ];

  entityList: string[] = [...this.originalEntityList];

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
