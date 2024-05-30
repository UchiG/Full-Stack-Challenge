import mongoose, { Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
// Define the user schema
const userSchema = new Schema({
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
const User = mongoose.model('User', userSchema);
export default User;
