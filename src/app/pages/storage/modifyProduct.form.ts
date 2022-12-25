import { FormBuilder, FormGroup, Validators } from "@angular/forms";

export class ModifyProductForm{
    private formBuilder: FormBuilder;
    createForm() : FormGroup{
        return this.formBuilder.group({
            name:['',[Validators.required]],
            urlImg:'',
            trademark:'',
            category:['',[Validators.required]],
            costPrice:['',[Validators.required]],
            wholesalePrice:['',[Validators.required]],
            retailPrice:['',[Validators.required]],
            unit:['',[Validators.required]],
            barcode:'',
            numWarning:['',[Validators.required]],
        });
    }
    constructor(formBuilder: FormBuilder){
        this.formBuilder=formBuilder;
    }

}
