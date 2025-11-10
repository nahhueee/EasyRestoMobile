import { Cargo } from "./Cargo";
import { Rol } from './Rol';

export class Usuario{
  id? : number;
  nombre?: string;
  email?: string;
  pass?: string;
 
  cargo?: Cargo = new Cargo();
  rol?: Rol = new Rol();

  constructor(data?: any) {
    if (data) {
      this.id = data.id;
      this.nombre = data.nombre;
      this.email = data.email;
      this.pass = data.pass;
      this.cargo = new Cargo({
        id: data.idCargo,
        nombre: data.cargo
      });
      this.rol = new Rol({
        id: data.idRol,
        nombre: data.rol
      });
    }
  }
}

