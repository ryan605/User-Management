import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { EmployeeService } from '../../services/employee';


@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
})
export class LoginPage {
  private employeeService = inject(EmployeeService)
  private fb = inject(FormBuilder);
  http = inject(HttpClient)
  router = inject(Router)
  loginForm = this.fb.nonNullable.group({
   Email: ['', [Validators.required, Validators.email]],
  Password: ['', [Validators.required, Validators.minLength(8)]],
  })

onLogin() {
  if (this.loginForm.invalid) {
    this.loginForm.markAllAsTouched();
    return;
  }

  const { Email, Password } = this.loginForm.getRawValue();

  this.employeeService.getEmployees().subscribe({
    next: (employees) => {
      const employee = employees.find((emp) => {
        return (
          emp.Email.toLowerCase() === Email!.trim().toLowerCase() &&
          emp.Password === Password
        );
      });

      if (employee) {
        this.router.navigate(['/home']);
      } else {
        alert('Wrong credentials');
      }
    },
    error: (error) => {
      console.error('Error fetching employees:', error);
      alert('Unable to connect to the server.');
    }
  });
}

}
