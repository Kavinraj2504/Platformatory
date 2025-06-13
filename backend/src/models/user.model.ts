import { Schema, InferSchemaType, model } from 'mongoose';

const userSchema = new Schema({
  googleId: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String },
  phoneNumber: { type: String },
city: { type: String },
  pincode: { type: String },
  email: { type: String, required: true }
});

export type IUser = InferSchemaType<typeof userSchema>;
export default model<IUser>('User', userSchema);
