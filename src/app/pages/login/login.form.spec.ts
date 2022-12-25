import { FormBuilder, FormGroup } from "@angular/forms";
import { LoginForm } from "./login.form";

describe('loginForm', ()=>{

    let loginForm: LoginForm;
    let form :FormGroup;
    beforeEach(()=>{
        loginForm= new LoginForm(new FormBuilder());
        form = loginForm.createForm();
        console.log(form);
    })

    it('should create login form empty', () =>{

        expect(form).not.toBeNull();
        expect(form.get('username')).toBeNull();
        expect(form.get('username')?.value).toEqual('username');
        expect(form.get('username')?.valid).toBeFalsy();
        expect(form.get('password')).toBeNull();
        expect(form.get('password')?.value).toEqual('password');
        expect(form.get('password')?.valid).toBeFalsy();
    })

    // it('should have username invalid if username is not valid',()=>{
    //     form.get('username')?.setValue('invalid username');
    //     expect(form.get('username')?.valid).toBeFalsy();
    // })

    // it('should have username invalid if username is valid',()=>{
    //     form.get('username')?.setValue('abc@vidu.com');
    //     expect(form.get('username')?.valid).toBeFalsy();
    // })

    it('should have a valid form',()=>{
        form.get('username')?.setValue('vali@gmail.com');
        form.get('password')?.setValue('anyPassword');
        expect(form.valid).toBeTruthy();
    })
})
