// scripts/create-admin.js
// A script to create an admin user for the barbershop application

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Connect to MongoDB
const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    return true;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    return false;
  }
};

// Define Admin schema (same as in the model)
const AdminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, default: 'admin' }
}, { timestamps: true });

// Create Admin model
const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);

// Create admin user
const createAdmin = async (email, password, name) => {
  try {
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    
    if (existingAdmin) {
      console.log(`Admin with email ${email} already exists.`);
      return false;
    }
    
    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Create new admin
    const admin = new Admin({
      email,
      password: hashedPassword,
      name,
      role: 'admin'
    });
    
    await admin.save();
    console.log(`Admin user created successfully: ${name} (${email})`);
    return true;
  } catch (error) {
    console.error('Error creating admin user:', error);
    return false;
  }
};

// Main function
const main = async () => {
  // Get command line arguments
  const args = process.argv.slice(2);
  
  if (args.length < 3) {
    console.log('Usage: node create-admin.js <email> <password> <name>');
    process.exit(1);
  }
  
  const [email, password, name] = args;
  
  // Connect to database
  const connected = await connectToDatabase();
  
  if (!connected) {
    console.error('Failed to connect to database. Check your MongoDB connection string.');
    process.exit(1);
  }
  
  // Create admin user
  const created = await createAdmin(email, password, name);
  
  // Close database connection
  await mongoose.connection.close();
  
  if (created) {
    console.log('Admin user creation completed successfully.');
  } else {
    console.log('Admin user creation failed or was not needed.');
  }
  
  process.exit(0);
};

// Run the script
main();
