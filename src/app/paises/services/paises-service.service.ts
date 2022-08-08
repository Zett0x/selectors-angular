
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';
import { Country, PaisSmall } from '../interfaces/paises.interface';

@Injectable({
  providedIn: 'root'
})
export class PaisesServiceService {

  private _baseURL:string='https://restcountries.com/v2';
  private _regions:string[]=['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];


  get regions():string[]{
    return [...this._regions];
  }
  constructor(private http:HttpClient) { }

  getCountriesByRegion(region:string):Observable<PaisSmall[]>{
    const url:string=`${this._baseURL}/region/${region}?fields=alpha3Code,name`;
    return this.http.get<PaisSmall[]>(url);

  }

  getCountryByCode(code:string):Observable<Country | null>{

    if(!code) return of(null);
    const url:string=`${this._baseURL}/alpha/${code}`
    return this.http.get<Country>(url);
  }

  getCountryByCodeSmall(code:string):Observable<PaisSmall>{

    const url:string=`${this._baseURL}/alpha/${code}?fields=name,alpha3Code`
    return this.http.get<PaisSmall>(url);
  }

  getCountriesByCodes(borders:string[]):Observable<PaisSmall[]>{
    if(!borders) return of([]);

    const peticiones:Observable<PaisSmall>[]=[];
    borders.forEach(codigo=>{
      const peticion=this.getCountryByCodeSmall(codigo);
      peticiones.push(peticion);
    })

    return combineLatest(peticiones);
  }
}
