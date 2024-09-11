export interface TableMetaDataDTO {
  Id: number;
  EntityName: string;
  HostName: string;
  DatabaseName: string;
  Provider?: string;
  AccessKey?: string;
  Secretkey?: string;
  Region?: string;
  Keyspace?: string;
  Ec2Instance?: string;
  IpAddress?: string;
}
