export interface ITodo {
  id: string;
  title: string;
  isCompleted: boolean;
  createdAt: string | Date;
  updatedAt?: string | Date;
}

export interface ICreateTodo {
  title: string;
}

export interface IUpdateTodo {
  title?: string;
  isCompleted?: boolean;
}
