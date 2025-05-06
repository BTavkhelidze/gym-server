import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class User {
  @Prop({ type: String })
  email: string;

  @Prop({ type: String })
  password: string;

  @Prop({ type: String })
  firstName: string;

  @Prop({ type: String })
  lastName: string;

  @Prop({ type: String })
  avatar: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Membership',
    default: null,
  })
  membershipId: mongoose.Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);
