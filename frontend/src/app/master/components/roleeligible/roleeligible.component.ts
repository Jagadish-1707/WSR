import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';

@Component({
  selector: 'app-roleeligible',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule,CommonModule,CheckboxModule],
  templateUrl: './roleeligible.component.html',
  styleUrl: './roleeligible.component.scss'
})
export class RoleeligibleComponent implements OnInit {
  eligibleForm!: FormGroup;
  isChecked: boolean | undefined;
  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.eligibleForm = this.fb.group({
      modelName: [''],
      roleId: [''],
      add: [true],
      edit: [true],
      view: [true],
      delete: [true]
    });

  }

  frm: FormGroup = new FormGroup({
    Id: new FormControl("", Validators.required),
    RoleId: new FormControl("", Validators.required),
    ModelName: new FormControl("", Validators.required),
    // Status: new FormControl("", Validators.required)
    // UserId: new FormControl("",Validators.required)

  })
  public get Id(): FormControl {
    return this.frm.get("Id") as FormControl;
  }
  public get RoleId(): FormControl {
    return this.frm.get("RoleId") as FormControl;
  }
  public get ModelName(): FormControl {
    return this.frm.get("ModelName") as FormControl;
  }

  onSubmit(){
    console.log(this.eligibleForm.value);
  }
}
