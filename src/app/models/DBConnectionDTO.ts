export interface DBConnectionDTO {
  Provider: string;
  HostName: string;
  DataBase: string;
  UserName?: string;
  Password?: string;
  // AccessKey?: string;
  // SecretKey?: string;
  // Region?: string;
  // IPAddress?: string;
  // PortNumber?: number;
  // InfluxDbUrl?: string;
  // InfluxDbToken?: string;
  // InfluxDbOrg?: string;
  // InfluxDbBucket?: string;
  // Ec2Instance?: string;
  // Keyspace?: string;

  [key: string]: string | undefined | number;
}
