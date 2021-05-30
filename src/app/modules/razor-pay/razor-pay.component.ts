import { Component, NgZone, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastService } from '../services/toast.service';
import { WindowRef } from '../services/windowRef.service';

@Component({
  selector: 'app-razor-pay',
  templateUrl: './razor-pay.component.html',
  styleUrls: ['./razor-pay.component.scss'],
  providers: [
    WindowRef
  ],
})
export class RazorpayComponent implements OnInit {

  paymentForm!: FormGroup;
  
  constructor(
    private toaster: ToastService,
    private ngZone: NgZone,
    private winRef: WindowRef,
    public snack: MatSnackBar,

  ) {
  }


  ngOnInit() {
    this.form();
  }

  form() {
    this.paymentForm = new FormGroup({
      payKey: new FormControl('rzp_test_4UFl1O52WCKt4b', Validators.required),
      amount: new FormControl('', [Validators.required, Validators.pattern(/^\d{1,1000}(\.\d{1,2})?$/)]),
    });

  }

  get control() {
    return this.paymentForm.controls;
  }

  payWithRazor() {
    let finalAmt = this.paymentForm.value.amount * 100;
    let convertedAmt = Math.floor(finalAmt);
    let options: any = {
      "key": this.paymentForm.value.payKey,
      "amount": convertedAmt,
      "currency": "INR",
      "name": "Razor pay",
      "description": "Razor pay Integration",
      "image": "../../../../assets/images/razorpay-logo.jpeg",
      "modal": {
        "escape": false
      },
      "theme": {
        "color": "#734F96"
      }
    };
    options.handler = ((response: any) => {
      options['payment_response_id'] = response.razorpay_payment_id;
      if (response.razorpay_payment_id) {
        this.ngZone.run(() => {
          this.paymentForm.reset();
          this.paymentForm.updateValueAndValidity();
          this.toaster.present("Paid Successfully", "");
        });
      }
    });
    options.modal.ondismiss = (() => {
      this.ngZone.runOutsideAngular((ev: any) => {
        console.log(ev, "ev")
        console.log("Transaction cancelled");
      });
    });
    let rzp = new this.winRef.nativeWindow.Razorpay(options);
    rzp.open();

  }

}


