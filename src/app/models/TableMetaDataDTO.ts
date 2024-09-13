export interface TableMetaDataDTO {
  Id: number;
  EntityName: string;
  HostName?: string;
  DatabaseName?: string;
  Provider?: string;
  AccessKey?: string;
  Secretkey?: string;
  Region?: string;
  InfluxDbToken?: string;
  InfluxDbOrgId?: string;
  InfluxDbBucket?: string;
  InfluxDbURL?: string;
  IpAddress?: string;
  Keyspace?: string;
  Ec2Instance?: string;
  Port?: number;
}
