import { Routes } from '@angular/router';

export const rootRouterConfig: Routes = [
  {
    path: "",
    children: [
      {
        path: "",
        loadChildren: () =>
          import("./modules/razor-pay/razor-pay.module").then(
            (m) => m.AppRazorpayModule
          ),
      },

    ],
  },
 
];


