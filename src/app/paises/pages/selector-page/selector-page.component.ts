import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { switchMap, tap } from 'rxjs';
import { Country, PaisSmall } from '../../interfaces/paises.interface';
import { PaisesServiceService } from '../../services/paises-service.service';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styleUrls: ['./selector-page.component.css']
})
export class SelectorPageComponent implements OnInit {


  miFormulario:FormGroup=this.fb.group({
    region:['',Validators.required],
    pais:['',Validators.required],
    frontera:['',Validators.required]

  })

  // llenar selectores
  regiones:string[]=[];
  paises:PaisSmall[]=[];
  //fronteras:string[]=[];
  fronteras:PaisSmall[]=[];

  cargando:boolean=false;



  constructor(
    private fb:FormBuilder,
    private paisesService:PaisesServiceService
    ) { }

  ngOnInit(): void {
    this.regiones=this.paisesService.regions;
    //cuando cambie la region



    this.miFormulario.get('region')?.valueChanges
    .pipe(
      tap((_)=>{
        this.miFormulario.get('pais')?.reset('');
        this.cargando=true;

      }),
      switchMap(region=>this.paisesService.getCountriesByRegion(region))
    )
    .subscribe(paises=>{
      console.log(paises)
      this.paises=paises;
      this.cargando=false;

    })

    this.miFormulario.get('pais')?.valueChanges
    .pipe(
      tap((_)=>{
        this.fronteras=[];
        this.miFormulario.get('frontera')?.reset('');
        this.cargando=true;

      }),
      switchMap( code=>this.paisesService.getCountryByCode(code)),
      switchMap(pais=>this.paisesService.getCountriesByCodes(pais?.borders!))
    )
    .subscribe(paises=>{
      console.log(paises)
      this.cargando=false;
      this.fronteras=paises;

      /* this.fronteras=pais?.borders || []; */
    })



  }

  guardar(){
    console.log(this.miFormulario.value)
  }

}
