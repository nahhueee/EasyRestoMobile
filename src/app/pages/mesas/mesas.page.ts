import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { IonContent,IonHeader, IonToolbar, IonSegment, IonSegmentButton, IonLabel } from '@ionic/angular/standalone';
import { MesasService } from 'src/app/services/mesas.service';
import { Mesa } from 'src/app/models/Mesa';
import { Salon } from 'src/app/models/Salon';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { RecargaService } from 'src/app/services/recarga.service';

@Component({
  selector: 'app-mesas',
  templateUrl: './mesas.page.html',
  styleUrls: ['./mesas.page.scss'],
  standalone: true,
  imports: [IonLabel, IonSegmentButton, IonSegment, 
    CommonModule, 
    FormsModule,
    ReactiveFormsModule,
    IonContent,
    IonToolbar, 
    IonHeader, 
  ]
})
export class MesasPage implements OnInit {
  sub!: Subscription;

  mesas: Mesa[] = [];
  salones: Salon[] = [];
  salonSeleccionado:number = 0;

  constructor(
    private router:Router,
    private mesasService:MesasService,
    private recargaService: RecargaService
  ) { }

  ngOnInit() {
    this.ObtenerSalones();

    this.sub = this.recargaService.reload$.subscribe(tab => {
      if (tab === 'mesas') {
        this.ObtenerMesas(1);
      }
    });
  }

  ObtenerSalones(){
    this.mesasService.ObtenerSalones()
      .subscribe(response => {
        this.salones = response;
        this.salonSeleccionado = this.salones[0].id!;
        this.ObtenerMesas(this.salonSeleccionado);
    });
  }

  ObtenerMesas(idSalon:number){
    this.mesasService.ObtenerMesas(idSalon)
      .subscribe(response => {
        this.mesas = response;
      });
  }

  NuevoPedido(mesa:Mesa){
    this.router.navigate(['/nuevo-pedido', mesa.codigo]);
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}
