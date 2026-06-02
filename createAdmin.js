require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/features/users/user.model');

async function createAdmin() {
  await mongoose.connect(process.env.MONGO_URI);
  
  const existing = await User.findOne({ email: 'shonbasad@gmail.com' });
  if (existing) {
    console.log('Admin already exists');
    process.exit(0);
  }

  await User.create({
    name: 'Admin',
    email: 'shonbasad@gmail.com',
    password: 'Admin123!',
    role: 'admin',
    isVerified: true,
});

  console.log('✅ Admin created successfully');
  console.log('Email: shonbasad@gmail.com');
  console.log('Password: Admin123!');
  process.exit(0);
}

createAdmin().catch((err) => {
  console.error(err);
  process.exit(1);
});