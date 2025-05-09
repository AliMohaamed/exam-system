import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-sign-up',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent {

  constructor(private router: Router) {}

  hidePassword = true;

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }


  passwordRegex: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  nameRegex: RegExp = /^[A-Za-z\s]{2,50}$/;
  phoneRegex: RegExp = /^01[0-2,5]{1}[0-9]{8}$/;

  productForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      (control) => {
        const regex =  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!regex.test(control.value)) {
          return { invalidEmail: true };
        }
        return null;
      },
    ]),
    password: new FormControl('', [Validators.required, Validators.pattern(this.passwordRegex)]),
    fname: new FormControl('', [Validators.required, Validators.pattern(this.nameRegex)]),
    lname: new FormControl('', [Validators.required, Validators.pattern(this.nameRegex)]),
    phone: new FormControl('', [Validators.required, Validators.pattern(this.phoneRegex)]),
  });


  get getFname(){
    return this.productForm.get('fname')
  }
  get getLname(){
    return this.productForm.get('lname')
  }

  get getPhone(){
    return this.productForm.get('phone')
  }

  get getEmail(){
    return this.productForm.get('email')
  }

  get getPassword(){
    return this.productForm.get('password');
  }

  onSubmit(){
    if (this.productForm.invalid) {
    this.productForm.markAllAsTouched();
    return;
  }

  console.log('Form Data:', this.productForm.value);
  this.productForm.reset();
  }


  Login() {
    this.router.navigate(['/login']); 
  }

}
