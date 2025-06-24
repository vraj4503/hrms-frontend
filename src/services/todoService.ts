import axios from 'axios';

const API_URL = "hrms-backend-production-3091.up.railway.app/todos";

export interface ToDo {
  ToDoId?: number;
  BucketID?: number;
  AssignTo?: number;
  AssgnBy?: number;
  NotificationTo?: string;
  DueDateTime?: Date;
  Priority?: string;
  StatusType?: string;
  FilePath?: string;
  ReturnFileFlag?: boolean;
  ReturnFilePath?: string;
  Recording?: string;
  Title?: string;
  Description?: string;
  Repeted?: boolean;
  CID?: number;
  created?: Date;
  updated?: Date;
  CreatedBy?: number;
  UpdatedBy?: number;
}

export const createToDo = async (todo: Partial<ToDo>): Promise<ToDo> => {
  const response = await axios.post<ToDo>(API_URL, todo);
  return response.data;
};

export const getAllToDos = async (cid?: number): Promise<ToDo[]> => {
  const response = await axios.get<ToDo[]>(`${API_URL}${cid ? `?cid=${cid}` : ''}`);
  return response.data;
};

export const getToDoById = async (id: number): Promise<ToDo> => {
  const response = await axios.get<ToDo>(`${API_URL}/${id}`);
  return response.data;
};

export const updateToDo = async (id: number, todo: Partial<ToDo>): Promise<ToDo> => {
  const response = await axios.put<ToDo>(`${API_URL}/${id}`, todo);
  return response.data;
};

export const deleteToDo = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
}; 