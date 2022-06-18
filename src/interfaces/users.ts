export interface ReqUser {
  id: number;
  first_name: string;
  last_name: string;
  is_active: boolean;
  role_id: RoleID;
  role: Role;
}

export type RoleID = 1 | 2 | 3 | 4 | 5;

export type Role =
  | 'Super Administrador'
  | 'Administrador'
  | 'Moderador'
  | 'Usuario'
  | 'Distribuidor';
