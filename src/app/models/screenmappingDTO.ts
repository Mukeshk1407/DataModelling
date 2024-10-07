export interface Screenmapping {
  id: number;
  screenName: string;
  routeURL: string;
  role: {
    id: number;
    roleName: string;
  };
  screen: {
    id: number;
    screenName: string;
    routeURL: string;
  };
}
