const mongoose = require('mongoose');

// Get MongoDB URI from .env.local or use default
const fs = require('fs');
let MONGODB_URI = 'mongodb://localhost:27017/barbershop';

try {
  const envContent = fs.readFileSync('.env.local', 'utf8');
  const mongoLine = envContent.split('\n').find(line => line.startsWith('MONGODB_URI='));
  if (mongoLine) {
    MONGODB_URI = mongoLine.split('=')[1].trim();
  }
} catch (error) {
  console.log('Could not read .env.local file, using default MongoDB URI');
}

console.log('Connecting to MongoDB at:', MONGODB_URI);

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Successfully connected to MongoDB');
    
    // Define a simple schema for testing
    const TestSchema = new mongoose.Schema({
      name: String,
      createdAt: { type: Date, default: Date.now }
    });
    
    const Test = mongoose.model('Test', TestSchema);
    
    // Create a test document
    return Test.create({ name: 'Test Connection' });
  })
  .then(result => {
    console.log('Successfully created test document:', result);
    return mongoose.connection.close();
  })
  .then(() => {
    console.log('Connection closed');
    process.exit(0);
  })
  .catch(error => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }); 