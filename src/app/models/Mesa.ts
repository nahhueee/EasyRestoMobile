export class Mesa{
    id? : number;
    codigo? : string;
    idSalon?: number;
    idPedido?:number;
    codGrupo: string = "";
    combinada?:string;
    principal?:boolean;
    asignacion?:number;
    usuarioAsignado?:string;
    seleccionada:boolean = false

    constructor(data?: any) {
      if (data) {
        this.id = data.id;
        this.codigo = data.codigo;
        this.idSalon = data.idSalon;
        this.idPedido = data.idPedido;
        this.combinada = data.combinada;
        this.principal = data.principal;
        this.asignacion = data.asignacion;
        this.usuarioAsignado = data.usuarioAsignado;
      }
    }
  }
  
  