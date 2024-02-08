export interface DBConnectionDTO {
    Provider: string;
    HostName: string;
    DataBase: string;
    UserName?: string;
    Password?: string;

    [key: string]: string | undefined;
  }
  