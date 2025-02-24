import { Profile, ProfileFilter } from './profiles.types';

export type User = {
  id: number;
  nome: string;
  email: string;
  senha: string;
  ativo: boolean;
  data_criacao?: string;
  data_update?: string;
};

export type UserFilter = {
  id?: number;
  nome?: string;
  email?: string;
};

export type UserInput = {
  nome: string;
  email: string;
  senha: string;
  perfis?: ProfileFilter[];
};

export type UserProfileAssignment = {
  usuario_id: number;
  perfil_id: number;
};

export type AssignedProfile = {
  id: number;
  usuario_id: number;
  perfil_id: number;
};

export interface UserRepository {
  getAllUsers: () => Promise<User[]>;
  getUserByParams: (filters: UserFilter) => Promise<User | undefined>;
  createUser: (data: UserInput) => Promise<User | undefined>;
  assignProfile: (data: UserProfileAssignment) => Promise<AssignedProfile>;
  updateUser: (id: number, data: UserInput) => Promise<User | undefined>;
  deleteUser: (id: number) => Promise<number>;
  getUserProfiles: (userId: number) => Promise<Profile[]>;
  unassignProfile: (usuario_id: number) => Promise<number>;
}

export type argsType = {
  id: number;
  input: UserInput;
  filter: UserFilter;
};
