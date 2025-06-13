import User from '../../models/user.model';
import axios from 'axios';

export const updateUserProfile = async (profile: any) => {
  await new Promise(resolve => setTimeout(resolve, 10000)); // 10s delay

  const user = await User.findByIdAndUpdate(profile.id, {
    firstName: profile.firstName,
    lastName: profile.lastName,
    phoneNumber: profile.phoneNumber,
    pincode: profile.pincode,
  }, { new: true });

  await axios.post('https://crudcrud.com/api/YOUR_UNIQUE_ID/users', user);

  return user;
};
