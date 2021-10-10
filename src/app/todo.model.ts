import { User } from "./user.model";

export interface Todo {
  id: number;
  userId?: number;
  user: User;
  title: string;
  completed: boolean;
}
