import dotenv from 'dotenv';
import connectDB from '../lib/mongodb.js';
import User from '../models/User.js';

// Load environment variables
dotenv.config({ path: './.env.local' });

// Set environment variable directly if not found
if (!process.env.MONGODB_URI) {
  process.env.MONGODB_URI = 'mongodb+srv://exam:exam1234@cluster0.jja9png.mongodb.net/exam-partner';
}

console.log('Environment variables loaded:');
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Found' : 'Not found');

const createDefaultAdmin = async () => {
  try {
    await connectDB();
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@myexampartner.com' });
    
    if (existingAdmin) {
      console.log('✅ Admin user already exists!');
      return;
    }
    
    // Create default admin user
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@myexampartner.com',
      password: 'admin123', // This will be hashed automatically
      role: 'admin',
      isActive: true,
    });
    
    await adminUser.save();
    
    console.log('✅ Default admin user created successfully!');
    console.log('📧 Email: admin@myexampartner.com');
    console.log('🔑 Password: admin123');
    console.log('⚠️  Please change the password after first login!');
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  } finally {
    process.exit(0);
  }
};

createDefaultAdmin();
