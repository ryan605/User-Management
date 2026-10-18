export interface Employee {
  id:string,
  Display_ID: string;
  Name: string;
  Email: string;
  Password:string;
  Department: string;
  Status: 'Active' | 'Inactive' | 'On Leave';
}
