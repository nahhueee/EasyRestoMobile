export class Mesa{
    id? : number;
    codigo? : string;
    numero? : number;
    nombre? : string; // Solo para la pantalla de nueva venta
    idSalon?: number;
    idPedido?:number;
    codGrupo: string = "";
    combinada?:string;
    principal?:boolean;
    asignacion?:number;
    usuarioAsignado?:string;
    seleccionada:boolean = false
    estado?:string;

    constructor(data?: any) {
      if (data) {
        this.id = data.id;
        this.codigo = data.codigo;
        this.numero = data.numero;
        this.nombre = data.nombre;
        this.idSalon = data.idSalon;
        this.idPedido = data.idPedido;
        this.combinada = data.combinada;
        this.principal = data.principal;
        this.asignacion = data.asignacion;
        this.usuarioAsignado = data.usuarioAsignado;
        this.estado = data.estado;
      }
    }
  }
  
  