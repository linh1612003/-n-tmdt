// Script to create admin user directly in MongoDB
// Usage: node scripts/create-admin-user.js <username> <password> <displayName>

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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

async function createAdminUser(username, password, displayName) {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_CONNECTION_STRING);
    console.log('✅ Connected to MongoDB');

    // Check if user already exists
    const existingUser = await User.findOne({ username: username });
    if (existingUser) {
      console.log(`⚠️  User "${username}" already exists!`);
      console.log('Updating to admin role and resetting password...');
      
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Update user to admin
      const updatedUser = await User.findOneAndUpdate(
        { username: username },
        { 
          role: 'admin',
          password: hashedPassword,
          displayName: displayName || existingUser.displayName
        },
        { new: true }
      );
      
      console.log(`✅ Successfully updated user "${username}" to admin!`);
      console.log('User details:', {
        username: updatedUser.username,
        displayName: updatedUser.displayName,
        role: updatedUser.role
      });
    } else {
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Create new admin user
      const newUser = await User.create({
        type: 'LOCAL',
        username: username,
        password: hashedPassword,
        displayName: displayName || username,
        role: 'admin',
        avaUrl: 'http://localhost:5000/api/uploads/avatar/user_avatar_default.png',
        contactPhone: '',
        address: '',
        addressDetail: '',
        facebookId: '',
        refreshToken: 'refresh_token',
        accessToken: 'access_token',
      });
      
      console.log(`✅ Successfully created admin user "${username}"!`);
      console.log('User details:', {
        username: newUser.username,
        displayName: newUser.displayName,
        role: newUser.role
      });
    }

    console.log('\n📝 You can now login with:');
    console.log(`   Username: ${username}`);
    console.log(`   Password: ${password}`);
    console.log(`   URL: http://localhost:3000/login\n`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Get parameters from command line arguments
const username = process.argv[2];
const password = process.argv[3];
const displayName = process.argv[4];

if (!username || !password) {
  console.log('Usage: node scripts/create-admin-user.js <username> <password> [displayName]');
  console.log('Example: node scripts/create-admin-user.js admin admin123 "Admin User"');
  console.log('\nIf user exists, it will update to admin role and reset password.');
  process.exit(1);
}

createAdminUser(username, password, displayName);




