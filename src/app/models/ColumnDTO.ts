export interface ColumnDTO {
    Id: number;
    ColumnName: string;
    Datatype: string;
    IsPrimaryKey: boolean;
    IsForeignKey: boolean;
    EntityId: number;
    ReferenceEntityID?: number | null;
    ReferenceColumnID?: number | null;
    Length?: number | null;
    MinLength?: number | null;
    MaxLength?: number | null;
    MaxRange?: number | null;
    MinRange?: number | null;
    DateMinValue?: string | null;
    DateMaxValue?: string | null;
    Description?: string;
    IsNullable: boolean;
    DefaultValue?: string;
    True?: string | null;
    False?: string | null;
  }
  