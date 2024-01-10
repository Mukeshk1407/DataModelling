import { Component, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ColumnInputServiceService } from '../services/column-input-service.service';
import { ToastrService } from '../services/ToastrService';
import { NgForm } from '@angular/forms';
import { ColumnsService } from '../services/create-entity.service';
import { EntityListDto } from '../models/EntitylistDto.model';
import { EntitylistService } from '../services/entitylist.service';
import { NgZone } from '@angular/core';
import { AuthStorageService } from '../services/authstorage.service';
import { ConnectdatabaseComponent } from '../connectdatabase/connectdatabase.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-create-entity',
  templateUrl: './create-entity.component.html',
  styleUrls: ['./create-entity.component.css'],
})
export class CreateEntityComponent {
  minDate: string = ''; // Initialize minDate variable
  maxDate: string = '';
  entityForm: any;
  showModal: boolean = false;
  showAdditionalInputs: boolean = false;
  additionalInput1: string = '';
  additionalInput2: string = '';
  selectedEntity: string = '';
  selectedEntitys: string = '';
  SelectedEntityName: string = '';
  @Input() selectedEntityColumns: any; // Assuming selectedEntityColumns is an input
  listOfValues: EntityListDto[] = [];
  entityColumnNames1: string[] = []; // Array for the first dropdown
  entityColumnNames2: string[] = []; // Array for the second dropdown
  selectedEntity2: string | null = null;
  selectedEntity2Index: number | null = null;
  selectedKeyId: number | null = null;
  selectedColumnIds: any;
  firstColumnId: number | null = null; // Initialize firstColumnId with a default value of null
  cdr: any;
  minMaxDatesSelected: boolean = false;
  showPopup: boolean | undefined;

  constructor(
    private toastrService: ToastrService,
    private authStorageService: AuthStorageService,
    private dialog: MatDialog,
    private router: Router,
    private columnInputService: ColumnInputServiceService,
    private columnsService: ColumnsService,
    private entitylistService: EntitylistService,
    private zone: NgZone
  ) {}

  selectedDataType: string = 'string';
  newEntity: any = {
    entityname: '',
    columns: [
      {
        columnName: '',
        datatype: 'char',
        length: 0,
        isNullable: false,
        true: '',
        false: '',
        primaryKey: false,
        defaultValue: '',
        description: '',
        minLength: '',
        maxLength: '',
        MinRange: '',
        MaxRange: '',
        dateminValue: '',
        datemaxValue: '',
        ListEntityId: 0,
        ListEntityKey: 0,
        ListEntityValue: 0,
      },
    ],
  };

  // Function to add a new row
  addNewRow() {
    this.newEntity.columns.push({
      columnName: '',
      datatype: 'char',
      length: 0,
      isNullable: false,
      true: '',
      false: '',
      primaryKey: false,
      defaultValue: '',
      description: '',
      minLength: '',
      maxLength: '',
      MinRange: '',
      MaxRange: '',
      dateminValue: '',
      datemaxValue: '',
      ListEntityId: 0,
      ListEntityKey: 0,
      ListEntityValue: 0,
    });
    if (this.entityForm) {
      this.entityForm.form.updateValueAndValidity();
    }
  }
  BacktoView() {
    this.router.navigate(['entitylist']);
  }
  ngOnInit(): void {
    const storedFormData = localStorage.getItem('formData');
    if (storedFormData) {
      this.newEntity = JSON.parse(storedFormData);
      const deletionTimeout = 10 * 60 * 1000;
      setTimeout(() => {
        localStorage.removeItem('formData');
      }, deletionTimeout);
    }
    this.entitylistService.getEntityList().subscribe(
      (data: any) => {
        this.listOfValues = data.result;
      },
      (error) => {}
    );
  }
  toggleCheckbox(id: string): void {
    const checkbox = document.getElementById(id) as HTMLInputElement;
    if (checkbox) {
      checkbox.checked = !checkbox.checked;
    }
  }
  toggleCheckbox1(id: string): void {
    const checkbox = document.getElementById(id) as HTMLInputElement;
    if (checkbox) {
      checkbox.checked = !checkbox.checked;
    }
  }
  showBooleanPopup: boolean = false;
  onListValueSelected(entityName: string, rowIndex: number) {
    this.zone.run(() => {
      this.selectedEntity = entityName;
      this.SelectedEntityName = this.selectedEntity;
      // Fetch columns for the selected entity
      this.columnsService
        .getColumnsForEntity(this.selectedEntity)
        .subscribe((columns) => {
          this.entityColumnNames1 = columns.map(
            (column) => column.entityColumnName
          );
          this.entityColumnNames2 = columns.map(
            (column) => column.entityColumnName
          );
        });
      // Fetch columns for the selected entity
      this.fetchSelectedEntityColumns(entityName);
      // Update the row's selectedEntity property if needed
      // this.newEntity.columns[rowIndex].selectedEntity = entityName;
    });
  }
  selectedEntity2Indexs: number | null = null;

  updateSelectedId(index: number) {
    if (index !== null && index >= 0 && index < this.selectedColumnIds.length) {
      this.selectedKeyId = this.selectedColumnIds[index];
    } else {
      this.selectedKeyId = null; // Handle the case when the index is out of range
    }
  }

  fetchSelectedEntityColumns(entityName: string) {
    this.columnsService.getColumnsForEntity(entityName).subscribe(
      (data: any) => {
        if (data && data.result) {
          this.selectedEntityColumns = data.result.map(
            (column: any) => column.entityColumnName
          );
          this.selectedEntity = data.result[0].entityId;
          this.selectedColumnIds = data.result.map((column: any) => column.id);
          this.firstColumnId = this.selectedColumnIds[0];
          this.entityColumnNames1 = this.selectedEntityColumns;
          this.entityColumnNames2 = this.selectedEntityColumns;
        } else {
        }
      },
      (error) => {}
    );
  }

  onValueSelected() {
    if (this.selectedEntity2 !== null) {
      this.selectedEntity2Index = this.entityColumnNames2.indexOf(
        this.selectedEntity2
      );
    }
  }
  preventInput(event: Event): void {
    event.preventDefault();
  }
  onMinDateChange(event: Event, row: any): void {
    const inputElement = event.target as HTMLInputElement;
    this.minDate = inputElement.value;
    this.updateMinMaxDatesStatus();
  }
  onMaxDateChange(event: Event, row: any): void {
    const inputElement = event.target as HTMLInputElement;
    this.maxDate = inputElement.value;
    this.updateMinMaxDatesStatus();
  }
  updateMinMaxDatesStatus(): void {
    this.minMaxDatesSelected = !!this.minDate && !!this.maxDate;
  }

  onDataTypeChange(row: any): void {
    row.length = '';
    this.showModal = false;
    this.showAdditionalInputs = false;
    if (row.datatype === 'boolean') {
      this.showModal = true;
      this.showAdditionalInputs = true;
    }

    if (
      row.datatype === 'int' ||
      row.datatype === 'boolean' ||
      row.datatype === 'char' ||
      row.datatype === 'date' ||
      row.datatype === 'bytea' ||
      row.datatype === 'timestamp'
    ) {
      row.length = '';
    }
    if (row.datatype === 'string' || row.datatype === 'int') {
      row.enableprimaryKey = true; // Enable the Primary Key checkbox
      row.primaryKey = false; // Reset the Primary Key checkbox
    } else {
      row.enableprimaryKey = false; // Disable the Primary Key checkbox for other data types
      row.primaryKey = false; // Reset the Primary Key checkbox
    }
    if (row.datatype !== 'boolean') {
      row.true = '';
      row.false = '';
    }
  }
  closeModal() {
    this.showModal = false;
  }
  deleteRow(index: number, event: Event) {
    event.preventDefault();
    if (this.newEntity.columns.length > 1) {
      this.newEntity.columns.splice(index, 1);
    }
  }
  rowValid(index: number): boolean {
    const row = this.newEntity.columns[index];
    return !!row.columnName && !!row.datatype;
  }
  hasDuplicateColumnNames(): boolean {
    const columnNames = new Set<string>();
    for (const row of this.newEntity.columns) {
      if (row.columnName && columnNames.has(row.columnName)) {
        return true;
      }
      columnNames.add(row.columnName);
    }
    return false;
  }
  onInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const inputValue = inputElement.value;

    const numericValue = parseInt(inputValue, 10);

    if (numericValue < 0) {
      inputElement.value = '';
    }
  }
  // Function to check if there's exactly one primary key
  hasExactlyOnePrimaryKey(): boolean {
    let primaryKeyCount = 0;
    for (const row of this.newEntity.columns) {
      if (row.primaryKey) {
        primaryKeyCount++;
      }
    }
    return primaryKeyCount === 1;
  }
  preventSubmitOnEnter(event: KeyboardEvent, form: NgForm): void {
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  }
  onPrimaryKeyChange(event: Event, row: any): void {
    if (
      row.primaryKey ||
      row.minLength ||
      row.maxLength ||
      row.MinRange ||
      row.MaxRange ||
      row.dateminValue ||
      row.datemaxValue
    ) {
      row.defaultValue = '';
    }
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

  isEntityNameValid(): boolean {
    const entityNameInput = this.newEntity.entityname;
    return /^[a-zA-Z][a-zA-Z0-9]*$/.test(entityNameInput);
  }

  reservedKeywords: string[] = [
    'abort',
    'asc',
    'between',
    'case',
    'create',
    'database',
    'delete',
    'desc',
    'drop',
    'false',
    'from',
    'full',
    'group',
    'having',
    'insert',
    'into',
    'is',
    'join',
    'left',
    'like',
    'limit',
    'not',
    'null',
    'on',
    'order',
    'primary',
    'references',
    'right',
    'select',
    'set',
    'table',
    'then',
    'true',
    'update',
    'values',
    'where',
    'and',
    'or',
    'innerjoin',
    'leftjoin',
    'rightjoin',
    'orderby',
    'groupby',
    'create',
    'alter',
    'primarykey',
    'foreignkey',
  ];
  isReservedKeyword(name: string): boolean {
    return this.reservedKeywords.includes(name.toLowerCase());
  }

  logout() {
    this.authStorageService.clearAuthInfo();
    this.router.navigate(['']);
    window.location.reload();
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

  submit() {
    localStorage.setItem('formData', JSON.stringify(this.newEntity));
    const errorMessages: string[] = [];
    const reservedKeywordFound =
      this.isReservedKeyword(this.newEntity.entityname) ||
      this.newEntity.columns.some((column: { columnName: string }) =>
        this.isReservedKeyword(column.columnName)
      );
    if (reservedKeywordFound) {
      this.toastrService.showError(
        'Entity or column name cannot be a reserved keyword.'
      );
      return;
    }
    for (const column of this.newEntity.columns) {
      if (
        column.datatype === 'int' &&
        column.MaxRange !== null &&
        column.MinRange !== null &&
        column.MinRange !== '' &&
        column.MaxRange !== ''
      ) {
        const minRange = parseInt(column.MinRange);
        const maxRange = parseInt(column.MaxRange);
        if (minRange === 0 || maxRange === 0) {
          errorMessages.push('Min Range and Max Range cannot both be 0.');
          this.toastrService.showError(
            'Min Range and Max Range cannot both be 0.'
          );
        } else if (maxRange <= minRange) {
          errorMessages.push('Max Range must be higher than Min Range.');
          this.toastrService.showError(
            'Max Range must be higher than Min Range.'
          );
        }
      }

      if (
        column.datatype === 'string' &&
        column.maxLength !== null &&
        column.minLength !== null &&
        column.minLength !== '' &&
        column.maxLength !== ''
      ) {
        const minLength = parseInt(column.minLength);
        const maxLength = parseInt(column.maxLength);
        if (minLength === 0 || maxLength === 0) {
          errorMessages.push('Min Length and Max Length cannot be 0.');
          this.toastrService.showError(
            'Min Length and Max Length cannot be 0.'
          );
        } else if (maxLength <= minLength) {
          errorMessages.push('Max Length must be higher than Min Length.');
          this.toastrService.showError(
            'Max Length must be higher than Min Length.'
          );
        }
      }
    }
    for (const column of this.newEntity.columns) {
      if (
        column.datatype === 'date' &&
        column.datemaxValue <= column.dateminValue
      ) {
        errorMessages.push('Max Date must be after Min Date.');
        this.toastrService.showError('Max Date must be after Min Date.');
      }
    }
    for (let i = 0; i < this.newEntity.columns.length; i++) {
      const row = this.newEntity.columns[i];
      if (row.datatype === 'boolean') {
        const trueValue = row.true;
        const falseValue = row.false;
      }
    }
    if (!this.newEntity.entityname) {
      errorMessages.push('Entity Name is required.');
      this.toastrService.showError('Entity Name is required.');
    } else if (!this.isEntityNameValid()) {
      errorMessages.push('Entity Name pattern is invalid');
      this.toastrService.showError('Entity Name pattern is invalid');
    }

    if (this.hasDuplicateColumnNames()) {
      errorMessages.push('Duplicate column names are not allowed.');
      this.toastrService.showError('Duplicate column names are not allowed.');
    }

    if (!this.hasExactlyOnePrimaryKey()) {
      errorMessages.push('Exactly one Primary Key is required.');
      this.toastrService.showError('Exactly one Primary Key is required.');
    }

    if (errorMessages.length > 0) {
      for (const errorMessage of errorMessages) {
      }
    } else {
      const formData = {
        entityname: this.newEntity.entityname,
        columns: this.newEntity.columns,
      };

      const backendRequest = {
        tableName: formData.entityname,
        hostName: '',
        databaseName: '',
        provider: '',
        columns: formData.columns.map((columns: any) => {
          return {
            entityColumnName: columns.columnName,
            dataType: columns.datatype,
            length: columns.length || 0,
            true: columns.true,
            false: columns.false,
            isNullable: columns.isNullable,
            defaultValue: columns.defaultValue,
            columnPrimaryKey: columns.primaryKey,
            description: columns.description,
            minLength: parseInt(columns.minLength),
            maxLength: parseInt(columns.maxLength),
            maxRange: parseInt(columns.MaxRange),
            minRange: parseInt(columns.MinRange),
            dateMinValue: columns.dateminValue,
            dateMaxValue: columns.datemaxValue,
            listEntityId: parseInt(this.selectedEntity) || 0,
            listEntityKey: this.firstColumnId || 0,
            listEntityValue: this.selectedKeyId || 0,
          };
        }),
      };

      const databaseDetailsString = localStorage.getItem('databaseDetails');
      const databaseDetails = JSON.parse(databaseDetailsString || '{}');

      // Assign the values to backendRequest
      backendRequest.hostName = databaseDetails?.hostname || '';
      backendRequest.databaseName = databaseDetails?.databaseName || '';
      backendRequest.provider = databaseDetails?.selectedContent || '';

      this.columnInputService.createTable(backendRequest).subscribe(
        (response) => {
          // Handle success response if needed
          this.toastrService.showSuccess('Entity created successfully');
          this.router.navigate(['/entity-list']);
        },
        (error) => {
          // Handle error response and display error message
          this.toastrService.showError('Error creating table: ' + error);
        }
      );

      localStorage.removeItem('formData');
    }
  }
}
