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
    console.log('databaseDetailsString', databaseDetailsString);
    var databaseDetails = JSON.parse(databaseDetailsString || '{}');
    var hostName = databaseDetails?.hostname || 'null';
    var databaseName = databaseDetails?.databaseName || 'null';
    var provider = databaseDetails?.provider || 'null';
    var accessKey = databaseDetails?.accessKey || 'null';
    var secretkey = databaseDetails?.secretKey || 'null';
    var region = databaseDetails?.region || 'null';
    var InfluxDbToken = databaseDetails?.influxDbToken || 'null';
    var InfluxDbOrgId = databaseDetails?.influxDbOrgId || 'null';
    var InfluxDbBucket = databaseDetails?.influxDbBucket || 'null';
    var InfluxDbURL = databaseDetails?.influxDbURL || 'null';
    var ipAddress = databaseDetails?.iPAddress || 'null';
    var keyspace = databaseDetails?.keyspace || 'null';
    var ec2Instance = databaseDetails?.ec2Instance || 'null';
    var Port = databaseDetails?.port || 0;
    // Construct the query string URL
    const endpoint = `${this.apiUrlGateway}tables/GetTablesByHostProviderDatabase?hostName=${hostName}&provider=${provider}&databaseName=${databaseName}&accessKey=${accessKey}&secretkey=${secretkey}&region=${region}&keyspace=${keyspace}&ec2Instance=${ec2Instance}&ipAddress=${ipAddress}&influxDbToken=${InfluxDbToken}&influxDbOrg=${InfluxDbOrgId}&influxDbUrl=${InfluxDbURL}&influxDbBucket=${InfluxDbBucket}&port=${Port}`;
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
      Provider: databaseDetails1?.provider || 'null',
      HostName: databaseDetails1?.hostname || 'null',
      DataBase: databaseDetails1?.databaseName || 'null',
      UserName: databaseDetails1?.username || 'null',
      Password: databaseDetails1?.password || 'null',
      AccessKey: databaseDetails1?.accessKey || 'null',
      SecretKey: databaseDetails1?.secretKey || 'null',
      Region: databaseDetails1?.region || 'null',
      InfluxDbToken: databaseDetails1?.influxDbToken || 'null',
      InfluxDbOrg: databaseDetails1?.influxDbOrgId || 'null',
      InfluxDbBucket: databaseDetails1?.influxDbBucket || 'null',
      InfluxDbUrl: databaseDetails1?.influxDbUrl || 'null',
      IPAddress: databaseDetails1?.ipAddress || 'null',
      Ec2Instance: databaseDetails1?.ec2Instance || 'null',
      Keyspace: databaseDetails1?.keyspace || 'null',
      Port: databaseDetails1?.port || 0,
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
  // getColumnsByHostProviderDatabaseTableName(
  //   tableName: string
  // ): Observable<ColumnDTO[]> {
  //   const connectionDTO = this.setDBConnectionDTOFromLocalStorage();
  //   const encodedHostName = encodeURIComponent(connectionDTO.HostName || '');
  //   const endpoint = `${this.apiUrlGateway}columns/GetColumnsByHostProviderDatabaseTableName?${encodedHostName}/${connectionDTO.Provider}/${connectionDTO.DataBase}/${tableName}/${connectionDTO.AccessKey}/${connectionDTO.SecretKey}/${connectionDTO.Region}/${connectionDTO.InfluxDbToken}/${connectionDTO.InfluxDbOrg}/${connectionDTO.InfluxDbBucket}/${connectionDTO.InfluxDbUrl}/${connectionDTO.IPAddress}/${connectionDTO.Ec2Instance}/${connectionDTO.Keyspace}/${connectionDTO.Port}`;
  //   return this.http.get<ColumnDTO[]>(endpoint, {
  //     params: connectionDTO as any,
  //   });
  // }
  getColumnsByHostProviderDatabaseTableName(
    tableName: string
  ): Observable<ColumnDTO[]> {
    const connectionDTO = this.setDBConnectionDTOFromLocalStorage();
    const encodedHostName = encodeURIComponent(connectionDTO.HostName || '');
    const queryParams = {
      hostName: connectionDTO.HostName,
      provider: connectionDTO.Provider,
      databaseName: connectionDTO.DataBase,
      tableName: tableName,
      accessKey: connectionDTO.AccessKey || undefined,
      secretKey: connectionDTO.SecretKey || undefined,
      region: connectionDTO.Region || undefined,
      ipAddress: connectionDTO.IPAddress || undefined,
      influxDbToken: connectionDTO.InfluxDbToken || undefined,
      influxDbOrg: connectionDTO.InfluxDbOrg || undefined,
      influxDbBucket: connectionDTO.InfluxDbBucket || undefined,
      influxDbUrl: connectionDTO.InfluxDbUrl || undefined,
      ec2Instance: connectionDTO.Ec2Instance || undefined,
      keyspace: connectionDTO.Keyspace || undefined,
      port: connectionDTO.Port || undefined,
    };

    // Build URL with query parameters
    const endpoint = `${this.apiUrlGateway}columns/GetColumnsByHostProviderDatabaseTableName`;

    // Pass the queryParams object
    return this.http.get<ColumnDTO[]>(endpoint, { params: queryParams as any });
  }
}
