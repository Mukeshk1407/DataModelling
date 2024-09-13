import { TableMetaDataDTO } from './TableMetaDataDTO';
import { ColumnDTO } from './ColumnDTO';

export interface TableRequest {
  Table: TableMetaDataDTO;
  Columns: ColumnDTO[];
}
