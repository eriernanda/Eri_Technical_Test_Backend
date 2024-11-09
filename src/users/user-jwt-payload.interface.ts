import { UserRole } from './enum/user-role.enum';

export interface JwtPayload {
  id: string;
  name: string;
  role: UserRole;
}
