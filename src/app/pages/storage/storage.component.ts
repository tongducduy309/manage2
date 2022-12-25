import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Storage,ref,uploadBytesResumable,getDownloadURL, getStorage, deleteObject } from "@angular/fire/storage";
import { FormBuilder, FormGroup } from '@angular/forms';
import { User } from 'src/app/models/user';
import { CrudService } from 'src/app/services/crud.service';
import { AddProductForm } from './addProduct.form';
import { Product, productObj } from 'src/app/models/products';
import { ModifyProductForm } from './modifyProduct.form';
import { ThisReceiver } from '@angular/compiler';

@Component({
  selector: 'app-storage',
  templateUrl: './storage.component.html',
  styleUrls: ['./storage.component.css']
})
export class StorageComponent implements OnInit{
  file:any={};

  name:any={};
  UrlFileImg='';
  tab=0;
  tabPrevious=0;
  boxActive=0;
  uid:any;
  user:any;
  users:any[];
  products:any[];
  viewProduct:any[];
  onActive:any;
  offActive:any;
  addProductForm:FormGroup|any;
  modifyProductForm:FormGroup|any;
  allowActive=true;
  startPage=0;
  endPage=0;
  itemOnPage=10;
  currentPagination=0;
  categories:any[];
  units:any[];
  productsDefault:any[];
  sortByNameProductActive=false;
  detailProduct={
    serial:0,
    id:'',
    name:'',
    urlImg:'',
    category:'',
    trademark:'',
    costPrice:0,
    retailPrice:0,
    wholesalePrice:0,
    unit:'',
    barcode:'',
    numWarning:0,
    allow:true,
    greatSelling:true
  }
  product={
    id:'',
    name:'',
    urlImg:'',
    category:'',
    trademark:'',
    costPrice:'',
    retailPrice:'',
    wholesalePrice:'',
    unit:'',
    barcode:'',
    numWarning:'',
    allow:true,
    greatSelling:false
  }
  constructor(public storage:Storage,private crudService:CrudService,private formBuilder:FormBuilder){
    this.users=[];
    this.products=[];
    this.viewProduct=[];
    this.categories=[];
    this.units=[];
    this.productsDefault=[];
    this.resetPagination();
    this.itemOnPage=10;
    this.file.path='https://firebasestorage.googleapis.com/v0/b/store-1f443.appspot.com/o/Products%2FdefaultProduct.png?alt=media&token=78b3b13e-06d3-400b-b2f0-486b87ac4576';

  }

  ngOnInit() {
    this.addProductForm=new AddProductForm(this.formBuilder).createForm();
    this.modifyProductForm=new ModifyProductForm(this.formBuilder).createForm();
    this.getUser();
  }





  getUser(){
    const userCurrent=JSON.parse(localStorage['user']);
    this.uid=userCurrent.uid;

    this.crudService.getUsers().subscribe(res => {
      this.products=[];
      for (let i of res)
      if (i.profile.uid==this.uid)
      {
        this.user=i.profile;
        let g=0;
        for (let pdt of i.products)
        {
          if (pdt.urlImg=='')
          pdt.urlImg='https://firebasestorage.googleapis.com/v0/b/store-1f443.appspot.com/o/Products%2FdefaultProduct.png?alt=media&token=78b3b13e-06d3-400b-b2f0-486b87ac4576';

          this.products.push(pdt);
          g++;

        }
        this.productsDefault=this.products;
        this.categories=i.categories;
        this.units=i.units;
        this.sortByNameProduct();


      }
      this.filterProduct(this.products);


    });
  }

  controlTab(){
    this.filterProduct(this.products);
    if (this.tab==2) {
      if (this.modifyProductForm.valid)this.saveDataModifiedProduct();
    }
    this.tab=this.tabPrevious;
    this.allowActive=true;
    this.resetmodifyProductForm();
  }


  addImage()
{

  const storageRef = ref(this.storage,'Products/'+this.file.nameIn);
  const uploadTask =  uploadBytesResumable(storageRef,this.file);
   uploadTask.on('state_changed',
  (snapshot)=> {
    // const progress = (snapshot.bytesTransferred / snapshot.totalBytes);
    // console.log('Upload is' + progress + '%done');
  },
  (error)=> {
    console.log("error");
  },
  () => {

    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
      this.UrlFileImg = downloadURL;
      this.file.path=downloadURL;
      //this.addProduct();
      console.log('File available at',  this.UrlFileImg);

    });
  }
  )
}

  chooseFile(){
    document.getElementById('importFile')?.click();
  }

  handleFileInput(event: any,name:string) {
    const file=event.files;
    this.file = file.item(0);
    let reader = new FileReader();
    reader.onload = (event: any) => {
      this.file.path = event.target.result;
    }
    reader.readAsDataURL(this.file);
    this.file.nameIn=name;
    this.addImage();

  }

  addProduct(){
    this.product.urlImg=this.file.path;
    const data=productObj({
      id:this.uid+this.products.length,
      urlImg:this.product.urlImg,
      name:this.product.name,
      category:this.product.category,
      trademark:this.product.trademark,
      costPrice:parseInt(this.product.costPrice),
      retailPrice:parseInt(this.product.retailPrice),
      wholesalePrice:parseInt(this.product.wholesalePrice),
      unit:this.product.unit,
      barcode:this.product.barcode,
      numWarning:parseInt(this.product.numWarning),
      allow:this.product.allow
    })
    this.products.push(data);
    this.crudService.addProduct(this.uid,this.products);
    this.tab=0;
    if (this.units.indexOf(this.product.unit)==-1) {
      this.units.push(this.product.unit);
      this.crudService.updateUnits(this.uid,this.units);
    }
    this.allowActive=true;
    this.resetFormAddProduct();
  }

  resetFormAddProduct(){
    this.product={
      id:'',
      name:'',
      urlImg:'',
      category:'',
      trademark:'',
      costPrice:'',
      retailPrice:'',
      wholesalePrice:'',
      unit:'',
      barcode:'',
      numWarning:'',
      allow:true,
      greatSelling:false
    }
    this.file.path='https://firebasestorage.googleapis.com/v0/b/store-1f443.appspot.com/o/Products%2FdefaultProduct.png?alt=media&token=78b3b13e-06d3-400b-b2f0-486b87ac4576';
  }

  deleteImage(){
    const storage = getStorage();

    // Create a reference to the file to delete
    const desertRef = ref(storage, 'Products/'+this.product.id);
    console.log(desertRef);
    // Delete the file
    deleteObject(desertRef).then(() => {
    // File deleted successfully
    }).catch((error) => {
    // Uh-oh, an error occurred!
    });

  }

  resetPagination(){

    this.startPage=0;
    this.endPage=this.startPage+this.itemOnPage;
    this.currentPagination=this.endPage/this.itemOnPage;

  }



  setIsAllow(onActive:any,offActive:any){
    this.onActive=onActive;
    this.offActive=offActive;
    onActive.classList.add("--tab--active");
    offActive.classList.remove("--tab--active");

    this.filterProduct(this.products);
    this.resetPagination();


  }

  changeItemOnPage(select:any){
    this.itemOnPage=parseInt(select.value);
    this.endPage=this.startPage+this.itemOnPage;
    this.currentPagination=this.endPage/this.itemOnPage;
  }
  nextPagination(){
    if (this.startPage+this.itemOnPage>this.viewProduct.length&&this.endPage<this.viewProduct.length){
      this.startPage=this.endPage;
      this.endPage=this.startPage+this.itemOnPage;
    } else if (this.endPage<this.viewProduct.length){
      this.startPage+=this.itemOnPage;
      this.endPage=this.startPage+this.itemOnPage;
    }
    this.currentPagination=this.endPage/this.itemOnPage;


  }
  previousPagination(){
    if (this.startPage-this.itemOnPage<0){
      this.startPage=0;
      this.endPage=this.startPage+this.itemOnPage;
    } else{
      this.startPage-=this.itemOnPage;
      this.endPage=this.startPage+this.itemOnPage;
    }
    this.currentPagination=this.endPage/this.itemOnPage;


  }
  searchProduct(key:string){
    if (key!=''){
      this.viewProduct=this.products.filter(pdt=>pdt.name.indexOf(key)>-1);
      this.filterProduct(this.viewProduct);
    }
    else this.filterProduct(this.products);

  }

  filterProduct(products:any[]){
    let result=products;

    //result=result.filter(pdt=>pdt.allow==this.allowActive);
    //result=result.filter(pdt=>pdt.allow==this.allowActive);
    //console.log(this.allowActive)
    this.viewProduct=result.filter(pdt=>pdt.allow==this.allowActive);
    this.resetPagination();
  }
  resetmodifyProductForm(){
    this.detailProduct={
      serial:0,
      id:'',
      name:'',
      urlImg:'',
      category:'',
      trademark:'',
      costPrice:0,
      retailPrice:0,
      wholesalePrice:0,
      unit:'',
      barcode:'',
      numWarning:0,
      allow:true,
      greatSelling:true
    }
    this.file.path='https://firebasestorage.googleapis.com/v0/b/store-1f443.appspot.com/o/Products%2FdefaultProduct.png?alt=media&token=78b3b13e-06d3-400b-b2f0-486b87ac4576';
  }
  modifyProduct(event:any,detailProduct:any){
    //this.file.path='https://firebasestorage.googleapis.com/v0/b/store-1f443.appspot.com/o/Products%2FdefaultProduct.png?alt=media&token=78b3b13e-06d3-400b-b2f0-486b87ac4576';
    //console.log(this.file.path);
    if(!event.target.closest('select'))
    {
      var serial=0;
    for (let i=0;i<this.products.length;i++){
      if (this.products[i].id==detailProduct.id) {
        serial=i;
        break;
      }
    }
      this.detailProduct={
        serial:0,
        id:detailProduct.id,
        urlImg:detailProduct.urlImg,
        name:detailProduct.name,
        category:detailProduct.category,
        trademark:detailProduct.trademark,
        costPrice:parseInt(detailProduct.costPrice),
        retailPrice:parseInt(detailProduct.retailPrice),
        wholesalePrice:parseInt(detailProduct.wholesalePrice),
        unit:detailProduct.unit,
        barcode:detailProduct.barcode,
        numWarning:parseInt(detailProduct.numWarning),
        allow:detailProduct.allow,
        greatSelling:detailProduct.greatSelling
      };
      this.detailProduct.serial=serial;
      this.file.path=this.detailProduct.urlImg;

      this.tab=2;
    }

  }

  saveDataModifiedProduct(){
    this.detailProduct.urlImg=this.file.path;
    this.products[this.detailProduct.serial]=this.detailProduct;
    //console.log(this.products[this.detailProduct.serial]);
    this.filterProduct(this.products);
    this.crudService.updateProducts(this.uid,this.products);
    this.resetmodifyProductForm();

  }

  deleteProduct(){
    console.log(this.detailProduct.serial);
    this.products.splice(this.detailProduct.serial,1);
    this.deleteImage();
    this.crudService.updateProducts(this.uid,this.products);
    //this.viewProduct=this.products;
    //this.controlTab();
    // this.resetPagination();
    this.filterProduct(this.products);
    this.allowActive=true;
    this.tab=0;

  }

  addCategory(input:string){
    this.categories.push(input);
    this.crudService.updateCategories(this.uid,this.categories);
  }

  deleteCategory(index:number){
    this.categories.splice(index,1);
    this.crudService.updateCategories(this.uid,this.categories);
  }

  chooseUnit(unit:string){
    this.detailProduct.unit=this.product.unit=unit;
    this.boxActive=0;
  }

  filterCategory(key:string){
    if (key=='Tất cả') this.viewProduct=this.products;
    else
    this.viewProduct=this.products.filter(pdt=>pdt.category==key);
    this.filterProduct(this.viewProduct);
  }

  changeUnit(serial:number,value:string){
    this.products[serial].unit=value;
    this.crudService.updateProducts(this.uid,this.products);
  }



  sortByUp(key:string){
    for (let i=0;i<this.products.length-1;i++){
      for (let j=i+1;j<this.products.length;j++){
        if (this.products[i][key]>this.products[j][key])
        {
          let temp=this.products[i];
          this.products[i]=this.products[j];
          this.products[j]=temp;
        }
      }
    }

  }

  sortByDown(key:string){
    for (let i=0;i<this.products.length-1;i++){
      for (let j=i+1;j<this.products.length;j++){
        if (this.products[i][key]<this.products[j][key])
        {
          let temp=this.products[i];
          this.products[i]=this.products[j];
          this.products[j]=temp;
        }
      }
    }
  }

  sortByNameProduct(){
    if (this.sortByNameProductActive)
      this.sortByUp('name');
      else if (!this.sortByNameProductActive)
        this.sortByDown('name');
    this.sortByNameProductActive=!this.sortByNameProductActive;
    this.filterProduct(this.products);
  }


}





