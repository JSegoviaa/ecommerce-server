export interface ReqUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  role_id: RoleID;
}

type RoleID = 1 | 2 | 3 | 4;
