export interface EntityListDto{
    id: number;
    entityName: string;
}

// If EntityColumnListMetadataModel is also part of the response, you can include it as well
export interface EntityColumnListMetadataModel {
    // Define properties for EntityColumnListMetadataModel here
    // For example:
    columnName: string;
    columnType: string;
    // Add more properties as needed
  }