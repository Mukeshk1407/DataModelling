import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ToastrService } from '../services/ToastrService';
import { NgForm } from '@angular/forms';
import { EntitylistService } from '../services/entitylist.service';
import { AuthStorageService } from '../services/authstorage.service';
import { ConnectdatabaseComponent } from '../connectdatabase/connectdatabase.component';
import { MatDialog } from '@angular/material/dialog';
import { ColumnDTO } from '../models/ColumnDTO';

@Component({
  selector: 'app-edit-entity',
  templateUrl: './edit-entity.component.html',
  styleUrls: ['./edit-entity.component.css'],
})
export class EditEntityComponent implements OnInit {
 
  @ViewChild('fileInput') fileInput!: ElementRef; // Add this line
 
  entityName!: string;
  minDate: string = '';
  maxDate: string = '';
  isReadOnly: boolean = true;
  columnsList: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private authStorageService: AuthStorageService,
    private dialog: MatDialog,
    private router: Router,
    private toastrService: ToastrService,
    private entitylistService: EntitylistService,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.entityName = params['entityName'];
    });

    this.entitylistService.getColumnsByHostProviderDatabaseTableName(this.entityName).subscribe(
      (data: any) => {
        if (data.isSuccess) {
          this.columnsList = data.result;
          console.log(this.columnsList)
        } else {
        }
      },
      (error) => {
      }
    );
  }

  logout() {
    this.authStorageService.clearAuthInfo();
    this.router.navigate(['']);
  }

  switchView() {
    this.router.navigate(['']);
    const dialogRef = this.dialog.open(ConnectdatabaseComponent, {
      width: '400px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result: string | undefined) => {
      if (result) {
      } else {
      }
    });
  }

  BacktoView() {
    this.router.navigate(['entitylist']);
  }

  NewEntity: any = {
    entityname: '',
    columns : [] as ColumnDTO[]
  };

  validateMinMaxLength(row: any) : boolean {
    if((row.minLength == null && row.maxLength != null) || (row.minLength != null && row.maxLength == null)){
      return true;
    }else if(row.minLength == row.maxLength){
      return true;
    }else if (row.minLength >= row.maxLength) {
      this.toastrService.showError(
        'The column '+ row.columnName + ' minimum length must be smaller than maximum length'
      );
      return false;
    } else if (row.minLength === row.maxLength) {
      this.toastrService.showError(
        'The column ' + row.columnName + ' minimum length must be different from maximum length'
      );
      return false;
    }else{
      return true;
    }
  }

  preventInput(event: Event): void {
    event.preventDefault();
  }

  validateMinMaxRange(row: any) : boolean {
    if((row.minRange == null && row.maxRange != null) || (row.minRange != null && row.maxRange == null)){
      return true;
    }else if(row.minRange == row.maxRange){
      return true;
    }else if (row.minRange >= row.maxRange) {
      this.toastrService.showError(
        'The column '+ row.columnName + ' minimum range must be smaller than maximum range'
      );
      return false;
    } else if (row.minRange === row.maxRange) {
      this.toastrService.showError(
        'The column ' + row.columnName + ' minimum Range must be different from maximum range'
      );
      return false;
    }else{
      return true;
    }
  }

  rowValid(index: number): boolean {
    const row = this.NewEntity.columns[index];
    return !!row.columnName && !!row.datatype;
  }

  onInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const inputValue = inputElement.value;

    const numericValue = parseInt(inputValue, 10);

    if (numericValue < 0) {
      inputElement.value = '';
    }
  }

  preventSubmitOnEnter(event: KeyboardEvent, form: NgForm): void {
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  }

  isStringOrNumber(datatype: string): boolean {
    return ['string', 'int'].includes(datatype);
  }

  validateNumeric(event: any) {
    const keyCode = event.keyCode;
    if (
      [46, 8, 9, 27, 13, 110, 190].indexOf(keyCode) !== -1 ||
      (keyCode === 65 && (event.ctrlKey || event.metaKey)) ||
      (keyCode === 67 && (event.ctrlKey || event.metaKey)) ||
      (keyCode === 86 && (event.ctrlKey || event.metaKey)) ||
      (keyCode === 88 && (event.ctrlKey || event.metaKey))
    ) {
      return;
    }
    if ((keyCode < 48 || keyCode > 57) && (keyCode < 96 || keyCode > 105)) {
      event.preventDefault();
    }
  }

  onDefaultValueInputChange(event: Event, row: any): void {
    const inputElement = event.target as HTMLInputElement;
    if (row.datatype === 'int') {
      inputElement.value = inputElement.value.replace(/[^0-9]/g, '');
    }
  }

  validateDateRange(row: any): boolean {
    if (
      (row.dateMinValue == null && row.dateMaxValue != null) ||
      (row.dateMinValue != null && row.dateMaxValue == null)
    ) {
      return true;
    } else if (row.dateMinValue >= row.dateMaxValue) {
      this.toastrService.showError(
        'The column ' + row.columnName + ' minimum date must be earlier than the maximum date'
      );
      return false;
    } else {
      return true;
    }
  }

  submit(columnsList : any[]) {

    for (const column of columnsList) {
      if (column.datatype == 'integer' || column.datatype == 'smallint'){
        if(!this.validateMinMaxRange(column)){
          return
        }
      }

      if (column.datatype == "character varying"){
        if (!this.validateMinMaxLength(column)) {
          return
        }
      }
      if (column.datatype == 'date' || column.datatype ==  'timestamp with time zone') {
        if (!this.validateDateRange(column)) {
          return
        }
      }
    }

    this.entitylistService.updateTable(columnsList).subscribe(
      (response) => {
        if(response.isSuccess){
          this.router.navigate(['/entitylist']);
          this.toastrService.showSuccess('Table updated successfully');
        }
        else{
          this.toastrService.showError(response.errorMessages);
        }
      },
      (error) => {
        this.toastrService.showError('Error updating table');
      }
    );
  }
}

