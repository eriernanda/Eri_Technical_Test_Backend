import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { LeadApproval } from '../enum/lead-approval.enum';

export class SetApprovalLead {
  @IsUUID(7)
  @IsNotEmpty()
  id: string;

  @IsEnum([LeadApproval.APPROVED, LeadApproval.REJECT], {
    message: 'approval must be either 1 or 2',
  })
  @IsNotEmpty()
  approval: LeadApproval;
}
