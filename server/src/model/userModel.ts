import mongoose, { Document, Schema, Model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

interface IUser extends Document {
  name: string;
  email: string;
  address: string;
}

interface IUserModel extends Model<IUser> {
  paginate: (query: any, options: any) => any;
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

userSchema.plugin(mongoosePaginate);
const User: IUserModel = mongoose.model<IUser, IUserModel>('User', userSchema);


export default User;
