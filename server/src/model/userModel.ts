import mongoose, { Document, Schema, Model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

// Define the IUser interface extending mongoose.Document
interface IUser extends Document {
  name: string;
  email: string;
  address: string;
}

// Define the IUserModel interface extending mongoose.Model
// and including the paginate method from mongoose-paginate-v2
interface IUserModel extends Model<IUser> {
  paginate: (query: any, options: any) => any;
}

// Define the user schema
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

// Add pagination plugin to the user schema
userSchema.plugin(mongoosePaginate);

// Create and export the User model
const User: IUserModel = mongoose.model<IUser, IUserModel>('User', userSchema);

export default User;
