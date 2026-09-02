import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
  LoadingController,
  IonTextarea,
  IonLabel, 
  IonList, IonInfiniteScroll, IonInfiniteScrollContent } from '@ionic/angular/standalone';
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
import { UsuariosService } from 'src/app/services/usuarios.service';
import { ParametrosService } from 'src/app/services/parametros.service';
import moment from 'moment';
import { FilesService } from 'src/app/services/files.service';
import { firstValueFrom } from 'rxjs';

// Paleta para el avatar de iniciales cuando el producto no tiene imagen
// (o mostrarImg esta desactivado). Colores fijos e independientes del tema
// -son para diferenciar productos entre si, no para status/semantica.
const PALETA_AVATAR = ['#ef4444', '#f97316', '#f59e0b', '#84cc16', '#10b981', '#0ea5e9', '#6366f1', '#a855f7'];

@Component({
  selector: 'app-nuevo-pedido',
  templateUrl: './nuevo-pedido.page.html',
  styleUrls: ['./nuevo-pedido.page.scss'],
  standalone: true,
  imports: [IonInfiniteScrollContent, IonInfiniteScroll, IonList, IonFooter, IonTextarea,
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
  ipServidor:string = "";
  mesaParametro: number = 0;
  pedidoParametro: number = 0;
  titulo:string = "Nuevo Pedido";
  mostrarImg:boolean = false;
  // Gatea el boton "Imprimir comprobante" en la pantalla de Guardado -misma
  // condicion que ya usa la lista de Pedidos (pedidos.page.ts).
  permitirImpComprobante:boolean = false;
  idCaja:number = 0;

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

  @ViewChild('filaCategorias') filaCategorias!: ElementRef<HTMLDivElement>;
  @ViewChild('modalCategorias', { static: false }) modalCategorias!: IonModal;
  @ViewChild('obsInput') obsInput!: IonTextarea;

  // Flujo lineal (ex ion-tabs): un solo paso visible a la vez.
  paso: 'productos' | 'confirmar' | 'guardado' = 'productos';

  // Productos cuya imagen fallo al cargar (404, url invalida, etc.) -se
  // les muestra el mismo avatar-inicial que a los que no tienen imagen.
  imagenesFallidas = new Set<number>();
  //#endregion

  //#region CONFIRMAR PEDIDO
  tiposPedido: TipoPedido[] = []
  tipoSeleccionado: number = 0;
  listasPrecio: ListaPrecio[] =[];
  listaPrecioSeleccionada: number = 0;
  mesas:Mesa[]=[];
  mesaSeleccionada:number = 0;
  cliente:string = "";
  idResponsable:number = 0;
  nombreResponsable:string = "";

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
    private recargaService: RecargaService,
    private usuariosService:UsuariosService,
    private loadingCtrl: LoadingController,
    private parametrosService:ParametrosService,
    private filesService: FilesService
  ) { 
    
    const sesion = this.usuariosService.GetSesion();
    if (sesion) {
      this.idResponsable = parseInt(sesion.data.idUsuario);
      this.nombreResponsable = sesion.data.nombre;
    }

    const apiUrl = localStorage.getItem('apiUrl');
    if (apiUrl) {
      this.ipServidor = new URL(apiUrl).hostname;
    }

    this.mostrarImg  = this.parametrosService.ObtenerParametrosLocal().imagenes!;
    this.permitirImpComprobante = this.parametrosService.ObtenerParametrosLocal().impComprobante!;
  }

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

  async VerificarModoTrabajo(){
    const modoTrabajo = await firstValueFrom(this.parametrosService.ObtenerParametro('modoTrabajo'));
    if(modoTrabajo == 'cajas'){
      this.idCaja =  await firstValueFrom(this.parametrosService.ObtenerUltimaCajaActiva());
      if(this.idCaja == -1){
        this.Notificaciones.warn("No hay cajas activas para agregar un pedido.");
        return false;
      }
    }

    return true;
  }

  //#region BUSCAR Y SELECCIONAR VARIEDADES
  BuscarProductos(event?: any){
    if(this.producto == "" && this.categoriaSeleccionada == undefined){
      this.productos = [];
      return;
    } 

    // "event" solo llega desde el scroll infinito (CargarDatos). Si no hay
    // event, es un cambio de filtro (tipear, borrar, limpiar con la "x" del
    // input) -volvemos siempre a la pagina 1, sino se sigue pidiendo la
    // pagina vieja (ej: si veniamos paginados por scroll) y da resultados
    // incompletos o vacios en vez de todos los productos que corresponden.
    if(!event){
      this.pagina = 1;
    }

    const filtro = new FiltroProducto();
    filtro.pagina = this.pagina,
    filtro.tamanioPagina = 8;
    filtro.busqueda = this.producto;
    filtro.categoria = this.categoriaSeleccionada ? this.categoriaSeleccionada.id! : 0; 

    // Obtiene listado de pedidos y el total
    this.productosService.ObtenerProductos(filtro)
        .subscribe(response => {

          this.total = response.total;
          
          let registros:[] = [];

          // Mapeo de registros reemplazando la IP, para que se vean las imagenes
          if(this.mostrarImg){
            registros = response.registros.map((r: any) => ({
              ...r,
              imagen: r.imagen ? r.imagen.replace('127.0.0.1', this.ipServidor) : r.imagen
            }));
          }else{
            registros = response.registros;
          }    

          // Si es scroll, agregamos; si no, reemplazamos
          if (event) {
            this.productos.push(...registros);
            event.target.complete(); // fin de scroll
          } else {
            this.productos = registros; // reinicio por cambio de filtro
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

  LimpiarBuscar() {
    this.producto = '';
    this.BuscarProductos();
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
      d => d.idProducto === producto.id && d.producto === nombre &&  d.quitado === false
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

  // Cuanto de este producto ya esta cargado en el pedido (suma variantes/
  // adicionales, que comparten idProducto), para mostrarlo en la grilla sin
  // tener que ir a "Confirmar".
  CantidadEnCarrito(idProducto:number):number{
    return this.detallePedido
      .filter(d => d.idProducto === idProducto && !d.quitado)
      .reduce((acc, d) => acc + (d.cantidad || 0), 0);
  }

  // Carrito visible: la barra fija del paso "Productos" lleva a "Confirmar".
  IrAConfirmar(){
    this.paso = 'confirmar';
  }

  IrAProductos(){
    this.paso = 'productos';
  }

  // Avatar de iniciales para productos sin imagen (ver PALETA_AVATAR arriba).
  ColorProducto(idProducto:number):string{
    return PALETA_AVATAR[idProducto % PALETA_AVATAR.length];
  }

  InicialProducto(nombre:string):string{
    return nombre ? nombre.trim().charAt(0).toUpperCase() : '?';
  }

  // La imagen existe (producto.imagen tiene url) pero fallo la carga en
  // runtime (404, ip vieja, sin conexion, etc.). Se marca el producto para
  // que el template caiga al avatar-inicial en vez del icono roto del navegador.
  ImagenError(idProducto:number){
    this.imagenesFallidas.add(idProducto);
  }
  //#endregion

  //#region CATEGORIAS
  Categoriaschange(){
    this.productos = [];
    this.pagina = 1;
    this.BuscarProductos();
  }

  // Tocar la categoria ya seleccionada la deselecciona (como en el mockup).
  SeleccionarCategoria(categoria: Categoria){
    this.categoriaSeleccionada = (this.categoriaSeleccionada === categoria) ? undefined : categoria;
    this.Categoriaschange();
  }

  ObtenerCategorias(){
    this.pedidosService.ObtenerCategorias()
      .subscribe(response => {
        this.categorias = response;
        // Hasta 8 categorias en la fila con scroll; si hay mas, el resto
        // queda atras del boton "+" que abre el modal completo.
        this.primerasCategorias = this.categorias.slice(0, 8);
      });
  }

  AbrirModalCategorias(){
    this.modalCategorias.present();
  }

  CerrarModalCategorias(categoria?:Categoria){
    if(categoria){
      this.productos = [];
      this.pagina = 1;
      this.categoriaSeleccionada = categoria;

      if(!this.primerasCategorias.includes(categoria)){
        this.primerasCategorias = [categoria, ...this.primerasCategorias.slice(0, 7)];
      }

      this.BuscarProductos();
      this.modalCategorias.dismiss();
      this.filaCategorias?.nativeElement.scrollTo({ left: 0, behavior: 'smooth' });
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

        // Si se vino de tocar una mesa puntual (mesaParametro != 0), el tipo
        // es RESTAURANTE si o si -no tiene sentido pisarlo con el ultimo
        // usado. Si no, se recuerda el ultimo tipo cargado (localStorage,
        // seteado en GuardarPedido) y se cae al primero de la lista si
        // todavia no se guardo ninguno.
        if(this.mesaParametro != 0){
          this.tipoSeleccionado = this.tiposPedido.find(t => t.id === 1)?.id ?? this.tiposPedido[0]?.id!;
        }else{
          const ultimoTipo = Number(localStorage.getItem('ultimoTipoPedido'));
          const existeUltimoTipo = this.tiposPedido.some(t => t.id === ultimoTipo);
          this.tipoSeleccionado = existeUltimoTipo ? ultimoTipo : this.tiposPedido[0]?.id!;
        }
      });
  }

  ObtenerMesas(){
    let usuario = 0;

    const todasLasMesas = this.parametrosService.ObtenerParametrosLocal().todasMesas;

    if(!todasLasMesas){
      const sesion = this.usuariosService.GetSesion();
      usuario = sesion ? sesion.data.idUsuario : 0;
    }
    this.mesasService.ObtenerMesas(0, usuario)
      .subscribe(response => {
        this.mesas = response;
      });
  }

  ObtenerListasPrecio(){
    this.pedidosService.SelectorListas()
      .subscribe(response => {
        this.listasPrecio = response;
        // Mismo criterio que EasyRestoApp (det-pedidos.component.ts, pedido
        // de Nahu 2026-07-21): siempre RESTAURANTE (id 1) sin importar el
        // tipo de pedido -antes Retira/Delivery autoseleccionaban PARA
        // LLEVAR (id 2). El selector manual de lista de precio sigue
        // disponible por si hace falta overridear en un caso puntual, y
        // cambiar el tipo de pedido ya no lo pisa (ver SeleccionoTipo, se saco).
        this.listaPrecioSeleccionada = 1;
      });
  }

  QuitarItem(index: number) {
    const item = this.detallePedido[index];
    if(item.id == 0)
      this.detallePedido.splice(index, 1);
    else
      item.quitado = true;

    this.RecontarTotales()
  }

  Incrementar(index:number){
    const item = this.detallePedido[index];
    item.cantidad = (item.cantidad || 0) + 1;
    item.total = item.unitario! * item.cantidad;
    this.RecontarTotales();
  }

  Decrementar(index:number){
    const item = this.detallePedido[index];
    // A 0 seguimos el mismo camino que QuitarItem (splice si es nuevo,
    // quitado=true si es de un pedido ya guardado) -no duplicamos esa logica.
    if((item.cantidad || 0) <= 1){
      this.QuitarItem(index);
      return;
    }
    item.cantidad = item.cantidad! - 1;
    item.total = item.unitario! * item.cantidad;
    this.RecontarTotales();
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

  FocusInput() {
    if (this.obsInput) {
      this.obsInput.setFocus(); 
    }
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

  async GuardarPedido() {
    const continuar = await this.VerificarModoTrabajo();
    if(!continuar) return;

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
    
    if(this.idCaja > 0)
      this.pedido.idCaja = this.idCaja;
     
    // Antes esto corria siempre, sin importar el tipo de pedido: en
    // Retira/Delivery "this.mesas" puede estar vacio (0 mesas libres, o el
    // usuario no tiene mesas asignadas) y mesas[0] rompia con "Cannot read
    // properties of undefined". Ademas, aun sin explotar, le pegaba una mesa
    // cualquiera a pedidos que no la necesitan. Mesa.mesa es opcional en el
    // modelo -para Retira/Delivery directamente no se toca.
    if(this.tipoSeleccionado === 1){
      if(this.mesaSeleccionada==0){this.mesaSeleccionada = this.mesas[0]?.id!}
      var mesa = new Mesa();
      mesa = this.mesas.find(m => m.id == this.mesaSeleccionada)!;
      this.pedido.mesa = mesa;
    }
    this.pedido.responsable = new Usuario({id:this.idResponsable, nombre:this.nombreResponsable});
    
    var tipoPedido = new TipoPedido();
    tipoPedido.id = this.tipoSeleccionado;
    this.pedido.tipo = tipoPedido;

    this.pedido.detalles = this.detallePedido;

    const loading = await this.loadingCtrl.create({
      message: `Guardando Pedido`,
      spinner: 'circles'
    });

    await loading.present();

    this.pedidosService.Guardar(this.pedido)
    .subscribe(async response => {
      if(response!=0){
        this.pedido.id = response;
        // Antes: alert nativo "Si, imprimir/No, cerrar" que sacaba de la
        // pantalla al toque. Ahora es su propio paso -se ve el resumen y se
        // puede imprimir comanda y/o comprobante sin que la primera accion
        // te expulse; "Volver" (SeguirFlujoDespuesDelPedido) es explicito.
        this.paso = 'guardado';

        // Se recuerda para autoseleccionar este tipo la proxima vez que se
        // cargue un pedido sin venir de una mesa puntual (ver ObtenerTiposPedido).
        localStorage.setItem('ultimoTipoPedido', String(this.tipoSeleccionado));
      }else{
        this.Notificaciones.warn("Error al guardar pedido");
      }

      loading.dismiss();
    });
  }

  SeguirFlujoDespuesDelPedido() {
    if (this.mesaParametro == 0) {
      this.router.navigate(['inicio', 'pedidos']);
      this.recargaService.emitirRecarga('pedidos');
    } else {
      this.router.navigate(['inicio', 'mesas']);
      this.recargaService.emitirRecarga('mesas');
    }
  }

  ImprimirComanda() {
    this.filesService.ImprimirPDF('comanda', this.pedido, '')
    .subscribe(async response => {
      if(response == 'OK'){
        this.Notificaciones.success("Comanda impresa", 2000);
        await firstValueFrom(this.pedidosService.ActualizarEstadoImpreso(this.pedido.id, "", moment().format("DD/MM/YY HH:mm")));
      }
    });
  }

  // Calcado de ImprimirComprobante en pedidos.page.ts (misma lista de
  // pedidos), gateado por permitirImpComprobante en la pantalla de Guardado.
  ImprimirComprobante() {
    this.filesService.ImprimirPDF('comprobante', this.pedido, 'interno')
    .subscribe(async response => {
      if(response == 'OK'){
        this.Notificaciones.success("Comprobante impreso", 2000);
        const ticketImp = moment().format("DD/MM/YY HH:mm");
        await firstValueFrom(this.pedidosService.ActualizarEstadoImpreso(this.pedido.id, ticketImp, ""));
      }
    });
  }

  // Texto de destino en la pantalla de Guardado: "Mesa 5" o "Retira · Juan" /
  // "Delivery · Juan" segun el tipo de pedido elegido en Confirmar.
  ResumenTitulo(): string {
    if(this.tipoSeleccionado === 1){
      const mesa = this.mesas.find(m => m.id === this.mesaSeleccionada);
      return mesa ? ('Mesa ' + mesa.codigo) : '';
    }
    const tipo = this.tiposPedido.find(t => t.id === this.tipoSeleccionado);
    const nombreTipo = tipo?.nombre || '';
    return this.cliente ? (nombreTipo + ' · ' + this.cliente) : nombreTipo;
  }
  
  RecontarTotales() {
    this.cantItems = this.detallePedido.filter(dt => !dt.quitado).reduce((acc, d) => acc + d.cantidad!, 0);
    this.totalItems = this.detallePedido.filter(dt => !dt.quitado).reduce((acc, d) => acc + d.total!, 0);

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
    if(this.paso === 'confirmar'){
      this.IrAProductos();
    }else{
      this.navCtrl.back();
    }
  }
}
