// Script to update user role to admin
// Usage: node scripts/update-user-to-admin.js <username>

require('dotenv').config();
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  type: String,
  displayName: String,
  username: String,
  password: String,
  avaUrl: String,
  contactPhone: String,
  address: String,
  addressDetail: String,
  facebookId: String,
  refreshToken: String,
  accessToken: String,
  role: String,
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

async function updateUserToAdmin(username) {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_CONNECTION_STRING);
    console.log('Connected to MongoDB');

    // Find and update user
    const user = await User.findOneAndUpdate(
      { username: username },
      { role: 'admin' },
      { new: true }
    );

    if (!user) {
      console.log(`User with username "${username}" not found!`);
      process.exit(1);
    }

    console.log(`✅ Successfully updated user "${username}" to admin role!`);
    console.log('User details:', {
      username: user.username,
      displayName: user.displayName,
      role: user.role
    });

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

// Get username from command line arguments
const username = process.argv[2];

if (!username) {
  console.log('Usage: node scripts/update-user-to-admin.js <username>');
  console.log('Example: node scripts/update-user-to-admin.js admin');
  process.exit(1);
}

updateUserToAdmin(username);



