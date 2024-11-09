import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UnauthorizedException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { LeadService } from './lead.service';
import { Lead } from './lead.entity';
import { ApiResponse } from 'src/response.interface';
import { ChangeStatusLeadDto } from './dto/change-status-lead.dto';
import { SetApprovalLead } from './dto/set-apporval-lead.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { SubmitSurveyDto } from './dto/submit-survey.dto';
import { UserRole } from 'src/users/enum/user-role.enum';

@Controller('leads')
export class LeadController {
  constructor(private readonly leadService: LeadService) {}

  @Post()
  async createLead(
    @Request() req,
    @Body() data: Partial<Lead>,
  ): Promise<ApiResponse<any>> {
    const role = req.user.role;

    console.log(role);
    if (role !== UserRole.CUSTOMER_SERVICE && role !== UserRole.SUPER_ADMIN) {
      throw new UnauthorizedException('unauthorized');
    }

    return this.leadService.createLead(data);
  }

  @Get()
  async getLeads(): Promise<Lead[]> {
    return this.leadService.getLeads();
  }

  @Get(':id')
  async getLeadById(@Param('id') id: string): Promise<Lead> {
    return this.leadService.getLeadById(id);
  }

  @Post('follow-up')
  async followUpLead(
    @Request() req,
    @Body() data: ChangeStatusLeadDto,
  ): Promise<ApiResponse<Lead>> {
    const role = req.user.role;

    if (role !== UserRole.SALESPERSON && role !== UserRole.SUPER_ADMIN) {
      throw new UnauthorizedException('unauthorized');
    }
    return this.leadService.followUpLead(data);
  }

  @Post('request-survey')
  async requestSurvey(
    @Request() req,
    @Body() data: ChangeStatusLeadDto,
  ): Promise<ApiResponse<Lead>> {
    const role = req.user.role;

    if (role !== UserRole.OPERATIONAL && role !== UserRole.SUPER_ADMIN) {
      throw new UnauthorizedException('unauthorized');
    }
    return this.leadService.requestSurvey(data);
  }

  @Post('set-approval-survey')
  async setApprovalSurvey(
    @Request() req,
    @Body() data: SetApprovalLead,
  ): Promise<ApiResponse<Lead>> {
    const role = req.user.role;

    if (role !== UserRole.OPERATIONAL && role !== UserRole.SUPER_ADMIN) {
      throw new UnauthorizedException('unauthorized');
    }

    return this.leadService.setApprovalSurvey(data);
  }

  @Post('submit-survey')
  @UseInterceptors(FileInterceptor('image'))
  async submitSurvey(
    @Request() req,
    @Body() data: SubmitSurveyDto,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<ApiResponse<Lead>> {
    const role = req.user.role;

    if (role !== UserRole.OPERATIONAL && role !== UserRole.SUPER_ADMIN) {
      throw new UnauthorizedException('unauthorized');
    }
    return this.leadService.submitSurvey(data, image);
  }

  @Post('final-follow-up')
  async finalFollowUp(
    @Request() req,
    @Body() data: ChangeStatusLeadDto,
  ): Promise<ApiResponse<Lead>> {
    const role = req.user.role;

    if (role !== UserRole.OPERATIONAL && role !== UserRole.SUPER_ADMIN) {
      throw new UnauthorizedException('unauthorized');
    }
    return this.leadService.finalFollowUp(data);
  }

  @Post('set-decision')
  async setDecision(
    @Request() req,
    @Body() data: SetApprovalLead,
  ): Promise<ApiResponse<Lead>> {
    const role = req.user.role;

    if (role !== UserRole.OPERATIONAL && role !== UserRole.SUPER_ADMIN) {
      throw new UnauthorizedException('unauthorized');
    }
    return this.leadService.setDecision(data);
  }
}
