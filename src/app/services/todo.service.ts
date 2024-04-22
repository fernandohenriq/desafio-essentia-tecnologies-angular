import { Injectable } from '@angular/core';

import { Pagination } from '../interfaces/pagination.interface';
import { ICreateTodo, ITodo, IUpdateTodo } from '../interfaces/todo.interface';
import { ValidationError } from '../interfaces/validation-error.interface';

const BASE_URL = 'http://localhost:3001';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  async createTodo(todo: ICreateTodo) {
    try {
      const response = await fetch(`${BASE_URL}/todos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(todo),
      });
      const { data, message, details } = (await response.json()) as any;
      if (!response.ok) {
        return {
          error: message ?? 'Error creating todo',
          details: details as ValidationError[],
        };
      }
      return {
        message: message as string,
        data: data as ITodo,
      };
    } catch (error) {
      console.error(error);
      return {
        error: 'Error creating todo',
      };
    }
  }

  async getTodos(pagination: Pagination) {
    try {
      const { page = 1, limit = 10, search } = pagination || {};
      const response = await fetch(
        `${BASE_URL}/todos?page=${page}&limit=${limit}${search ? `&title=${search}` : ''}`,
      );
      const json = (await response.json()) as any;
      const { data, message } = json;
      if (!response.ok) {
        return {
          error: message as string,
        };
      }
      return {
        message: message as string,
        data: data as ITodo[],
      };
    } catch (error) {
      console.error(error);
      return {
        error: 'Error getting todos',
      };
    }
  }

  async updateTodo(id: string, todo: IUpdateTodo) {
    try {
      const response = await fetch(`${BASE_URL}/todos/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(todo),
      });
      const json = (await response.json()) as any;
      const { data, message, details } = json;
      if (!response.ok) {
        return {
          error: message as string,
          details: details as ValidationError[],
        };
      }
      return {
        message: message as string,
        data: data as ITodo,
      };
    } catch (error) {
      console.error(error);
      return {
        error: 'Error updating todo',
      };
    }
  }

  async deleteTodo(id: string) {
    try {
      const response = await fetch(`${BASE_URL}/todos/${id}`, {
        method: 'DELETE',
      });
      const { message } = (await response.json()) as any;
      if (!response.ok) {
        return {
          error: message as string,
        };
      }
      return {
        message: message as string,
      };
    } catch (error) {
      console.error(error);
      return {
        error: 'Error deleting todo',
      };
    }
  }
}
