import { Product } from "./products";
import { Profile } from "./profile";

export class User{
  constructor(public profile:Profile,public products:Product[],public categories:any[],public units:any[]){}
}
