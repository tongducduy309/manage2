import { FormBuilder, FormGroup } from "@angular/forms";
import { AddProductForm } from "./addProduct.form";


describe('addProductForm', ()=>{

    let productForm: AddProductForm;
    let form :FormGroup;
    beforeEach(()=>{
        productForm= new AddProductForm(new FormBuilder());
        form = productForm.createForm();
    })

    it('should create login form empty', () =>{

        expect(form).not.toBeNull();
        expect(form.get('name')).toBeNull();
        expect(form.get('name')?.value).toEqual('name');
        expect(form.get('name')?.valid).toBeFalsy();
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
        //form.get('name')?.setValue('vali@gmail.com');
        expect(form.valid).toBeTruthy();
    })
})
