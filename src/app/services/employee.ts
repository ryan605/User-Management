
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Employee {
  id: string;
  Display_ID: string;
  Name: string;
  Email: string;
  Password: string;
  Department: string;
  Status: 'Active' | 'Inactive' | 'On Leave';
}

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:3002/employees';

  getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.apiUrl);
  }
}
