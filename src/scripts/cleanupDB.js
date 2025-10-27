import dotenv from 'dotenv';
import connectDB from '../lib/mongodb.js';

// Load environment variables
dotenv.config({ path: './.env.local' });

// Set environment variable directly if not found
if (!process.env.MONGODB_URI) {
  process.env.MONGODB_URI = 'mongodb+srv://exam:exam1234@cluster0.jja9png.mongodb.net/exam-partner';
}

const cleanupDatabase = async () => {
  try {
    await connectDB();
    
    console.log('🔧 Cleaning up database...');
    
    // Get the database instance
    const db = connectDB().then(mongoose => mongoose.connection.db);
    const database = await db;
    
    // Drop the users collection to remove old indexes
    try {
      await database.collection('users').drop();
      console.log('✅ Dropped users collection');
    } catch (error) {
      console.log('ℹ️  Users collection does not exist or already dropped');
    }
    
    // Recreate the collection (it will be created automatically when we insert data)
    console.log('✅ Database cleanup completed!');
    console.log('🚀 You can now add users without duplicate key errors');
    
  } catch (error) {
    console.error('❌ Error cleaning up database:', error);
  } finally {
    process.exit(0);
  }
};

cleanupDatabase();
