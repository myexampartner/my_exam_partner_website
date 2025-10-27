import { verifyToken } from './jwt';
import connectDB from './mongodb';
import User from '@/models/User';

export const authenticateToken = async (req) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return { user: null, error: 'No token provided' };
  }

  try {
    const decoded = verifyToken(token);
    if (!decoded) {
      return { user: null, error: 'Invalid token' };
    }

    await connectDB();
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user || !user.isActive) {
      return { user: null, error: 'User not found or inactive' };
    }

    return { user, error: null };
  } catch (error) {
    return { user: null, error: 'Token verification failed' };
  }
};

export const requireAuth = async (req) => {
  const { user, error } = await authenticateToken(req);
  
  if (!user) {
    throw new Error(error || 'Authentication required');
  }
  
  return user;
};

export const requireAdmin = async (req) => {
  const user = await requireAuth(req);
  
  if (user.role !== 'admin') {
    throw new Error('Admin access required');
  }
  
  return user;
};
