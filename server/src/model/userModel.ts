import mongoose, { Document, Schema, Model } from 'mongoose';

interface IUser extends Document {
  name: string;
  email: string;
  address: string;
}

const userSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
});

const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);

export default User;
