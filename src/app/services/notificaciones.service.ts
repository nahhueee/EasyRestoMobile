// import { Injectable } from '@angular/core';
// import { ToastController } from '@ionic/angular';


// @Injectable({
//   providedIn: 'root'
// })
// export class NotificacionesService {
//   constructor(private toastController: ToastController) {}

//   async success(message:string, duration:number = 2000){
//     const toast = await this.toastController.create({
//       message,
//       duration: duration,
//       color: 'success',
//       position: 'top',
//       animated: false,
//       //icon: 'checkmark-circle-outline'
//     });
//     await toast.present();
//   }

//   async info(message:string, duration:number = 2000){
//     const toast = await this.toastController.create({
//       message,
//       duration: duration,
//       color: 'primary',
//       position: 'top',
//       icon: 'information-circle-outline'
//     });
//     await toast.present();
//   }

//   async warn(message:string, duration:number = 2000){
//     const toast = await this.toastController.create({
//       message,
//       duration: duration,
//       color: 'warning',
//       position: 'top',
//       icon: 'alert-circle-outline'
//     });
//     await toast.present();
//   }

//   async error(message:string, duration:number = 3000){
//     const toast = await this.toastController.create({
//       message,
//       duration: duration,
//       color: 'danger',
//       position: 'top',
//       icon: 'close-circle-outline'
//     });
//     await toast.present();
//   }

// }


import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotificacionesService {

  constructor(private toastr: ToastrService) { }

  async success(message:string, duration:number = 2000){
    this.toastr.success("✔ " + message, "", {
      timeOut: duration,
    });
  }

  error(message:string, duration:number = 2000){
    this.toastr.error("✘ " + message,"", {
      timeOut: duration
    });
  }

  info(message:string, duration:number = 2000){
     this.toastr.info("ⓘ " + message, '', {
      timeOut: duration
    });
  }

  warn(message:string, duration:number = 2000){
   this.toastr.warning("▲ " + message, '', {
      timeOut: duration
    });
  }
}

