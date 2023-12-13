export interface TableEditColumnDTO {
    entityname: string;
    id: number;
    entityColumnName: string;
    entityId:number;
    datatype: string;
    length: number;
    minLength: string;
    maxLength: string;
    minRange: string;
    maxRange: string;
    dateMinValue: string;
    dateMaxValue:string;
    description:String;
    isNullable: boolean;
    defaultValue: string;
    ColumnPrimaryKey: boolean; 
    True: string; 
    False: string; 
  }