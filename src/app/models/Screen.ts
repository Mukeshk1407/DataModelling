export interface Screen {
    id: number;
    roleId: number;
    role?: {         // Nested 'screen' property
        id: number;
        roleName: string;
    };
    screenId: number;
    screen?: {         // Nested 'screen' property
        id: number;
        screenName: string;
        routeURL: string;
    };
    isSelected: boolean;
}
