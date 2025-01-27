import Need from '../models/Need.js';

export const expireOldNeeds = async () => {
  try {
    const currentDate = new Date();
    await Need.updateMany(
      {
        status: 'active',
        expiryDate: { $lt: currentDate }
      },
      {
        $set: { status: 'expired' }
      }
    );
    console.log('Expired old needs successfully');
  } catch (error) {
    console.error('Error expiring old needs:', error);
  }
}; 