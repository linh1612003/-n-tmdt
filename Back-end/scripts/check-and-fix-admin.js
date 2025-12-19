// Script to check and fix admin user password
// Usage: node scripts/check-and-fix-admin.js

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

async function checkAndFixAdmin() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_CONNECTION_STRING.trim());
    console.log('✅ Connected to MongoDB\n');

    // Find admin user
    const adminUser = await User.findOne({ username: 'admin' });
    
    if (!adminUser) {
      console.log('❌ Admin user not found! Creating new admin user...');
      
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const newAdmin = await User.create({
        type: 'LOCAL',
        username: 'admin',
        password: hashedPassword,
        displayName: 'Admin User',
        role: 'admin',
        avaUrl: 'http://localhost:5000/api/uploads/avatar/user_avatar_default.png',
        contactPhone: '',
        address: '',
        addressDetail: '',
        facebookId: '',
        refreshToken: 'refresh_token',
        accessToken: 'access_token',
      });
      
      console.log('✅ Created new admin user!');
      console.log('User details:', {
        id: newAdmin._id.toString(),
        username: newAdmin.username,
        displayName: newAdmin.displayName,
        role: newAdmin.role,
        hasPassword: !!newAdmin.password
      });
    } else {
      console.log('✅ Found admin user:');
      console.log('User details:', {
        id: adminUser._id.toString(),
        username: adminUser.username,
        displayName: adminUser.displayName,
        role: adminUser.role,
        hasPassword: !!adminUser.password,
        passwordLength: adminUser.password ? adminUser.password.length : 0
      });

      // Test password
      console.log('\n🔐 Testing password "admin123"...');
      const testPassword = 'admin123';
      const isMatch = await bcrypt.compare(testPassword, adminUser.password);
      
      if (!isMatch) {
        console.log('❌ Password does not match! Resetting password...');
        
        // Reset password
        const hashedPassword = await bcrypt.hash(testPassword, 10);
        adminUser.password = hashedPassword;
        adminUser.role = 'admin';
        await adminUser.save();
        
        console.log('✅ Password reset successfully!');
      } else {
        console.log('✅ Password is correct!');
      }
      
      // Ensure role is admin
      if (adminUser.role !== 'admin') {
        console.log('⚠️  Role is not admin. Updating...');
        adminUser.role = 'admin';
        await adminUser.save();
        console.log('✅ Role updated to admin!');
      }
    }

    console.log('\n📝 Login credentials:');
    console.log('   Username: admin');
    console.log('   Password: admin123');
    console.log('   URL: http://localhost:3000/login');
    console.log('\n✅ Ready to login!\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

checkAndFixAdmin();




