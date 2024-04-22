import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule],
  template: `
    <main>
      <a [routerLink]="['/']">
        <header class="brand-name">
          <img
            class="brand-logo"
            src="/assets/todo-logo.svg"
            alt="logo"
            aria-hidden="true"
            height="64"
          />
          <h1>My To-Do Lists</h1>
        </header>
      </a>
      <section class="content">
        <router-outlet></router-outlet>
      </section>
    </main>
  `,
  styles: `
    :host {
      --header-padding: 16px;
      --content-padding: 32px;
    }

    a {
      text-decoration: none;
    }

    header {
      display: flex;
      align-items: center;
      gap: 16px;
      background-color: var(--primary-color);
      color: var(--accent-color);
      font-weight: bold;
      height: 60px;
      padding: var(--header-padding);
      padding-left: var(--content-padding);
      padding-right: var(--content-padding);
      box-shadow: 0px 5px 25px var(--shadow-color);
    }

    .content {
      padding: var(--content-padding);
    }
  `,
})
export class AppComponent {}
