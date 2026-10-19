
import { Component, inject } from '@angular/core';
import {FormBuilder,ReactiveFormsModule,Validators} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { Employee } from '../../interface/employee';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './signup.html',
  styleUrl: './signup.css'
})
export class Signup {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private router = inject(Router);

  private apiUrl = 'http://localhost:3002/employees';

  loading = false;
  errorMessage = '';

  departments = [
    'Software Engineering',
    'Human Resources',
    'Finance',
    'IT Support',
    'Marketing',
    'Cybersecurity',
    'Customer Service',
    'Data Analytics',
    'Operations'
  ];

  statuses: Employee['Status'][] = [
    'Active',
    'Inactive',
    'On Leave'
  ];

  signupForm = this.fb.nonNullable.group({
    Name: ['', [Validators.required, Validators.minLength(2)]],
    Email: ['', [Validators.required, Validators.email]],
    Password: ['', [Validators.required, Validators.minLength(8)]],
    ConfirmPassword: ['', Validators.required],
    Department: ['', Validators.required],
    Status: ['Active' as Employee['Status'], Validators.required]
  });

  onSignup(): void {
    this.signupForm.markAllAsTouched();
    this.errorMessage = '';

    if (this.signupForm.invalid) {
      return;
    }

    const value = this.signupForm.getRawValue();

    if (value.Password !== value.ConfirmPassword) {
      this.signupForm.controls.ConfirmPassword.setErrors({
        mismatch: true
      });
      return;
    }

    this.loading = true;

    this.http.get<Employee[]>(this.apiUrl).subscribe({
      next: (employees) => {
        const emailExists = employees.some(
          employee =>
            employee.Email.trim().toLowerCase() ===
            value.Email.trim().toLowerCase()
        );

        if (emailExists) {
          this.errorMessage = 'This email is already registered.';
          this.loading = false;
          return;
        }

        const highestId = employees.reduce((max, employee) => {
          const number = Number(
            employee.Display_ID.replace('EMP', '')
          );

          return Number.isFinite(number)
            ? Math.max(max, number)
            : max;
        }, 0);

        const id = `EMP${String(highestId + 1).padStart(3, '0')}`;

        const newEmployee: Employee = {
          id,
          Display_ID: id,
          Name: value.Name.trim(),
          Email: value.Email.trim(),
          Password: value.Password,
          Department: value.Department,
          Status: value.Status
        };

        this.http.post<Employee>(this.apiUrl, newEmployee).subscribe({
          next: (createdEmployee) => {
            const updatedEmployees = [
              ...employees,
              createdEmployee
            ];

            localStorage.setItem(
              'employees',
              JSON.stringify(updatedEmployees)
            );

            this.loading = false;
            this.router.navigate(['/home']);
          },
          error: () => {
            this.errorMessage =
              'Unable to create your account. Please try again.';
            this.loading = false;
          }
        });
      },
      error: () => {
        this.errorMessage =
          'Unable to connect to the server. Please try again.';
        this.loading = false;
      }
    });
  }
}
