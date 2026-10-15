
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {HttpTestingController,provideHttpClientTesting} from '@angular/common/http/testing';

import { Home } from './home';
import { Employee } from '../../interface/employee';

describe('Home', () => {
  let component: Home;
  let fixture: ComponentFixture<Home>;
  let httpMock: HttpTestingController;

  const mockEmployees: Employee[] = [
    {
      id: 'EMP001',
      Display_ID: 'EMP001',
      Name: 'John Kamau',
      Email: 'john@example.com',
      Department: 'Software Engineering',
      Status: 'Active'
    },
    {
      id: 'EMP002',
      Display_ID: 'EMP002',
      Name: 'Grace Wanjiku',
      Email: 'grace@example.com',
      Department: 'Human Resources',
      Status: 'Active'
    },
    {
      id: 'EMP003',
      Display_ID: 'EMP003',
      Name: 'Brian Otieno',
      Email: 'brian@example.com',
      Department: 'Finance',
      Status: 'Inactive'
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Home);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);

    // Respond to the initial employee request.
    const request = httpMock.expectOne(
      'http://localhost:3001/employees'
    );

    request.flush(mockEmployees);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  // Component creation
  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  // Form validation
  it('should reject an empty required form', () => {
    component.employeeForm.setValue({
      Name: '',
      Email: '',
      Department: '',
      Status: 'Active'
    });

    expect(component.employeeForm.invalid).toBe(true);
    expect(
      component.employeeForm.controls.Name.hasError('required')
    ).toBe(true);
    expect(
      component.employeeForm.controls.Email.hasError('required')
    ).toBe(true);
    expect(
      component.employeeForm.controls.Department.hasError('required')
    ).toBe(true);
  });

  it('should reject an invalid email address', () => {
    component.employeeForm.controls.Email.setValue('invalid-email');

    expect(
      component.employeeForm.controls.Email.hasError('email')
    ).toBe(true);
  });

  it('should accept valid employee details', () => {
    component.employeeForm.setValue({
      Name: 'Mary Achieng',
      Email: 'mary@example.com',
      Department: 'Finance',
      Status: 'Active'
    });

    expect(component.employeeForm.valid).toBe(true);
  });

  // Search
  it('should filter employees by name', () => {
    component.searchTerm = 'grace';

    expect(component.filteredEmployees.length).toBe(1);
    expect(component.filteredEmployees[0].Name)
      .toBe('Grace Wanjiku');
  });

  it('should return all employees when search is empty', () => {
    component.searchTerm = '';

    expect(component.filteredEmployees.length).toBe(3);
  });

  // Department filter
  it('should filter employees by department', () => {
    component.selectedDepartment = 'Finance';

    expect(component.filteredEmployees.length).toBe(1);
    expect(component.filteredEmployees[0].Name)
      .toBe('Brian Otieno');
  });

  // Status filter
  it('should filter employees by status', () => {
    component.selectedStatus = 'Inactive';

    expect(component.filteredEmployees.length).toBe(1);
    expect(component.filteredEmployees[0].Name)
      .toBe('Brian Otieno');
  });

  // Combined filters
  it('should apply search and department filters together', () => {
    component.searchTerm = 'john';
    component.selectedDepartment = 'Software Engineering';

    expect(component.filteredEmployees.length).toBe(1);
    expect(component.filteredEmployees[0].Display_ID)
      .toBe('EMP001');
  });
});
