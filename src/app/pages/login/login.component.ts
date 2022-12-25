import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginForm } from './login.form';
import { CrudService } from 'src/app/services/crud.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form:FormGroup|any;
  isSignedIn=false;
  constructor(private router:Router,private formBuilder:FormBuilder,private crudService:CrudService){

  }
  ngOnInit(){
      this.form=new LoginForm(this.formBuilder).createForm();
      if(localStorage.getItem("user")!==null){
        this.isSignedIn=true;
      }else this.isSignedIn=false;
  }
  async onLogin(email:string,password:string){
    await this.crudService.signin(email,password);
    if (this.crudService.isLoggedIn) {
      this.isSignedIn=true;
      this.router.navigate(['storage']);
    }else{
      if (!this.form.get('username').valid||!this.form.get('password').valid){
        this.form.get('error')?.setValue('Điền thông tin đăng nhập');
      }
      else this.form.get('error')?.setValue('Tài khoản hoặc mật khẩu chưa chính xác');
    }
  }
}
