export interface Employee {
  Display_ID: string;
  Name: string;
  Email: string;
  Department: string;
  Status: 'Active' | 'Inactive' | 'On Leave';
}
