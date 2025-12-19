import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
<<<<<<< HEAD
import { ObjectId } from 'mongodb';

@Schema()
export class Category {
  @Prop()
  name: string;

  @Prop()
  availabilityStatus: string;

  @Prop()
  order: number;

  @Prop()
  menuId: ObjectId;
=======

@Schema()
export class Category {
  @Prop({ unique: true, required: true })
  name: string;
>>>>>>> origin/back-up
}

export const CategorySchema = SchemaFactory.createForClass(Category);
