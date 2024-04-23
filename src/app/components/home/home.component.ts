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
  templateUrl: './home.component.html',
  styles: `
    ::-webkit-scrollbar {
      display: none;
    }
  `,
})
export class HomeComponent {
  todoService: TodoService = inject(TodoService);

  todoItems: TodoItem[] = [];

  modalTodo?: TodoItem;

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
    const { data, error } = await this.todoService.getTodos({});
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
    const { data, error } = await this.todoService.updateTodo(this.modalTodo?.data.id || '', {
      title: todoDataToUpdate.title || '',
      isCompleted: todoDataToUpdate.isCompleted || false,
    });
    if (error || !data) {
      alert(error || 'Error updating todo');
      return;
    }
    if (this.modalTodo) {
      Object.assign(this.modalTodo.data, data);
    }
    this.modalTodo = undefined;
    this.editTodoForm.reset();
  }

  async onModalConfirm() {
    await this.onEditTodoSubmit();
    this.onModalCancel();
  }

  onModalCancel() {
    this.modalTodo = undefined;
  }

  onEditTodoClick(event: MouseEvent, index: number, todoItem: TodoItem) {
    event.preventDefault();
    event.stopPropagation();
    this.modalTodo = todoItem;
    this.editTodoForm.setValue({
      title: todoItem.data.title,
      isCompleted: todoItem.data.isCompleted,
    });
  }

  async onToggleTodoCheck(event: MouseEvent, index: number, todoItem: TodoItem) {
    todoItem.data.isCompleted = !todoItem.data.isCompleted;
    this.modalTodo = undefined;
    this.editTodoForm.setValue({
      title: todoItem.data.title,
      isCompleted: todoItem.data.isCompleted,
    });
    if (!this.editTodoForm.value?.title) {
      alert('Title is required');
      return;
    }
    const todoDataToUpdate = this.editTodoForm.value;
    const { data, error } = await this.todoService.updateTodo(todoItem?.data.id || '', {
      title: todoDataToUpdate.title || '',
      isCompleted: todoDataToUpdate.isCompleted || false,
    });
    if (error || !data) {
      alert(error || 'Error updating todo');
      return;
    }
    this.editTodoForm.reset();
  }

  async onRemoveTodoClick(event: MouseEvent, index: number) {
    event.preventDefault();
    event.stopPropagation();
    const { error } = await this.todoService.deleteTodo(this.todoItems[index].data.id);
    if (error) {
      alert(error || 'Error deleting todo');
      return;
    }
    this.todoItems.splice(index, 1);
  }
}
