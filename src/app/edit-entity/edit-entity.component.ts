import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ColumnsService } from '../services/create-entity.service';
import { TableColumnDTO } from '../models/TableColumnDTO.model';
import { Router } from '@angular/router';
import { ToastrService } from '../services/ToastrService';
import { SharedDataService } from '../services/log-details.service';
import { NgForm } from '@angular/forms';
import { EntityListDto } from '../models/EntitylistDto.model';
import { EntitylistService } from '../services/entitylist.service';
import { NgZone } from '@angular/core';
import { TableEditColumnDTO } from '../models/TableEditColumnDTO';
import { AuthStorageService } from '../services/authstorage.service';
import { ConnectdatabaseComponent } from '../connectdatabase/connectdatabase.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-entity',
  templateUrl: './edit-entity.component.html',
  styleUrls: ['./edit-entity.component.css'],
})
export class EditEntityComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef; // Add this line
  entityName!: string;
  columns: TableEditColumnDTO[] = [];
  minDate: string = ''; // Initialize minDate variable
  maxDate: string = ''; // I
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
  selectedEntityKeyId: number | null = null;
  selectedKeyvalueId: number | null = null;
  selectedColumnIds: any;
  firstColumnId: number | null = null; // Initialize firstColumnId with a default value of null
  cdr: any;
  isReadOnly: boolean = true;
  entityKeyColumnName: string = '';
  EntityentityName: string = '';
  entityValueColumnName: string = '';
  initiallyHidden: boolean = true;
  secondSetVisible: boolean = false;
  minMaxDatesSelected: boolean = false;
  dateErrorMap: Map<number, boolean> = new Map<number, boolean>();

  constructor(
    private route: ActivatedRoute,
    private authStorageService: AuthStorageService,
    private dialog: MatDialog,
    private columnsService: ColumnsService,
    private router: Router,
    private toastrService: ToastrService,
    private sharedDataService: SharedDataService,
    private entitylistService: EntitylistService,
    private zone: NgZone
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.entityName = params['entityName'];
      this.fetchColumnsData();
      this.fetchEntityIdByName(this.entityName);
    });

    this.entitylistService.getEntityList().subscribe(
      (data: any) => {
        this.listOfValues = data.result;
      },
      (error) => {}
    );

    this.columnsService.getColumnsForEntity(this.entityName).subscribe(
      (data: any) => {
        if (data.isSuccess) {
          // Iterate through columns and fetch data dynamically
          data.result.forEach((columnData: any) => {
            // Extract values from columnData
            const dynamicListEntityId = columnData.listEntityId;
            const dynamicListEntityKey = columnData.listEntityKey;
            const dynamicListEntityValue = columnData.listEntityValue;
            // Call sharedDataService.getEntityData with dynamic values from columnData
            this.sharedDataService
              .getEntityData(
                dynamicListEntityId,
                dynamicListEntityKey,
                dynamicListEntityValue
              )
              .subscribe(
                (entityData) => {
                  this.entityKeyColumnName =
                    entityData.entityKeyColumnName || '';
                  this.EntityentityName = entityData.entityName || '';
                  this.entityValueColumnName =
                    entityData.entityValueColumnName || '';
                },
                (error) => {
                  console.error(error);
                }
              );
          });
          this.columns = data.result.map((columnData: any) => {
            const column: TableColumnDTO = {
              entityname: this.entityName,
              id: columnData.id,
              entityColumnName: columnData.entityColumnName,
              entityId: columnData.entityid,
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
            };
            return column;
          });
        } else {
        }
      },
      (error) => {}
    );
  }
  logout() {
    localStorage.removeItem('logDetailsData');
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
  resetForm(entityForm: NgForm) {
    entityForm.resetForm();
  }
  BacktoView() {
    this.router.navigate(['entitylist']);
  }
  hasColumns(): boolean {
    return this.columns.length > 0;
  }
  openFileInput() {
    const fileInput = this.fileInput.nativeElement;
    fileInput.click();
  }

  goBackToList() {
    this.router.navigate(['/entity-list']);
  }
  fetchEntityIdByName(entityName: string): void {
    this.sharedDataService.getEntityIdByName(entityName).subscribe(
      (response: any) => {
        if (response.isSuccess) {
          this.selectedEntityKeyId = response.result;
          this.columns.forEach((column) => {});
        } else {
          this.toastrService.showError('Error fetching entityId');
        }
      },
      (error) => {
        this.toastrService.showError('Unexpected error fetching entityId');
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
              entityId: columnData.entityid,
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
            };
            return column;
          });
        } else {
        }
      },
      (error) => {}
    );
  }

  toggleNullable(column: TableEditColumnDTO): void {
    column.isNullable = !column.isNullable;
  }

  // Function to toggle the value of isPrimaryKey property
  togglePrimaryKey(column: TableEditColumnDTO): void {
    column.ColumnPrimaryKey = !column.ColumnPrimaryKey;
  }

  selectedDataType: string = 'string';
  NewEntity: any = {
    entityname: '',
    columns: [
      {
        columnName: '',
        datatype: 'string',
        length: 0,
        isNullable: false,
        True: '',
        False: '',
        ColumnPrimaryKey: false,
        defaultValue: '',
        description: '',
        minLength: '',
        maxLength: '',
        minRange: '',
        maxRange: '',
        dateMinValue: '',
        dateMaxValue: '',
        ListEntityId: this.selectedEntity,
        ListEntityKey: this.firstColumnId,
        ListEntityValue: this.selectedKeyvalueId,
      },
    ],
  };
  Editcolumns: any[] = [];
  // Function to add a new row
  addNewRow() {
    const newRow: TableEditColumnDTO = {
      entityname: '',
      id: 0,
      entityId: 0,
      entityColumnName: '',
      datatype: 'string',
      length: 0,
      isNullable: false,
      True: '',
      False: '',
      ColumnPrimaryKey: false,
      defaultValue: '',
      description: '',
      minLength: '',
      maxLength: '',
      minRange: '',
      maxRange: '',
      dateMinValue: '',
      dateMaxValue: '',
    };
    this.columns.push(newRow);
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
      this.fetchSelectedEntityColumns(entityName);
      this.NewEntity.columns[rowIndex].selectedEntity = entityName;
    });
  }
  selectedEntity2Indexs: number | null = null;

  updateSelectedId(index: number) {
    if (index !== null && index >= 0 && index < this.selectedColumnIds.length) {
      this.selectedKeyvalueId = this.selectedColumnIds[index];
    } else {
      this.selectedKeyvalueId = null; // Handle the case when the index is out of range
    }
  }
  showDropdowns() {
    this.initiallyHidden = false;
  }
  showSecondSet() {
    this.secondSetVisible = true;
  }
  validateMinMax(row: any) {
    if (row.minLength >= row.maxLength) {
      this.toastrService.showError('Min value must be smaller than Max value');
      row.minLength = null;
      row.maxLength = null;
    } else if (row.minLength === row.maxLength) {
      this.toastrService.showError(
        'Minimum length must be different from Maximum length'
      );
      row.minLength = null;
      row.maxLength = null;
    }
  }

  onDataTypeChange(row: any) {
    if (row.datatype === 'string') {
      row.minRange = null;
      row.maxRange = null;
    } else if (row.datatype === 'int') {
      row.minLength = null;
      row.maxLength = null;
    }
  }

  // In your component
  validateDateRange(row: any, index: number) {
    const minDate = new Date(row.dateMinValue);
    const maxDate = new Date(row.dateMaxValue);
    const defaultDate = new Date(row.defaultValue);

    if (defaultDate < minDate || defaultDate > maxDate) {
      this.dateErrorMap.set(index, true);
    } else {
      this.dateErrorMap.set(index, false);
    }
  }

  preventInput(event: Event): void {
    event.preventDefault();
  }
  validateMinMaxRange(row: any) {
    if (row.minRange >= row.maxRange) {
      this.toastrService.showError(
        'Min value must be smaller than Max value',
        'Validation Error'
      );
      row.minRange = null;
      row.maxRange = null;
    } else if (row.minRange === row.maxRange) {
      this.toastrService.showError(
        'Minimum Range must be different from Maximum Range'
      );
      row.minRange = null;
      row.maxRange = null;
    }
    row.minRange = row.minRange ?? 0;
    row.maxRange = row.maxRange ?? 0;
  }
  calculateDefaultDate(dateMinValue: string, dateMaxValue: string): string {
    const defaultDate = new Date(
      (new Date(dateMinValue).getTime() + new Date(dateMaxValue).getTime()) / 2
    );
    return defaultDate.toISOString().substring(0, 10);
  }
  setInitialDateValue(row: any) {
    if (row.datatype === 'date') {
      row.defaultValue = this.calculateDefaultDate(
        row.dateMinValue,
        row.dateMaxValue
      );
    }
  }

  validateDefaultDate(row: any) {
    if (row.datatype === 'date') {
      const defaultDate = new Date(row.defaultValue);
      const dateMinValue = new Date(row.dateMinValue);
      const dateMaxValue = new Date(row.dateMaxValue);

      if (defaultDate < dateMinValue || defaultDate > dateMaxValue) {
        row.defaultValue = this.calculateDefaultDate(
          row.dateMinValue,
          row.dateMaxValue
        );
        this.toastrService.showError(
          'Default Date must be within the range of Min Date and Max Date',
          'Validation Error'
        );
      }
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
  onMinDateChange(event: Event, row: any): void {
    const inputElement = event.target as HTMLInputElement;
    this.minDate = inputElement.value;
  }

  onMaxDateChange(event: Event, row: any): void {
    const inputElement = event.target as HTMLInputElement;
    this.maxDate = inputElement.value;
  }

  closeModal() {
    this.showModal = false;
  }
  deleteRow(index: number, event: Event) {
    event.preventDefault();
    if (this.columns.length > 1) {
      this.columns.splice(index, 1);
    }
  }

  rowValid(index: number): boolean {
    const row = this.NewEntity.columns[index];
    return !!row.columnName && !!row.datatype;
  }
  hasDuplicateColumnNames(): boolean {
    const columnNames = new Set<string>();
    for (const row of this.columns) {
      if (row.entityColumnName && columnNames.has(row.entityColumnName)) {
        return true;
      }
      columnNames.add(row.entityColumnName);
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
    for (const row of this.columns) {
      if (row.ColumnPrimaryKey) {
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
  isStringOrNumber(datatype: string): boolean {
    return ['string', 'int'].includes(datatype);
  }

  onPrimaryKeyChange(event: Event, row: any): void {
    if (row.ColumnPrimaryKey) {
      row.defaultValue = '';
    }
    if (row.minLength) {
      row.defaultValue = '';
    }
    if (row.maxLength) {
      row.defaultValue = '';
    }
    if (row.minRange) {
      row.defaultValue = '';
    }
    if (row.maxRange) {
      row.defaultValue = '';
    }
    if (row.dateMinValue) {
      row.defaultValue = '';
    }
    if (row.dateMaxValue) {
      row.defaultValue = '';
    }
    const isStringOrNumber = ['string', 'int'].includes(row.datatype);
    if (row.ColumnPrimaryKey && isStringOrNumber) {
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
  updateMinMaxDatesStatus(): void {
    this.minMaxDatesSelected = !!this.minDate && !!this.maxDate;
  }
  onDefaultValueInputChange(event: Event, row: any): void {
    const inputElement = event.target as HTMLInputElement;
    if (row.datatype === 'int') {
      inputElement.value = inputElement.value.replace(/[^0-9]/g, '');
    }
  }

  isEntityNameValid(): boolean {
    const entityNameInput = this.columns;
    return /^[a-zA-Z][a-zA-Z0-9]*$/.test(this.entityName);
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

  submit() {
    const errorMessages: string[] = [];
    const reservedKeywordFound =
      this.isReservedKeyword(this.NewEntity.entityname) ||
      this.NewEntity.columns.some((column: { columnName: string }) =>
        this.isReservedKeyword(column.columnName)
      );
    if (reservedKeywordFound) {
      this.toastrService.showError(
        'Entity or column name cannot be a reserved keyword.'
      );
      return;
    }

    for (const column of this.NewEntity.columns) {
      if (
        column.datatype === 'int' &&
        column.maxLength !== null &&
        column.minLength !== null &&
        column.minLength !== '' &&
        column.maxLength !== ''
      ) {
        const minLength = parseInt(column.minLength);
        const maxLength = parseInt(column.maxLength);
        if (minLength === 0 || maxLength === 0) {
          errorMessages.push('Min Length and Max Length cannot both be 0.');
          this.toastrService.showError(
            'Min Length and Max Length cannot both be 0.'
          );
        } else if (maxLength <= minLength) {
          errorMessages.push('Max Length must be higher than Min Length.');
          this.toastrService.showError(
            'Max Length must be higher than Min Length.'
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
    for (const column of this.NewEntity.columns) {
      if (
        column.datatype === 'date' &&
        column.dateMaxValue <= column.dateMinValue
      ) {
        errorMessages.push('Max Date must be after Min Date.');
        this.toastrService.showError('Max Date must be after Min Date.');
      }
    }

    if (!this.isEntityNameValid()) {
      errorMessages.push('Entity Name pattern is invalid');
      this.toastrService.showError('Entity Name patern is invalid');
    }

    if (this.hasDuplicateColumnNames()) {
      errorMessages.push('Duplicate column names are not allowed.');
      this.toastrService.showError('Duplicate column names are not allowed.');
    }

    if (!this.hasExactlyOnePrimaryKey()) {
      errorMessages.push('Exactly one Primary Key is required.');
      this.toastrService.showError('Exactly one Primary Key is required.');
    }

    const databaseDetailsString = localStorage.getItem('databaseDetails');
    const databaseDetails = JSON.parse(databaseDetailsString || '{}');
    if (errorMessages.length > 0) {
      for (const errorMessage of errorMessages) {
      }
    } else {
      const filteredColumns = this.columns.map((column) => ({
        entityColumnName: column.entityColumnName,
        datatype: column.datatype,
        length: column.length,
        isNullable: column.isNullable,
        True: column.True,
        False: column.False,
        columnPrimaryKey: column.ColumnPrimaryKey,
        defaultValue: column.defaultValue,
        description: column.description,
        minLength: parseInt(column.minLength) || 0,
        maxLength: parseInt(column.maxLength) || 0,
        minRange: parseInt(column.minRange) || 0,
        maxRange: parseInt(column.maxRange) || 0,
        dateMinValue: column.dateMinValue,
        dateMaxValue: column.dateMaxValue,
        listEntityId: parseInt(this.selectedEntity) || 0,
        listEntityKey: this.firstColumnId || 0,
        listEntityValue: this.selectedKeyvalueId || 0,
        hostName: databaseDetails?.hostname || '',
        databaseName: databaseDetails?.databaseName || '',
      }));
      const backendRequest = {
        entityName: this.entityName,
        entityId: this.selectedEntityKeyId || 0, // Include EntityId in the request
        update: {
          propertiesList: filteredColumns,
        },
      };
      this.sharedDataService.updateEntityColumn(backendRequest).subscribe(
        (response) => {
          if (response.isSuccess) {
            this.toastrService.showSuccess('Entity updated successfully');
            this.router.navigate(['/entity-list']);
          } else {
            this.toastrService.showError('Error updating entity column');
          }
          this.router.navigate(['/entity', backendRequest.entityName]);
        },
        (error) => {
          this.toastrService.showError(
            'Unexpected error updating entity column'
          );
        }
      );
    }
  }
}
