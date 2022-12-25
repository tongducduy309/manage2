import { Injectable } from '@angular/core';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection} from '@angular/fire/compat/firestore';
import { User } from '../models/user';
import { Observable, map } from 'rxjs';
import { FieldValue } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class CrudService {
  isLoggedIn=false;
  userscollection!: AngularFirestoreCollection<User>;
  users!: Observable<User[]>;
  user!: User;
  constructor(private firebaseAuth:AngularFireAuth, private firestore:AngularFirestore) {
    this.userscollection = this.firestore.collection('users');
    this.users = this.userscollection.snapshotChanges().pipe(map((actions: any[]) => actions.map(a => {
      const data = a.payload.doc.data();
      const id = a.payload.doc.id;
      //console.log(id);
      return { id,...data };
      })))
  }
  async signin(email:string,password:string){
    await this.firebaseAuth.signInWithEmailAndPassword(email,password)
    .then(res=>{
      this.isLoggedIn=true;
      localStorage.setItem('user',JSON.stringify(res.user));
    },error=>{
      console.log("Error");
    });
  }
  async signup(email:string,password:string){
    await this.firebaseAuth.createUserWithEmailAndPassword(email,password)
    .then(res=>{
      this.isLoggedIn=true;
      localStorage.setItem('user',JSON.stringify(res.user));
      this.addUser(res.user?.uid,res.user?.email);
    },error=>{
      console.log("Error");
    });
  }
  logout(){
    this.firebaseAuth.signOut();
    localStorage.removeItem("user");
  }
  addUser(uid:any,email:any){
    this.firestore.collection('users').doc(uid).set({
      uid:uid,
      email:email,
      name:"",
      nameStore:"",
      phone:""
    })
  }
  getUsers(){
    return this.users;
  }

  addProduct(uid:string,products:any){
    this.firestore.collection('users').doc(uid).update({
      products:products
    })
  }

  updateProducts(uid:string,products:any){
    this.firestore.collection('users').doc(uid).update({
      products:products
    })
  }
  updateCategories(uid:string,categories:any){
    this.firestore.collection('users').doc(uid).update({
      categories:categories
    })
  }
  updateUnits(uid:string,units:any){
    this.firestore.collection('users').doc(uid).update({
      units:units
    })
  }




}


