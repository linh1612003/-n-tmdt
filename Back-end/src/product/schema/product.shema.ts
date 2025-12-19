import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Product extends Document {
  @Prop()
  name: string;

  @Prop()
  images: string[];

  @Prop()
  description: string;

  @Prop()
  descriptionFull: string;

  @Prop()
  originalPrice: number;

  @Prop()
  salePrice: number;

  @Prop()
  material: string;

  @Prop()
  weight: number;

  @Prop()
  size: string;

  @Prop()
  gender: string;

  @Prop()
  style: string;

  @Prop()
  brand: string;

  @Prop()
  origin: string;

  @Prop()
  warranty: string;

  @Prop()
  typeId: string;
<<<<<<< HEAD
=======

  @Prop({ required: true })
  categoryId: string;

  @Prop()
  quantity: number;

  @Prop()
  importPrice: number;
>>>>>>> origin/back-up
}

export const ProductSchema = SchemaFactory.createForClass(Product);
