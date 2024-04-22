import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="h-svh w-svw flex flex-col  bg-blue-800 text-slate-700">
      <header class="flex justify-center px-4 py-6 text-white">
        <a [routerLink]="['/']" class="text-decoration-none">
          <span class="h1 text-7xl font-bold">Todo App</span>
        </a>
      </header>
      <section class="h-full w-full pb-10 flex flex-col justify-start items-center">
        <div class="container bg-white text-black h-full max-w-3xl rounded-3xl p-10">
          <router-outlet></router-outlet>
        </div>
      </section>
    </div>
  `,
  styles: ``,
})
export class AppComponent {}
