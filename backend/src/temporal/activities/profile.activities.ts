import User from '../../models/user.model';
import axios from 'axios';

export const updateUserProfile = async (profile: any) => {
  await new Promise(resolve => setTimeout(resolve, 10000)); // 10s delay

  const user = await User.findOneAndUpdate({googleId:profile.id}, {
    firstName: profile.firstName,
    lastName: profile.lastName,
    phoneNumber: profile.phoneNumber,
    pincode: profile.pincode,
    city:profile.city
  }, { new: true });
  

  await axios.post(process.env.CRUDCRUD_URL!, user);

  return user;
};
