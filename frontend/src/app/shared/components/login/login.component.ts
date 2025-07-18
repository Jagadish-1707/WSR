import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RouterModule } from '@angular/router';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DialogModule } from 'primeng/dialog';
import { LoginService } from '../../services/login.service';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { InputOtpModule } from 'primeng/inputotp';
import { MessagesModule } from 'primeng/messages';
import { ToastModule } from 'primeng/toast';
import { AutoFocusModule } from 'primeng/autofocus';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule, FormsModule, CommonModule,CardModule,ButtonModule,InputTextModule,ProgressSpinnerModule,
    RouterModule,DialogModule,InputOtpModule,MessagesModule,ToastModule,AutoFocusModule,NgxSpinnerModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
  
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  userEmail: string = '';
  loading: boolean = false;
  otp:string ='';
  userDetails:any;
  errorMessage!: string;
  minutes!: number;
  seconds!: number;
  interval!: any;
  userName : string='';
  totalSeconds!: number;
  resendOTP:boolean = false;
  continueOTP:boolean = false;

  showOtpFailedDialog: boolean = false;
  mailVerified : boolean = false;
  otpVerified: boolean = false;
  constructor(private router: Router, 
    private formBuilder: FormBuilder,
    private loginservice: LoginService,
    private messageService: MessageService,
    private confrimService: ConfirmationService,
    private spinner: NgxSpinnerService
  ) {
  }

ngOnInit(): void {

  this.loginForm = this.formBuilder.group({
    email: new FormControl('', [Validators.required]),
    otp: new FormControl('', Validators.required)
  });
}
  onEmailInput(event: any) {
    const inputValue = event.target.value;
    // const regex = new RegExp('/^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,3})$/');
    if (inputValue.includes('@') && !inputValue.endsWith('excelenciaconsulting.com')) {
      this.userEmail = inputValue.split('@')[0] + '@excelenciaconsulting.com';
    }
  }
 
  charSet(e: any) {
    if (+e.charCode > 45 && +e.charCode < 58) {
      return true;
    }
    return false;
  }
  submitForm() {
    console.log(this.userEmail);
     this.loginservice.sendOTP(this.userEmail).subscribe((res:any)=>{
      this.continueOTP = true;
       this.userDetails = res; 
      this.loading = true;
      
       if(!this.userDetails.data){
        this.messageService.add({ severity: 'error', summary: 'Invalid Email', detail: 'Please enter valid email.' });
        this.continueOTP = false;
        this.mailVerified = false;
        this.loading = false;
       }
       else{
        this.continueOTP = true;
        this.mailVerified=true;
        this.loading = true;
        this.userName = this.userDetails.data.userName;
        localStorage.setItem("userLogin", JSON.stringify(this.userDetails));
        this.messageService.add({ severity: 'success', summary: 'OTP Sent', detail: 'Otp Sent Successfully' });
        this.OTPTimer()
       }
 
    });
  }

  OTPTimer(){
     this.totalSeconds = 60; // 3 minutes in seconds

    this.interval = setInterval(() => {
      if (this.totalSeconds >= 0) {
        this.minutes = Math.floor(this.totalSeconds / 60);
        this.seconds = this.totalSeconds % 60;
        this.totalSeconds--;
        if(this.totalSeconds <= 0){
          this.resendOTP = true;
        }
      } else {
        clearInterval(this.interval);
        
        // Redirect or perform other actions when the timer finishes
      }
    }, 1000);
  }

  showSpinner() {
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 3000);
  }
  validateOtp(){
    const data = new FormData();
    data.append('OneTimePassword', this.otp)
    data.append('EmailAddress', this.userEmail)
    this.userDetails = localStorage.getItem("userLogin");
    // console.log(this.userEmail,this.otp);
    // console.log(this.userDetails,"userDetails");
    
    this.loginservice.verifyOTP(data).subscribe((res:any)=>{
      this.otpVerified = res.success;
      // console.log(res,"otp verification");
      if(res.success){
        // this.messageService.add({ severity: 'success', summary: 'Login Success', detail: res.messages });
        this.loginservice.setIsLoggedIn(true);
        this.router.navigateByUrl("/dashboard");
        
      }
      else if(!res.success){
        this.loginservice.setIsLoggedIn(false);
        this.messageService.add({ severity: 'error', summary: 'OTP verification failed', detail: res.errorMessage });
        this.otpVerified = false;
      }
    })
    
  }
    reSendOTP(){
      this.submitForm();
      this.resendOTP = false;
      clearInterval(this.interval);
      this.totalSeconds = 60;
    }

  isEmailInvalid() {
    const emailControl = this.loginForm.get('email');
    return emailControl?.invalid && (emailControl.dirty || emailControl.touched);
  }
  
}


