export interface TableColumnDTO {
  entityname: string;
  id: number;
  entityColumnName: string;
  entityId:number;
  datatype: string;
  length: number;
  minLength: number;
  maxLength: number;
  minRange: number;
  maxRange: number;
  dateMinValue: string;
  dateMaxValue:string;
  description:String;
  isNullable: boolean;
  defaultValue: string;
  ColumnPrimaryKey: boolean; 
  True: string; 
  False: string; 
  ListEntityId:number;
  ListEntityKey:number;
  ListEntityValue:number;
  S_ListEntityId?: string | null;
  S_ListEntityKey?: string | null;
  S_ListEntityValue?: string | null;
}
