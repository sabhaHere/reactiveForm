import { Component, inject } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { minLength, noFutureDateValidator } from '../../validators/employee-validator';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { DEPARTMENTS } from '../../models/employee';
import { DatePickerModule } from 'primeng/datepicker';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';

interface EmployeeForm {
  name: FormControl<string>;
  department: FormControl<string>;
  email: FormControl<string>;
  joiningDate: FormControl<Date | null>;
  skills: FormArray<FormControl<string>>;
  agreeToTerm: FormControl<boolean>;
}
@Component({
  selector: 'app-create-component',
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    SelectModule,
    DatePickerModule,
    ButtonModule,
    CheckboxModule,
  ],
  template: `
    <div class="flex flex-col items-center justify-center px-4 py-6 ">
      <h1 class="text-xl font-bold py-4">Employee Form</h1>
      <div
        class="flex flex-col items-center justify-center px-4 py-6 border border-gray-200 w-[400px] rounded-sm"
      >
        <form [formGroup]="employeeForm" (ngSubmit)="onSubmit()" class="w-full max-w-md px-4">
          <div class="flex flex-col">
            <label for="name" class="p-2">Name</label>
            <input pInputText id="name" formControlName="name" />
            @if (employeeForm.controls.name.invalid && employeeForm.controls.name.touched) {
              <small>
                @if (employeeForm.controls.name.hasError('required')) {
                  Name Required
                }
              </small>
            }
          </div>
          <div class="flex flex-col">
            <label for="email" class="p-2">Email</label>
            <input pInputText id="email" formControlName="email" />

            @if (employeeForm.controls.email.invalid && employeeForm.controls.email.touched) {
              <small>
                @if (employeeForm.controls.email.hasError('required')) {
                  Email Required
                }
                @if (employeeForm.controls.email.hasError('email')) {
                  Enter Valid Email
                }
              </small>
            }
          </div>
          <div class="flex flex-col">
            <label for="department" class="p-2">Department</label>
            <p-select
              id="department"
              formControlName="department"
              [options]="department"
              optionLabel="label"
              optionValue="value"
              placeholder="Select a Department"
            ></p-select>
            @if (
              employeeForm.controls.department.invalid && employeeForm.controls.department.touched
            ) {
              <small>
                @if (employeeForm.controls.department.hasError('required')) {
                  Department Required
                }
              </small>
            }
          </div>
          <div class="flex flex-col">
            <label for="joiningDate" class="p-2">joiningDate</label>
            <p-datepicker formControlName="joiningDate" id="joiningDate" />
            @if (
              employeeForm.controls.joiningDate.invalid && employeeForm.controls.joiningDate.touched
            ) {
              <small>
                @if (employeeForm.controls.joiningDate.hasError('required')) {
                  Joining Date Required
                }
              </small>
            }
          </div>
          <div class="flex flex-col gap-2 mt-2" formArrayName="skills">
            <div class="flex justify-between">
              <label for="skills">Skills</label>
              <p-button label="Add Skill" icon="pi pi plus" [text]="true" (onClick)="addSkills()" />
            </div>

            @for (skill of skills.controls; track $index) {
              <div class="grid grid-cols-6 gap-2">
                <input
                  pInputText
                  [formControlName]="$index"
                  placeholder="eg:angular..."
                  class="col-span-5"
                />
                <p-button
                  icon="pi pi-trash"
                  [text]="true"
                  severity="danger"
                  (onClick)="removeSkills($index)"
                  [disabled]="skills.length === 1"
                />
                @if (skill.invalid && skill.touched) {
                  <small class="p-error">
                    @if (skill.hasError('required')) {
                      Skill cannot be empty.
                    }
                    @if (skill.hasError('minlength')) {
                      Each skill needs at least 2 characters.
                    }
                  </small>
                }
              </div>
            }
          </div>
          <div class="flex gap-2 justify-start items-center py-2">
            <p-checkbox formControlName="agreeToTerm" [binary]="true" inputId="terms" />
            <label for="terms">I agree to the terms and conditions</label>
            @if (
              employeeForm.controls.agreeToTerm.invalid && employeeForm.controls.agreeToTerm.touched
            ) {
              <small class="p-error">You must accept the terms.</small>
            }
          </div>
          <div class="flex justify-end gap-2">
            <p-button label="submit" type="submit" [disabled]="employeeForm.invalid"> </p-button>
            <p-button
              label="reset"
              type="reset"
              [disabled]="employeeForm.invalid"
              severity="secondary"
            >
            </p-button>
          </div>
        </form>
      </div>
    </div>
  `,
  styleUrl: './create-component.css',
})
export class CreateComponent {
  fb = inject(NonNullableFormBuilder);
  department = DEPARTMENTS;

  employeeForm: FormGroup<EmployeeForm> = this.fb.group({
    name: this.fb.control('', [Validators.required, Validators.minLength(3)]),
    department: this.fb.control('', [Validators.required]),
    email: this.fb.control('', [Validators.required, Validators.email]),
    joiningDate: this.fb.control<Date | null>(null, [Validators.required, noFutureDateValidator]),
    skills: this.fb.array([this.newSkillControl()], [minLength(2)]),
    agreeToTerm: this.fb.control(false, Validators.requiredTrue),
  });

  private newSkillControl(): FormControl<string> {
    return this.fb.control('', [Validators.required, Validators.minLength(2)]);
  }

  get skills(): FormArray<FormControl<string>> {
    return this.employeeForm.controls.skills;
  }
  addSkills() {
    this.skills.push(this.newSkillControl());
  }

  removeSkills(index: number) {
    if (this.skills.length > 1) {
      this.skills.removeAt(index);
    }
  }

  onSubmit() {
    if (!this.employeeForm.valid) {
      this.employeeForm.markAllAsTouched();
      return;
    }
    console.log(this.employeeForm.getRawValue());
  }
  onReset() {
    this.employeeForm.reset({ agreeToTerm: false });
    while (this.skills.length > 1) {
      this.skills.removeAt(0);
    }
    this.skills.at(0)?.reset('');
  }
}
