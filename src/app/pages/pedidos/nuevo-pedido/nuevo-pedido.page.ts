import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { DecimalFormatPipe } from '../../../pipes/decimal.pipe';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar, 
  IonButtons, 
  IonButton, 
  IonIcon, 
  IonModal, 
  IonItem, 
  IonInput, 
  IonFooter, 
  IonSegment, 
  IonSegmentButton, 
  IonActionSheet,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonLabel, IonTab, IonTabs, IonTabBar, IonTabButton, IonList, IonFab, IonFabButton } from '@ionic/angular/standalone';
import { PedidosService } from 'src/app/services/pedidos.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Categoria } from 'src/app/models/Categoria';
import { FiltroProducto } from 'src/app/models/FiltroProducto';
import { ProductosService } from 'src/app/services/productos.service';
import { Producto } from 'src/app/models/Producto';
import { ActionSheetController } from '@ionic/angular';
import { NotificacionesService } from 'src/app/services/notificaciones.service';
import { ProductoPrecio } from 'src/app/models/ProductoPrecio';
import { ProductoAdicional } from 'src/app/models/ProductoAdicional';
import { DetallePedido } from 'src/app/models/DetallePedido';
import { TipoPedido } from 'src/app/models/TipoPedido';
import { ListaPrecio } from 'src/app/models/ListaPrecio';
import { Mesa } from 'src/app/models/Mesa';
import { MesasService } from 'src/app/services/mesas.service';
import { Pedido } from 'src/app/models/Pedido';
import { Usuario } from 'src/app/models/Usuario';
import { RecargaService } from 'src/app/services/recarga.service';

@Component({
  selector: 'app-nuevo-pedido',
  templateUrl: './nuevo-pedido.page.html',
  styleUrls: ['./nuevo-pedido.page.scss'],
  standalone: true,
  imports: [IonFabButton, IonFab, IonList, IonTabButton, IonTabBar, IonTabs, IonTab, IonFooter, IonTextarea,
    IonInput, 
    IonItem, 
    IonModal, 
    IonButtons, 
    IonButton, 
    IonIcon, 
    IonContent, 
    IonHeader, 
    IonTitle, 
    IonToolbar, 
    CommonModule, 
    FormsModule, 
    IonSegment, 
    IonSelect, 
    IonSelectOption,
    IonSegmentButton,
    IonLabel,
    IonActionSheet,
    DecimalFormatPipe,
  ]
})
export class NuevoPedidoPage implements OnInit {
  mesaParametro: number = 0;
  pedidoParametro: number = 0;
  titulo:string = "Nuevo Pedido";

  //#region ELEGIR VARIEDADES
  categorias:Categoria[] = [];
  primerasCategorias:Categoria[] = [];
  categoriaSeleccionada:Categoria | undefined;
  producto:string = "";
  
  productos:Producto[] = [];
  detallePedido:DetallePedido[] = [];
  dataSource:any;
  
  ultimoAgregado: DetallePedido = new DetallePedido();

  pagina:number = 1;
  total:number = 0;

  @ViewChild('modalCategorias', { static: false }) modalCategorias!: IonModal;
  //#endregion

  //#region CONFIRMAR PEDIDO
  tiposPedido: TipoPedido[] = []
  tipoSeleccionado: number = 0;
  listasPrecio: ListaPrecio[] =[];
  listaPrecioSeleccionada: number = 0;
  mesas:Mesa[]=[];
  mesaSeleccionada:number = 0;
  cliente:string = "";

  cantItems:number = 0;
  totalItems:number = 0;
  advertencia:string = "";

  modalAbierto:string = "";
  itemModalSeleccionado:number = 0;
  productoSeleccionado:string = "";
  observacion:string = "";

  @ViewChild('modalObs', { static: false }) modalObs!: IonModal;

  pedido:Pedido = new Pedido();
  //#endregion


  constructor(
    private navCtrl: NavController,
    private pedidosService: PedidosService,
    private productosService: ProductosService,
    private mesasService:MesasService,    
    private rutaActiva:ActivatedRoute,
    private router: Router,
    private actionSheetCtrl: ActionSheetController,
    private Notificaciones: NotificacionesService,
    private recargaService: RecargaService
  ) { }

  ngOnInit() {
    this.ObtenerCategorias();
    this.ObtenerListasPrecio();
    this.ObtenerTiposPedido();
    this.ObtenerMesas();
  }

  ngAfterViewInit(): void {
    if (this.rutaActiva.snapshot.paramMap.has('mesa')) {
      //Recibimos un numero de mesa desde el parametro
      this.mesaParametro = parseInt(this.rutaActiva.snapshot.params['mesa']);
      this.mesaSeleccionada = this.mesaParametro
    } else if (this.rutaActiva.snapshot.paramMap.has('idPedido')) {
      //Recibimos el nro de pedido a modificar desde parametro
      this.pedidoParametro = parseInt(this.rutaActiva.snapshot.params['idPedido']);
      this.titulo = "Editar Pedido";
      this.ObtenerPedido(this.pedidoParametro);
    }
  }

  //#region BUSCAR Y SELECCIONAR VARIEDADES
  BuscarProductos(event?: any){
    if(this.producto == "" && this.categoriaSeleccionada == undefined){
      this.productos = [];
      return;
    } 

    const filtro = new FiltroProducto();
    filtro.pagina = this.pagina,
    filtro.tamanioPagina = 10;
    filtro.busqueda = this.producto;
    filtro.categoria = this.categoriaSeleccionada ? this.categoriaSeleccionada.id! : 0; 

    // Obtiene listado de pedidos y el total
    this.productosService.ObtenerProductos(filtro)
        .subscribe(response => {

          this.total = response.total;

          // Si es scroll, agregamos; si no, reemplazamos
          if (event) {
            this.productos.push(...response.registros);
            event.target.complete(); // fin de scroll
          } else {
            this.productos = response.registros; // reinicio por cambio de filtro
          }
          
          if (event) {
            event.target.complete(); // indica fin de scroll
          }

          // Si ya no hay más datos
          if (this.productos.length >= this.total && event) {
            event.target.disabled = true;
          }
    });
  }

  CargarDatos(event: any) {
    this.pagina++;
    this.BuscarProductos(event);
  }

  async SeleccionarProducto(producto: Producto) {
    let varianteSeleccionada: ProductoPrecio;

    // Si tiene variantes
    if (producto.precios && producto.precios.length > 1) {
      const botonesVariante = producto.precios.map((p: any) => ({
        text: `${p.descripcion} - ${p.precio.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}`,
        role: '',
        handler: () => {
          varianteSeleccionada = p;
          this.SeleccionarAdicionales(producto, varianteSeleccionada);
        }
      }));

      botonesVariante.push({ text: 'Cancelar', role: 'cancel', handler: () => {} });

      const actionSheet = await this.actionSheetCtrl.create({
        header: 'Seleccioná una variante',
        buttons: botonesVariante
      });

      await actionSheet.present();
    } 
    else {
      // No hay variantes
      varianteSeleccionada = producto.precios ? producto.precios[0] : new ProductoPrecio();
      await this.SeleccionarAdicionales(producto, varianteSeleccionada);
    }
  }

  async SeleccionarAdicionales(producto: Producto, variante:ProductoPrecio) {
    let adicionalSeleccionado: ProductoAdicional | undefined = undefined;

    // Si tiene adicionales
    if (producto.adicionales && producto.adicionales.length > 0) {
      const botonesAdicionales = producto.adicionales.map((a: any) => ({
        text: a.adicional.descripcion,
        role: '',
        handler: () => {
          adicionalSeleccionado = a;
          this.AgregarProducto(producto, variante, adicionalSeleccionado)
        }
      }));

      botonesAdicionales.push({ text: 'Sin adicional', role: 'cancel', handler: () => this.AgregarProducto(producto, variante, adicionalSeleccionado) });

      const actionSheet = await this.actionSheetCtrl.create({
        header: 'Seleccioná adicional',
        buttons: botonesAdicionales
      });

      await actionSheet.present();
    } 
    else {
      // Sin adicionales
      this.AgregarProducto(producto, variante, adicionalSeleccionado);
    }
  }

  AgregarProducto(producto:Producto, variante:ProductoPrecio, adicional:ProductoAdicional | undefined = undefined){
    let nombre = producto.nombre + (variante.descripcion == "TRADICIONAL" ? "" : " " + variante.descripcion);
    if(adicional != undefined) nombre += " - " + adicional.adicional!.descripcion;

    // Buscar si ya existe el producto con ese id y nombre
    const existente = this.detallePedido.find(
      d => d.idProducto === producto.id && d.producto === nombre
    );

    if (existente) {
      // Si ya existe, actualizo cantidad y totales
      existente.cantidad! += 1;
      existente.total = existente.unitario! * existente.cantidad!;
    } else {
      
      // Si no existe, creo uno nuevo
      const detPedido = new DetallePedido();
      detPedido.id = 0;
      detPedido.idPedido = 0;
      detPedido.idProducto = producto.id;
      detPedido.producto = nombre;
      detPedido.tipoProd = producto.tipo!;
      detPedido.cantidad = 1;
      detPedido.unitario = variante.precio;
      detPedido.total = variante.precio;
      detPedido.obs = "";

      this.ultimoAgregado = detPedido;
      this.detallePedido.push(detPedido);
    }
    
    this.RecontarTotales();
    this.Notificaciones.success("Producto agregado", 1500);
  }

  RepetirUltimo(){
    const existente = this.detallePedido.find(
      d => d.idProducto === this.ultimoAgregado.idProducto && d.producto === this.ultimoAgregado.producto
    );

     if (existente) {
      // Si ya existe, actualizo cantidad y totales
      existente.cantidad! += 1;
      existente.total = existente.unitario! * existente.cantidad!;
    }

    this.RecontarTotales();
    this.Notificaciones.success("Producto agregado", 1500);
  }
  //#endregion

  //#region CATEGORIAS
  ObtenerCategorias(){
    this.pedidosService.ObtenerCategorias()
      .subscribe(response => {
        this.categorias = response;
        this.primerasCategorias = this.categorias.slice(0, 2);
      });
  }

  AbrirModalCategorias(){
    this.modalCategorias.present();
  }

  CerrarModalCategorias(categoria?:Categoria){
    if(categoria){
      this.categoriaSeleccionada = categoria;
      this.BuscarProductos();
      this.modalCategorias.dismiss();
    }else{
      this.modalCategorias.dismiss();
    }
  }
  //#endregion

  //#region CONFIRMAR PEDIDO
  ObtenerPedido(idPedido:number){
    this.pedidosService.ObtenerPedido(idPedido)
    .subscribe(response => {
      this.pedido = response;
      //this.formulario.get('responsable')?.setValue(this.pedido.responsable?.id);
      this.tipoSeleccionado = this.pedido.tipo?.id!;
      this.mesaSeleccionada = this.pedido.mesa?.id!;
      this.cliente = this.pedido.cliente!;
      this.detallePedido = this.pedido.detalles!;
      this.RecontarTotales();
    });
  }

  ObtenerTiposPedido() {
    this.pedidosService.SelectorTipos()
      .subscribe(response => {
        this.tiposPedido = response.map((item: any) => {
          let icono = 'cube-outline'; // ícono por defecto
         
          switch (item.nombre) {
            case 'RESTAURANTE':
              icono = 'restaurant-outline';
              break;
            case 'RETIRA':
              icono = 'bag-handle-outline';
              break;
            case 'DELIVERY':
              icono = 'rocket-outline';
              break;
          }

          return { ...item, icono };
        });

        this.tipoSeleccionado = this.tiposPedido[0]?.id!;
      });
  }

  SeleccionoTipo(event: any){
    const seleccionado = event.detail.value;
    if(seleccionado == 1){
      this.listaPrecioSeleccionada = this.listasPrecio[0].id!;
    }else{
      this.listaPrecioSeleccionada = this.listasPrecio[1].id!;
    }
  }

  ObtenerMesas(){
    this.mesasService.ObtenerMesas(0)
      .subscribe(response => {
        this.mesas = response;
      });
  }

  ObtenerListasPrecio(){
    this.pedidosService.SelectorListas()
      .subscribe(response => {
        this.listasPrecio = response;
        this.listaPrecioSeleccionada = this.listasPrecio[0].id!;
      });
  }

  QuitarItem(index: number) {
    this.detallePedido.splice(index, 1);
    this.RecontarTotales()
  }

  AbrirModalObs(item:number, modal:string){
    this.modalAbierto = modal;
    this.itemModalSeleccionado = item;

    if(this.modalAbierto == 'producto'){
      this.productoSeleccionado = this.detallePedido[this.itemModalSeleccionado].producto!;
      this.observacion = this.detallePedido[item].obs ?? "";
    }else if(this.modalAbierto == 'pedido'){
      this.productoSeleccionado = "";
      this.observacion = this.pedido.obs ?? "";
    }
    
    this.modalObs.present();
  }

  ConfimarObs(){
    if(this.modalAbierto == 'producto'){
      this.detallePedido[this.itemModalSeleccionado].obs = this.observacion;
    }else{
      this.pedido.obs = this.observacion
    }

    this.observacion = "";
    this.CerrarModalObs();
  }

  CerrarModalObs(){
    this.modalObs.dismiss();
  }

  GuardarPedido() {
    if(this.pedidoParametro != 0){
      if(this.pedido.finalizado){
        this.Notificaciones.warn("No se puede modificar un pedido finalizado");
        return;
      }
    }


    const fechaActual = new Date();

    // Obtener horas y minutos 
    const horas = fechaActual.getHours();
    const minutos = fechaActual.getMinutes();
    
    this.pedido.fecha = fechaActual;
    this.pedido.hora = `${horas}:${minutos}`;
    this.pedido.cliente = this.cliente;
    this.pedido.total = this.totalItems;
    
    if(this.mesaSeleccionada==0){this.mesaSeleccionada = 1}
    var mesa = new Mesa();
    mesa.id = this.mesaSeleccionada;
    this.pedido.mesa = mesa;

    // let responsable:string = this.formulario.get('responsable')?.value;
    // if(responsable=="") responsable = this.authService.GetUsuarioId()!;
    
    var mozo = new Usuario();
    mozo.id = 1;
    this.pedido.responsable = mozo;

    var tipoPedido = new TipoPedido();
    tipoPedido.id = this.tipoSeleccionado;
    this.pedido.tipo = tipoPedido;

    this.pedido.detalles = this.detallePedido;

    this.pedidosService.Guardar(this.pedido)
    .subscribe(response => {
      if(response=='OK'){
        if(this.pedidoParametro != 0){
          this.Notificaciones.success("Pedido modificado correctamente");
        }else{
          this.Notificaciones.success("Pedido creado correctamente");
        }
        
        if(this.mesaParametro == 0){
          this.router.navigate(['inicio', 'pedidos']);
          this.recargaService.emitirRecarga('pedidos')
        }
        else{
          this.router.navigate(['inicio', 'mesas']);
          this.recargaService.emitirRecarga('mesas')
        }

      }else{
        this.Notificaciones.warn("Error al guardar pedido");
      }
    });
  }
  
  RecontarTotales() {
    this.cantItems = this.detallePedido.reduce((acc, d) => acc + d.cantidad!, 0);
    this.totalItems = this.detallePedido.reduce((acc, d) => acc + d.total!, 0);

    if(this.pedido.pago){
      if(this.pedido.pago.descuento!= null && this.pedido.pago.descuento!= 0){
        this.totalItems = this.totalItems - (this.totalItems * (this.pedido.pago.descuento / 100));
        this.advertencia = this.pedido.pago.descuento + "% de descuento aplicado"
      }
      if(this.pedido.pago.recargo!= null && this.pedido.pago.recargo!= 0){
        this.totalItems = this.totalItems + (this.totalItems * (this.pedido.pago.recargo / 100));
        this.advertencia = this.pedido.pago.recargo + "% de recargo aplicado"
      }
    }
  }
  //#endregion

  Volver() {
    this.navCtrl.back(); 
  }
}
