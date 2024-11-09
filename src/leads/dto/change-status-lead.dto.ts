import { IsString, IsUUID } from 'class-validator';

export class ChangeStatusLeadDto {
  @IsUUID(7)
  id: string;

  @IsString()
  note?: string;
}
