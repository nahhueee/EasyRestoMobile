import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';


@Injectable({
  providedIn: 'root'
})
export class NotificacionesService {
  constructor(private toastController: ToastController) {}

  async success(message:string, duration:number = 2000, position: 'top' | 'bottom' = 'top'){
    const toast = await this.toastController.create({
      message,
      duration: duration,
      color: 'success',
      position: position,
      icon: 'checkmark-circle-outline'
    });
    await toast.present();
  }

  async info(message:string, duration:number = 3000){
    const toast = await this.toastController.create({
      message,
      duration: duration,
      color: 'primary',
      position: 'bottom',
      icon: 'information-circle-outline'
    });
    await toast.present();
  }

  async warn(message:string, duration:number = 3000){
    const toast = await this.toastController.create({
      message,
      duration: duration,
      color: 'warning',
      position: 'bottom',
      icon: 'alert-circle-outline'
    });
    await toast.present();
  }

  async error(message:string, duration:number = 3000){
    const toast = await this.toastController.create({
      message,
      duration: duration,
      color: 'danger',
      position: 'bottom',
      icon: 'close-circle-outline'
    });
    await toast.present();
  }

}
