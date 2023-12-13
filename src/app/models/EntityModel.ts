export interface EntityModel {
    id: number;
    columnName: string;
    datatype: string;
    length: number;
    isNullable: boolean;
    defaultValue: string;
    isPrimaryKey: boolean;
    description: string;
    minLength:number | null,
    maxLength:number | null,
    dateminValue:string,
      datemaxValue:string,
      true:string,
      false:string,
  }