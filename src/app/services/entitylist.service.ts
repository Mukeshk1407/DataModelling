import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TableMetaDataDTO } from '../models/TableMetaDataDTO';
import { ColumnDTO } from '../models/ColumnDTO';
import { DBConnectionDTO } from '../models/DBConnectionDTO';
import { TableRequest } from '../models/TableRequest';

@Injectable({
  providedIn: 'root',
})
export class EntitylistService {
  private apiUrlGateway = 'https://localhost:7046/EntitySchema/';

  constructor(private http: HttpClient) {}

  // Endpoint: /EntitySchema/tables
  getAllTables(): Observable<TableMetaDataDTO[]> {
    const endpoint = `${this.apiUrlGateway}tables`;
    return this.http.get<TableMetaDataDTO[]>(endpoint);
  }

  // Endpoint: /EntitySchema/tables/{id}
  getTableById(id: number): Observable<TableMetaDataDTO> {
    const endpoint = `${this.apiUrlGateway}tables/${id}`;
    return this.http.get<TableMetaDataDTO>(endpoint);
  }

  // Endpoint: /EntitySchema/tables/{hostName}/{provider}/{databaseName}
  //  Tablelist in UI
  getTablesByHostProviderDatabase(): Observable<TableMetaDataDTO[]> {
    // Retrieve details from localStorage
    var databaseDetailsString = localStorage.getItem('databaseDetails');
    var databaseDetails = JSON.parse(databaseDetailsString || '{}');
    // Populate values or use 'null' as fallback
    var hostName = databaseDetails?.hostname || 'null';
    var databaseName = databaseDetails?.databaseName || 'null';
    var provider = databaseDetails?.provider || 'null';
    var accessKey = databaseDetails?.accessKey || 'null';
    var secretkey = databaseDetails?.secretkey || 'null';
    var region = databaseDetails?.region || 'null';
    var keyspace = databaseDetails?.keyspace || 'null';
    var ec2Instance = databaseDetails?.ec2Instance || 'null';
    var ipAddress = databaseDetails?.ipAddress || 'null';

    // Construct the query string URL
    const endpoint = `${this.apiUrlGateway}tables/GetTablesByHostProviderDatabase?hostName=${hostName}&provider=${provider}&databaseName=${databaseName}&accessKey=${accessKey}&secretkey=${secretkey}&region=${region}&keyspace=${keyspace}&ec2Instance=${ec2Instance}&ipAddress=${ipAddress}`;
    // Make the API request
    return this.http.get<TableMetaDataDTO[]>(endpoint);
    
  }

  // Endpoint: /EntitySchema/tables/{hostName}/{provider}/{databaseName}/{tableName}
  getTableByHostProviderDatabaseTableName(
    tableName: string
  ): Observable<TableMetaDataDTO> {
    var databaseDetailsString = localStorage.getItem('databaseDetails');
    var databaseDetails = JSON.parse(databaseDetailsString || '{}');
    var hostName = databaseDetails?.hostname || '';
    var databaseName = databaseDetails?.databaseName || '';
    var provider = databaseDetails?.provider || '';
    const endpoint = `${this.apiUrlGateway}tables/${hostName}/${provider}/${databaseName}/${tableName}`;
    console.log("Dbconnect2",endpoint);
    return this.http.get<TableMetaDataDTO>(endpoint);
  }

  // Endpoint: /EntitySchema/columns
  getAllColumns(): Observable<ColumnDTO[]> {
    const endpoint = `${this.apiUrlGateway}columns`;
  
    return this.http.get<ColumnDTO[]>(endpoint);
    
  }

  // Endpoint: /EntitySchema/columns/{id}
  getColumnById(id: number): Observable<ColumnDTO> {
    const endpoint = `${this.apiUrlGateway}columns/${id}`;
   
    return this.http.get<ColumnDTO>(endpoint);
  }

  // Endpoint: /EntitySchema/columns/{id}/{entityid}
  getColumnByIdAndEntityId(
    id: number,
    entityid: number
  ): Observable<ColumnDTO> {
    const endpoint = `${this.apiUrlGateway}columns/${id}/${entityid}`;
   
    return this.http.get<ColumnDTO>(endpoint);
  }

  // Endpoint: /EntitySchema/columns/entity/{entityId}
  getColumnsByEntityId(entityId: number): Observable<ColumnDTO[]> {
    const endpoint = `${this.apiUrlGateway}columns/entity/${entityId}`;
    
    return this.http.get<ColumnDTO[]>(endpoint);
  }

  // Set values for DBConnectionDTO properties based on local storage
  private setDBConnectionDTOFromLocalStorage(): DBConnectionDTO {
    const databaseDetailsString = localStorage.getItem('databaseDetails');
    const databaseDetails1 = JSON.parse(databaseDetailsString || '{}');
    const connectionDTO: DBConnectionDTO = {
      Provider: databaseDetails1?.provider || '',
      HostName: databaseDetails1?.hostname || '',
      DataBase: databaseDetails1?.databaseName || '',
      UserName: databaseDetails1?.username || '',
      Password: databaseDetails1?.password || '',
    };

    return connectionDTO;
  }

  // Endpoint: /EntitySchema/updatetables
  updateTable(columns: ColumnDTO[]): Observable<any> {
    const endpoint = `${this.apiUrlGateway}updatetables`;
    return this.http.post<any>(endpoint, columns);
  }

  // Endpoint: /EntitySchema/createtables
  insertTable(tableRequest: TableRequest): Observable<any> {
    console.log('ServiceFile', tableRequest);
    const connectionDTO = this.setDBConnectionDTOFromLocalStorage();
    const endpoint = `${this.apiUrlGateway}createtables`;
    return this.http.post<any>(endpoint, tableRequest, {
      params: connectionDTO as any,
    });
  }

  // Endpoint: /EntitySchema/cliententity
  getClientEntity(): Observable<any> {
    const connectionDTO = this.setDBConnectionDTOFromLocalStorage();
    const endpoint = `${this.apiUrlGateway}cliententity`;
    return this.http.get<any>(endpoint, { params: connectionDTO as any });
  }

  // Endpoint: /EntitySchema/getColumnsByHostProviderDatabaseTableName
  getColumnsByHostProviderDatabaseTableName(
    tableName: string
  ): Observable<ColumnDTO[]> {
    const connectionDTO = this.setDBConnectionDTOFromLocalStorage();
   const encodedHostName = encodeURIComponent(connectionDTO.HostName);
    const endpoint = `${this.apiUrlGateway}columns/${encodedHostName}/${connectionDTO.Provider}/${connectionDTO.DataBase}/${tableName}`;
    console.log("column",endpoint)
    return this.http.get<ColumnDTO[]>(endpoint, { params: connectionDTO as any });
  }
}
