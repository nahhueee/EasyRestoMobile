import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DecimalFormatPipe } from '../../../pipes/decimal.pipe';
import { ActionSheetController } from '@ionic/angular';
import { 
  IonContent, 
  IonHeader, 
  IonToolbar, 
  IonFab, 
  IonFabButton, 
  IonIcon, 
  IonLabel, 
  IonSegmentButton,
  IonSegment,
  IonList,
  IonItem, 
  IonInfiniteScroll,
  IonInfiniteScrollContent, IonButton, IonActionSheet, IonRefresher, IonRefresherContent } from '@ionic/angular/standalone';
import { FiltroPedido } from 'src/app/models/Filtros/FiltroPedido';
import { PedidosService } from 'src/app/services/pedidos.service';
import { NotificacionesService } from 'src/app/services/notificaciones.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { RecargaService } from 'src/app/services/recarga.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { FilesService } from 'src/app/services/files.service';
import moment from 'moment';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.page.html',
  styleUrls: ['./pedidos.page.scss'],
  standalone: true,
  imports: [IonRefresherContent, IonRefresher, IonActionSheet, IonButton, 
    IonSegmentButton, 
    IonLabel, 
    IonFab, 
    CommonModule, 
    FormsModule,
    IonContent,
    IonToolbar,
    IonHeader,
    IonSegment,
    IonFabButton,
    IonIcon,
    IonList,
    IonItem,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    DecimalFormatPipe
  ]
})
export class PedidosPage implements OnInit {
  sub!: Subscription;
  valorInicial:string = "pendientes";
  
  pagina:number = 1;
  total:number = 0;
  finalizados:boolean = false;
  idResponsable:number = 0;

  pedidos:any[] = [];
  
  constructor(
    private router:Router,
    private pedidosService:PedidosService,
    private actionSheetCtrl: ActionSheetController,
    private Notificaciones: NotificacionesService,
    private recargaService: RecargaService,
    private usuarioService: UsuariosService,
    private filesService: FilesService
  ) { 
    const sesion = this.usuarioService.GetSesion();
    if (sesion) {
      this.idResponsable = parseInt(sesion.data.idUsuario);
    }
  }

  ngOnInit() {
    this.sub = this.recargaService.reload$.subscribe(tab => {
      this.ObtenerPedidos();
    });

    this.ObtenerPedidos();
  }

  handleRefresh(event: any) {
    this.ObtenerPedidos(); 
    setTimeout(() => {
      event.target.complete(); // detiene la animación de refresco
    }, 1000);
  }

  ObtenerPedidos(event?: any){
    const filtro = new FiltroPedido();
    filtro.pagina = this.pagina,
    filtro.tamanioPagina = 15;
    filtro.tipoPedido = 1;
    filtro.finalizado = this.finalizados;
    filtro.responsable = this.idResponsable;
    filtro.idPedido = 0; 

    // Obtiene listado de pedidos y el total
    this.pedidosService.ObtenerPedidos(filtro)
        .subscribe(response => {

          this.total = response.total;

          // Si es scroll, agregamos; si no, reemplazamos
          if (event) {
            this.pedidos.push(...response.registros);
            event.target.complete(); // fin de scroll
          } else {
            this.pedidos = response.registros; // reinicio por cambio de filtro
          }
          
          if (event) {
            event.target.complete(); // indica fin de scroll
          }

          // Si ya no hay más datos
          if (this.pedidos.length >= this.total && event) {
            event.target.disabled = true;
          }
    });
  }

  CargarDatos(event: any) {
    this.pagina++;
    this.ObtenerPedidos(event);
  }

  NuevoPedido(){
    this.router.navigate(['/nuevo-pedido/0']);
  }

  ModificarPedido(idPedido:number){
    this.router.navigateByUrl('/actualizar-pedido/' + idPedido);
  }

  async AbrirAcciones(item: any) {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Acciones',
      buttons: [
        { text: 'Imprimir Comprobante', icon: 'receipt-outline', handler: () => this.ImprimirComprobante(item) },
        { text: 'Imprimir Comanda', icon: 'document-outline', handler: () => this.ImprimirComanda(item) },
        { text: 'Cancelar', icon: 'close-outline', role: 'cancel' }
      ]
    });
    await actionSheet.present();
  }

  // Métodos de impresión
  ImprimirComprobante(item: any) {
    this.filesService.ImprimirPDF('comprobante', item, 'interno')
    .subscribe(response => {
      if(response == 'OK'){
        this.Notificaciones.success("Comprobante impreso", 2000);

        item.ticketImp = moment().format("DD/MM/YY HH:mm");
        this.pedidosService.ActualizarEstadoImpreso(item.id!, item.ticketImp!, item.comandaImp!);
      }
    });

    //Para ver y descargar
    // this.filesService.VerComprobante(item, 'interno').subscribe(response => {
    //   const blob = new Blob([response], { type: 'application/pdf' });
    //   const url = window.URL.createObjectURL(blob);
    //   const a = document.createElement('a');
    //   a.href = url;
    //   a.download = 'Comprobante.pdf';
    //   a.click();
    //   window.URL.revokeObjectURL(url);
    // });
  }

  ImprimirComanda(item: any) {
    this.filesService.ImprimirPDF('comanda', item, '')
    .subscribe(response => {
      if(response == 'OK'){
        this.Notificaciones.success("Comanda impresa", 2000);
        item.comandaImp = moment().format("DD/MM/YY HH:mm");
        this.pedidosService.ActualizarEstadoImpreso(item.id!, item.ticketImp!, item.comandaImp!);
      }
    });

    //Para ver y descargar
    // this.filesService.VerComanda(item).subscribe(response => {
    //   const blob = new Blob([response], { type: 'application/pdf' });
    //   const url = window.URL.createObjectURL(blob);
    //   const a = document.createElement('a');
    //   a.href = url;
    //   a.download = 'Comanda.pdf';
    //   a.click();
    //   window.URL.revokeObjectURL(url);
    // });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  // async ImprimirComprobante(tipo:string, pedido:Pedido){
  //   const impreso = await this.comprobantesService.ImprimirComprobante(tipo, pedido);
  //   if(impreso){
  //     pedido.ticketImp = moment().format("DD/MM/YY HH:mm");
  //     this.pedidosService.ActualizarEstadoImpreso(pedido.id!, pedido.ticketImp!, pedido.comandaImp!);
  //   }
  // }

  // async ImprimirComanda(pedido:Pedido){
  //   const impreso = await this.comandaService.ImprimirComanda(pedido);
  //   if(impreso){
  //     pedido.comandaImp = moment().format("DD/MM/YY HH:mm");
  //     this.pedidosService.ActualizarEstadoImpreso(pedido.id!, pedido.ticketImp!, pedido.comandaImp!);
  //   }
  // }
}
