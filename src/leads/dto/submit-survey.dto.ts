import { IsString, IsUUID } from 'class-validator';

export class SubmitSurveyDto {
  @IsUUID(7)
  id: string;

  @IsString()
  note: string;
}
