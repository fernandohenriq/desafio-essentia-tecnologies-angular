import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ValidationError } from '../../interfaces/validation-error.interface';
import { TodoService } from '../../services/todo.service';
import { ModalComponent } from '../_shared/modal.component';

type TodoItem = {
  data: {
    id: string;
    title: string;
    isCompleted: boolean;
    createdAt: string | Date;
    updatedAt?: string | Date | null;
  };
  fieldErrors: ValidationError[];
};

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, ModalComponent],
  template: `
    <section class="">
      <form [formGroup]="createTodoForm" (ngSubmit)="onCreateTodoSubmit()">
        <div
          class="bg-slate-200 text-gray-800 pl-8 pr-2.5 w-full placeholder:text-xl rounded-full flex flex-row justify-between items-center"
        >
          <input
            type="text"
            placeholder="Add todo"
            formControlName="title"
            class="bg-transparent text-gray-800 py-6 px-2 w-full h-full my-0 text-2xl placeholder:text-xl focus:outline-none"
          />
          <button
            type="submit"
            class="bg-blue-500 p-4 h-16 w-16 rounded-full text-3xl text-white flex justify-center items-center hover:bg-blue-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              class="w-6 h-6"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </button>
        </div>
      </form>
    </section>
    <hr class="my-8" />
    <section>
      <header class="mb-4">
        <h1 class="text-2xl font-bold text-gray-500">Todo Lists</h1>
      </header>
      <div class="overflow-y-auto max-screen h-[calc(100vh-28rem)]">
        <ul class="flex flex-col gap-4">
          <li
            *ngFor="let todo of todoItems; index as i"
            class="bg-white border-2 border-gray-100 drop-shadow-md rounded-xl flex flex-row justify-between items-center text-xl font-medium"
          >
            <div class="flex flex-row flex-grow items-center px-8 py-4 hover:bg-gray-100 z-0">
              <h1 class="flex-grow">
                {{ todo.data.title }}
              </h1>
              <span class="flex gap-2 z-10">
                <button
                  class="bg-gray-500 text-gray-50 p-2 rounded-full hover:bg-gray-700"
                  (click)="onEditTodoClick($event, i, todo)"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-6 h-6"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                    />
                  </svg>
                </button>
                <button
                  class="bg-red-500 text-gray-50 p-2 rounded-full hover:bg-red-700"
                  (click)="onRemoveTodoClick($event, i)"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-6 h-6"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                    />
                  </svg>
                </button>
              </span>
            </div>
          </li>
        </ul>
      </div>
    </section>
    <app-modal
      [show]="!!editTodoItem"
      (confirm)="onEditTodoSubmit()"
      (cancel)="onModalCancel()"
      (shadowClick)="onModalCancel()"
    >
      <div class="flex flex-col">
        <h2 class="text-2xl font-bold mb-4">Edit Todo</h2>
        <form [formGroup]="editTodoForm" class="flex flex-col gap-4">
          <input
            required
            id="title"
            name="title"
            type="text"
            formControlName="title"
            placeholder="Enter title"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none block w-full p-2.5"
            *ngIf="!!editTodoItem?.data?.title"
          />
        </form>
      </div>
    </app-modal>
  `,
  styles: `
    ::-webkit-scrollbar {
      display: none;
    }
  `,
})
export class HomeComponent {
  todoService: TodoService = inject(TodoService);

  todoItems: TodoItem[] = [];

  editTodoItem?: TodoItem;

  createTodoForm = new FormGroup({
    title: new FormControl(''),
  });

  editTodoForm = new FormGroup({
    title: new FormControl(''),
    isCompleted: new FormControl(false),
  });

  constructor() {
    this.onGetTodos();
  }

  async onGetTodos() {
    const { data, message, error } = await this.todoService.getTodos({});
    if (error || !data) {
      alert(error || 'Error getting todos');
      return;
    }
    this.todoItems = data.map((todo) => ({
      data: todo,
      fieldErrors: [],
    }));
  }

  async onCreateTodoSubmit() {
    if (!this.createTodoForm.value?.title) return;
    const { data, message, error, details } = await this.todoService.createTodo({
      title: this.createTodoForm.value.title || '',
    });
    if (!!error || !data) {
      alert(message || 'Error creating todo');
      return;
    }
    this.todoItems.splice(0, 0, {
      data,
      fieldErrors: [],
    });
    this.createTodoForm.reset();
  }

  async onEditTodoSubmit() {
    if (!this.editTodoForm.value?.title) {
      alert('Title is required');
      return;
    }
    const todoDataToUpdate = this.editTodoForm.value;
    const { data, message, error, details } = await this.todoService.updateTodo(
      this.editTodoItem?.data.id || '',
      {
        title: todoDataToUpdate.title || '',
        isCompleted: todoDataToUpdate.isCompleted || false,
      },
    );
    if (error || !data) {
      alert(error || 'Error updating todo');
      return;
    }
    if (this.editTodoItem) {
      Object.assign(this.editTodoItem.data, data);
    }
    this.editTodoItem = undefined;
    this.editTodoForm.reset();
  }

  async onModalConfirm() {
    await this.onEditTodoSubmit();
    this.onModalCancel();
  }

  onModalCancel() {
    this.editTodoItem = undefined;
  }

  onEditTodoClick(event: MouseEvent, index: number, todoItem: TodoItem) {
    event.preventDefault();
    event.stopPropagation();
    this.editTodoItem = todoItem;
    this.editTodoForm.setValue({
      title: todoItem.data.title,
      isCompleted: todoItem.data.isCompleted,
    });
  }

  async onRemoveTodoClick(event: MouseEvent, index: number) {
    event.preventDefault();
    event.stopPropagation();
    const { message, error } = await this.todoService.deleteTodo(this.todoItems[index].data.id);
    if (error) {
      alert(error || 'Error deleting todo');
      return;
    }
    this.todoItems.splice(index, 1);
  }
}
