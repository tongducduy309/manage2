export class Product{
  constructor (public id:string,public urlImg:string,public name:string,public category:string,public trademark:string,public costPrice:number,public retailPrice:number,public wholesalePrice:number,public unit:string,public barcode:string,public numWarning:number,public allow:boolean,public greatSelling:boolean){}

}
export function productObj({id='',urlImg='',name='',category='',trademark='',costPrice=0,retailPrice=0,wholesalePrice=0,unit='',barcode='',numWarning=0, allow=true,greatSelling=false}){
  return{
    id:id,
    urlImg:urlImg,
    name:name,
    category:category,
    trademark:trademark,
    costPrice:costPrice,
    retailPrice:retailPrice,
    wholesalePrice:wholesalePrice,
    unit:unit,
    barcode:barcode,
    numWarning:numWarning,
    allow:allow,
    greatSelling:greatSelling
  }
}
