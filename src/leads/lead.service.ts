import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Lead } from './lead.entity';
import { Repository } from 'typeorm';
import { ChangeStatusLeadDto } from './dto/change-status-lead.dto';
import { ApiResponse } from 'src/response.interface';
import { LeadStatus } from './enum/lead-status.enum';
import { SetApprovalLead } from './dto/set-apporval-lead.dto';
import { LeadApproval } from './enum/lead-approval.enum';
import { SubmitSurveyDto } from './dto/submit-survey.dto';
import * as path from 'path';
import * as fs from 'fs';
import { randomBytes } from 'crypto';
import { User } from 'src/users/user.entity';
import { UserRole } from 'src/users/enum/user-role.enum';

@Injectable()
export class LeadService {
  private roundRobinCounter = 0;

  constructor(
    @InjectRepository(Lead)
    private readonly leadRepository: Repository<Lead>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createLead(data: Partial<Lead>): Promise<ApiResponse<Lead>> {
    const lead = this.leadRepository.create(data);

    const salespersons = await this.userRepository.find({
      where: { role: UserRole.SALESPERSON },
      order: { id: 'ASC' },
    });

    const salespersonIndex = this.roundRobinCounter % salespersons.length;
    const assignedSalesperson = salespersons[salespersonIndex];

    lead.sales_id = assignedSalesperson.id;

    this.roundRobinCounter = (this.roundRobinCounter + 1) % salespersons.length;

    const save = await this.leadRepository.save(lead);

    return {
      success: true,
      message: 'Successfully Create',
      data: save,
    };
  }

  async getLeads(): Promise<Lead[]> {
    return await this.leadRepository.find();
  }

  async getLeadById(id: string): Promise<Lead> {
    const lead = await this.leadRepository.findOne({ where: { id: id } });
    if (!lead) {
      throw new NotFoundException(`Lead tidak ditemukan`);
    }

    return lead;
  }

  async followUpLead(data: ChangeStatusLeadDto): Promise<ApiResponse<Lead>> {
    const lead = await this.leadRepository.findOne({ where: { id: data.id } });
    if (!lead) {
      throw new NotFoundException(`Lead tidak ditemukan`);
    }

    lead.status = 1;
    lead.follow_up_count += 1;

    await this.leadRepository.save(lead);

    return {
      success: true,
      message: 'Lead follow-up processed successfully',
      data: lead,
    };
  }

  async requestSurvey(data: ChangeStatusLeadDto): Promise<ApiResponse<Lead>> {
    const lead = await this.leadRepository.findOne({ where: { id: data.id } });
    if (!lead) {
      throw new NotFoundException(`Lead tidak ditemukan`);
    }

    lead.status = LeadStatus.SURVEY_REQUEST;
    await this.leadRepository.save(lead);

    return {
      success: true,
      message: 'Lead request survey processed successfully',
      data: lead,
    };
  }

  async setApprovalSurvey(data: SetApprovalLead): Promise<ApiResponse<Lead>> {
    const lead = await this.leadRepository.findOne({ where: { id: data.id } });
    if (!lead) {
      throw new NotFoundException(`Lead tidak ditemukan`);
    }

    lead.status =
      data.approval == LeadApproval.APPROVED
        ? LeadStatus.SURVEY_APPROVE
        : LeadStatus.SURVEY_REJECT;

    await this.leadRepository.save(lead);

    return {
      success: true,
      message: 'Lead approval processed successfully',
      data: lead,
    };
  }

  async submitSurvey(
    data: SubmitSurveyDto,
    image: Express.Multer.File,
  ): Promise<ApiResponse<Lead>> {
    if (!image) {
      throw new BadRequestException('Image file is required');
    }

    const lead = await this.leadRepository.findOne({ where: { id: data.id } });
    if (!lead) {
      throw new NotFoundException(`Lead tidak ditemukan`);
    }

    const uploadDir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }

    const randomString = randomBytes(8).toString('hex');
    const timestamp = Date.now();
    const uniqueFilename = `${randomString}_${timestamp}${path.extname(image.originalname)}`;

    const filePath = path.join(uploadDir, uniqueFilename);
    fs.writeFileSync(filePath, image.buffer);

    lead.status = LeadStatus.SURVEY_COMPLETE;
    await this.leadRepository.save(lead);

    return {
      success: true,
      message: 'Lead completed survey successfully',
      data: lead,
    };
  }

  async finalFollowUp(data: ChangeStatusLeadDto): Promise<ApiResponse<Lead>> {
    const lead = await this.leadRepository.findOne({ where: { id: data.id } });
    if (!lead) {
      throw new NotFoundException(`Lead tidak ditemukan`);
    }

    lead.status = LeadStatus.FINAL_FOLLOW_UP;

    await this.leadRepository.save(lead);

    return {
      success: true,
      message: 'Lead final follow-up processed successfully',
      data: lead,
    };
  }

  async setDecision(data: SetApprovalLead): Promise<ApiResponse<Lead>> {
    const lead = await this.leadRepository.findOne({ where: { id: data.id } });
    if (!lead) {
      throw new NotFoundException(`Lead tidak ditemukan`);
    }

    lead.status =
      data.approval == LeadApproval.APPROVED
        ? LeadStatus.DEAL
        : LeadStatus.CANCELED;

    await this.leadRepository.save(lead);

    return {
      success: true,
      message: 'Lead decision processed successfully',
      data: lead,
    };
  }
}
