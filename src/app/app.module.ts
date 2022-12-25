import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { StorageComponent } from './pages/storage/storage.component';
import { ReactiveFormsModule } from '@angular/forms';
import {provideFirestore,getFirestore} from "@angular/fire/firestore";
import {provideStorage,getStorage} from "@angular/fire/storage";
import {environment} from '../environments/environment';
import { provideFirebaseApp } from '@angular/fire/app';
import { initializeApp } from 'firebase/app';
import {AngularFireModule} from '@angular/fire/compat';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    StorageComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    provideFirebaseApp(()=>initializeApp(environment.firebaseConfig)),
    provideFirestore(()=>getFirestore()),
    provideStorage(()=>getStorage()),
    AngularFireModule.initializeApp(environment.firebaseConfig)


  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
