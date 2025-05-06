import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { SubscriptionEnum } from '../enum/subscription.enum';

@Schema()
export class Membership {
  @Prop({
    type: String,
    enum: ['active', 'expired', 'canceled'],
    default: 'active',
  })
  status: string;

  @Prop({ type: String })
  startDate: string;

  @Prop({ type: String })
  endDate: string;

  @Prop({ type: Number })
  visitsLeft: number;

  @Prop({
    type: String,
    enum: SubscriptionEnum,
    default: SubscriptionEnum.base,
  })
  membershipPlan: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'users' })
  userId: mongoose.Types.ObjectId;
}

export const MemberShipSchema = SchemaFactory.createForClass(Membership);
