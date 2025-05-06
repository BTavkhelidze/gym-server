import { Injectable } from '@nestjs/common';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { UpdateMembershipDto } from './dto/update-membership.dto';
import { Model } from 'mongoose';
import { Membership } from './schema/membership.schema';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/users/schema/user.schema';
import { SubscriptionEnum } from './enum/subscription.enum';

@Injectable()
export class MembershipService {
  constructor(
    @InjectModel('Membership') private membershipModel: Model<Membership>,
    @InjectModel('User') private userModel: Model<User>,
  ) {}

  private getPlanDetails(plan: SubscriptionEnum) {
    switch (plan) {
      case SubscriptionEnum.base:
        return { durationDays: 7, visitLimit: 5 };
      case SubscriptionEnum.premium:
        return { durationDays: 30, visitLimit: 12 };
      case SubscriptionEnum.vip:
        return { durationDays: 30, visitLimit: -1 };
      default:
        throw new Error('Invalid subscription plan');
    }
  }

  async create(createMembershipDto: CreateMembershipDto, req) {
    const userId = req.userId;

    const existMembership = await this.membershipModel.findOne({ userId });
    if (existMembership) {
      return {
        message: 'Membership already exists. Upgrade it from your profile.',
        status: 400,
      };
    }

    const plan = createMembershipDto.plan.toLowerCase() as SubscriptionEnum;
    const planDetails = this.getPlanDetails(plan);

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + planDetails.durationDays);

    const newMembership = await this.membershipModel.create({
      userId,
      membershipPlan: plan,
      status: 'active',
      startDate,
      endDate,
      visitsLeft: planDetails.visitLimit,
    });

    await this.userModel.findByIdAndUpdate(userId, {
      membershipId: newMembership._id,
    });

    return { message: 'Membership created successfully', status: 201 };
  }

  findAll() {
    return `This action returns all membership`;
  }

  findOne(id: number) {
    return `This action returns a #${id} membership`;
  }

  update(id: number, updateMembershipDto: UpdateMembershipDto) {
    return `This action updates a #${id} membership`;
  }

  remove(id: number) {
    return `This action removes a #${id} membership`;
  }
}
