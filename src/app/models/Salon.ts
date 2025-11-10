export class Salon{
    id? : number;
    descripcion? : string;
    orden? : string;
    
    constructor(data?: any) {
      if (data) {
        this.id = data.id;
        this.descripcion = data.descripcion;
        this.orden = data.orden;
      }
    }
  }
  
  