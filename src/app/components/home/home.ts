import { NgClass } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import {MatPaginator,PageEvent} from '@angular/material/paginator';
import {MatSortModule,Sort} from '@angular/material/sort';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { FormBuilder,Validator } from '@angular/forms';
import { finalize } from 'rxjs';
import { Employee } from '../../interface/employee';

@Component({
  selector: 'app-home',
  imports: [NgClass, MatPaginator, MatSortModule,ReactiveFormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})

export class Home {
  http = inject(HttpClient);
  private apiUrl = 'http://localhost:3001/employees';
  employees: Employee[] = []
  loading = false
  errorMessage = ''
    constructor() {
    this.loadEmployees();
  }
  getEmployees() {
    return this.http.get<Employee[]>(this.apiUrl);
  }

  loadEmployees(): void {
    this.http.get<Employee[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.employees = data;
      },
      error: (error) => {
        console.error('Failed to load employees:', error);
        this.formError = 'Unable to load employees.';
      }
    });
  }
  // Search
searchTerm = '';
// Filters
selectedDepartment = 'all';
selectedStatus = 'all';

// Get unique departments from employee data
get departments() {
  return [...new Set(this.employees.map(emp => emp.Department))];
}

  private fb = inject(FormBuilder);

  // Form for adding and editing employees
  employeeForm = this.fb.nonNullable.group({
    Name: ['', [Validators.required, Validators.minLength(2)]],
    Email: ['', [Validators.required, Validators.email]],
    Department: ['', Validators.required],
    Status: ['Active' as Employee['Status'], Validators.required]
  });

  modalMode: 'add' | 'edit' | 'view' | null = null;
  selectedEmployee: Employee | null = null;
  saving = false;
  formError = '';

  // Open the Add User form
  openAddForm(): void {
    this.selectedEmployee = null;
    this.formError = '';
    this.employeeForm.reset({
      Name: '',
      Email: '',
      Department: '',
      Status: 'Active'
    });
    this.modalMode = 'add';
  }

  // Open the Edit User form
  openEditForm(employee: Employee): void {
    this.selectedEmployee = employee;
    this.formError = '';

    this.employeeForm.reset({
      Name: employee.Name,
      Email: employee.Email,
      Department: employee.Department,
      Status: employee.Status
    });

    this.modalMode = 'edit';
  }

  // View employee details
  openViewDetails(employee: Employee): void {
    this.selectedEmployee = employee;
    this.modalMode = 'view';
  }

  closeModal(): void {
    this.modalMode = null;
    this.selectedEmployee = null;
    this.formError = '';
  }

  // Mark fields as touched to display validation errors
  private markFormTouched(): void {
    this.employeeForm.markAllAsTouched();
  }

  // Generate the next employee ID
  private generateEmployeeId(): string {
    const highestId = this.employees.reduce((max, employee) => {
      const number = Number(employee.Display_ID.replace('EMP', ''));
      return Number.isFinite(number) ? Math.max(max, number) : max;
    }, 0);

    return `EMP${String(highestId + 1).padStart(3, '0')}`;
  }

  // Add or update an employee
  saveEmployee(): void {
    this.markFormTouched();
    this.formError = '';

    if (this.employeeForm.invalid) {
      return;
    }

    const value = this.employeeForm.getRawValue();

    // Check for duplicate email, excluding the employee being edited
    const duplicateEmail = this.employees.some(employee =>
      employee.Email.trim().toLowerCase() ===
        value.Email.trim().toLowerCase() &&
      employee.id !== this.selectedEmployee?.id
    );

    if (duplicateEmail) {
      this.employeeForm.controls.Email.setErrors({
        ...this.employeeForm.controls.Email.errors,
        duplicate: true
      });
      this.employeeForm.controls.Email.markAsTouched();
      return;
    }

    this.saving = true;

    if (this.modalMode === 'add') {
      const id = this.generateEmployeeId();

      const newEmployee: Employee = {
        id,
        Display_ID: id,
        ...value
      };

      this.http.post<Employee>(this.apiUrl, newEmployee).subscribe({
        next: () => {
          this.loadEmployees();
          this.closeModal();
          this.saving = false;
          this.pageIndex = 0;
        },
        error: () => {
          this.formError = 'Unable to add employee. Please try again.';
          this.saving = false;
        }
      });
    } else if (
      this.modalMode === 'edit' &&
      this.selectedEmployee
    ) {
      const updatedEmployee: Employee = {
        ...this.selectedEmployee,
        ...value
      };

      this.http.put<Employee>(
        `${this.apiUrl}/${encodeURIComponent(this.selectedEmployee.id)}`,
        updatedEmployee
      ).subscribe({
        next: () => {
          this.loadEmployees();
          this.closeModal();
          this.saving = false;
        },
        error: () => {
          this.formError = 'Unable to update employee. Please try again.';
          this.saving = false;
        }
      });
    }
  }

  // Delete with confirmation
  deleteEmployee(employee: Employee): void {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${employee.Name}?`
    );

    if (!confirmed) {
      return;
    }

    this.http.delete(
      `${this.apiUrl}/${encodeURIComponent(employee.id)}`
    ).subscribe({
      next: () => {
        this.loadEmployees();

        if (this.pageIndex > 0 && this.paginatedEmployees.length <= 1) {
          this.pageIndex--;
        }
      },
      error: (error) => {
        console.error('Error deleting employee:', error);
        this.formError = 'Unable to delete employee. Please try again.';
      }
    });
  }

// Filter employees using search and dropdown filters
get filteredEmployees() {
  const search = this.searchTerm.toLowerCase().trim();

  return this.employees.filter(emp => {
    const matchesSearch =
      emp.Display_ID.toLowerCase().includes(search) ||
      emp.Name.toLowerCase().includes(search) ||
      emp.Email.toLowerCase().includes(search) ||
      emp.Department.toLowerCase().includes(search);

    const matchesDepartment =
      this.selectedDepartment === 'all' ||
      emp.Department === this.selectedDepartment;

    const matchesStatus =
      this.selectedStatus === 'all' ||
      emp.Status === this.selectedStatus;

    return matchesSearch && matchesDepartment && matchesStatus;
  });
}

// Reset pagination when search or filters change
onSearch(event: Event) {
  this.searchTerm = (event.target as HTMLInputElement).value;
  this.pageIndex = 0;
}

onDepartmentChange(event: Event) {
  this.selectedDepartment = (event.target as HTMLSelectElement).value;
  this.pageIndex = 0;
}

onStatusChange(event: Event) {
  this.selectedStatus = (event.target as HTMLSelectElement).value;
  this.pageIndex = 0;
}

  pageSize = 10;
  pageIndex = 0;

  sortState: Sort = {
    active: 'Display_ID',
    direction: 'asc'
  };

get paginatedEmployees() {
  const data = [...this.filteredEmployees];

  if (this.sortState.direction) {
    const { active, direction } = this.sortState;

    data.sort((a, b) => {
      const result = String(a[active as keyof typeof a])
        .localeCompare(
          String(b[active as keyof typeof b]),
          undefined,
          { numeric: true, sensitivity: 'base' }
        );

      return direction === 'asc' ? result : -result;
    });
  }

  const startIndex = this.pageIndex * this.pageSize;

  return data.slice(startIndex, startIndex + this.pageSize);
}

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  onSortChange(sort: Sort) {
    this.sortState = sort;
    this.pageIndex = 0;
  }
}

