import { FormBuilder, FormGroup, Validators } from "@angular/forms";

export class LoginForm{
    private formBuilder: FormBuilder;
    createForm() : FormGroup{
        return this.formBuilder.group({
            username:['',[Validators.required]],
            password:['',[Validators.required]],
            error:''
        });
    }
    constructor(formBuilder: FormBuilder){
        this.formBuilder=formBuilder;
    }

}
