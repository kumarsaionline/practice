const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import models
const User = require('./models/User');
const Task = require('./models/Task');

// Sample users data
const sampleUsers = [
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123'
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123'
  },
  {
    name: 'Bob Johnson',
    email: 'bob@example.com',
    password: 'password123'
  }
];

// Sample tasks data (will be assigned to users after creation)
const sampleTasks = [
  // Tasks for User 1 (John)
  {
    title: 'Complete project proposal',
    description: 'Finish writing the project proposal for the new client meeting next week',
    status: 'in-progress',
    priority: 'high',
    category: 'Work',
    dueDate: new Date('2025-10-15')
  },
  {
    title: 'Buy groceries',
    description: 'Get milk, bread, eggs, and fresh vegetables from the local market',
    status: 'pending',
    priority: 'medium',
    category: 'Personal',
    dueDate: new Date('2025-10-10')
  },
  {
    title: 'Call dentist for appointment',
    description: 'Schedule a routine checkup appointment for next month',
    status: 'pending',
    priority: 'low',
    category: 'Health',
    dueDate: new Date('2025-10-12')
  },
  {
    title: 'Read "Clean Code" book',
    description: 'Continue reading chapter 5 about formatting and clean code principles',
    status: 'in-progress',
    priority: 'medium',
    category: 'Learning',
    dueDate: new Date('2025-10-20')
  },
  {
    title: 'Fix kitchen sink',
    description: 'The kitchen sink has been leaking for a week now, need to fix it',
    status: 'pending',
    priority: 'high',
    category: 'Home',
    dueDate: new Date('2025-10-09')
  },
  {
    title: 'Submit tax documents',
    description: 'Gather all necessary documents and submit tax return',
    status: 'completed',
    priority: 'high',
    category: 'Finance'
  },

  // Tasks for User 2 (Jane)
  {
    title: 'Prepare presentation slides',
    description: 'Create slides for the quarterly business review meeting',
    status: 'in-progress',
    priority: 'high',
    category: 'Work',
    dueDate: new Date('2025-10-14')
  },
  {
    title: 'Plan weekend trip',
    description: 'Research destinations and book accommodation for weekend getaway',
    status: 'pending',
    priority: 'low',
    category: 'Travel',
    dueDate: new Date('2025-10-18')
  },
  {
    title: 'Update portfolio website',
    description: 'Add recent projects and update the design of personal portfolio',
    status: 'in-progress',
    priority: 'medium',
    category: 'Personal',
    dueDate: new Date('2025-10-25')
  },
  {
    title: 'Exercise routine',
    description: 'Go to gym for cardio and strength training session',
    status: 'completed',
    priority: 'medium',
    category: 'Health'
  },
  {
    title: 'Learn React Native',
    description: 'Complete online course on React Native mobile app development',
    status: 'pending',
    priority: 'medium',
    category: 'Learning',
    dueDate: new Date('2025-11-01')
  },

  // Tasks for User 3 (Bob)
  {
    title: 'Team meeting preparation',
    description: 'Prepare agenda and materials for weekly team standup meeting',
    status: 'pending',
    priority: 'medium',
    category: 'Work',
    dueDate: new Date('2025-10-11')
  },
  {
    title: 'Car maintenance',
    description: 'Take car for oil change and general maintenance checkup',
    status: 'pending',
    priority: 'medium',
    category: 'Personal',
    dueDate: new Date('2025-10-16')
  },
  {
    title: 'Birthday party planning',
    description: 'Organize surprise birthday party for Sarah next weekend',
    status: 'in-progress',
    priority: 'high',
    category: 'Personal',
    dueDate: new Date('2025-10-13')
  },
  {
    title: 'Complete online course',
    description: 'Finish the remaining modules of the JavaScript advanced course',
    status: 'in-progress',
    priority: 'low',
    category: 'Learning',
    dueDate: new Date('2025-10-30')
  },
  {
    title: 'Pay utility bills',
    description: 'Pay electricity, water, and internet bills for this month',
    status: 'completed',
    priority: 'medium',
    category: 'Finance'
  }
];

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/todolist', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Clear existing data
const clearData = async () => {
  try {
    await Task.deleteMany({});
    await User.deleteMany({});
    console.log('Existing data cleared');
  } catch (error) {
    console.error('Error clearing data:', error);
  }
};

// Seed users
const seedUsers = async () => {
  try {
    const users = [];
    
    for (let userData of sampleUsers) {
      // Let the User model handle password hashing in pre-save hook
      const user = new User({
        name: userData.name,
        email: userData.email,
        password: userData.password // Don't hash here, let the model do it
      });
      
      const savedUser = await user.save();
      users.push(savedUser);
      console.log(`User created: ${userData.name} (${userData.email})`);
    }
    
    return users;
  } catch (error) {
    console.error('Error seeding users:', error);
    return [];
  }
};

// Seed tasks
const seedTasks = async (users) => {
  try {
    const tasksPerUser = Math.ceil(sampleTasks.length / users.length);
    let taskIndex = 0;
    
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const userTasks = sampleTasks.slice(taskIndex, taskIndex + tasksPerUser);
      
      for (let taskData of userTasks) {
        const task = new Task({
          ...taskData,
          userId: user._id
        });
        
        await task.save();
        console.log(`Task created for ${user.name}: ${taskData.title}`);
      }
      
      taskIndex += tasksPerUser;
    }
    
    console.log(`Total ${sampleTasks.length} tasks created`);
  } catch (error) {
    console.error('Error seeding tasks:', error);
  }
};

// Main seeding function
const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Connect to database
    await connectDB();
    
    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await clearData();
    
    // Seed users
    console.log('👤 Creating sample users...');
    const users = await seedUsers();
    
    if (users.length === 0) {
      console.log('❌ No users created, skipping task seeding');
      return;
    }
    
    // Seed tasks
    console.log('📝 Creating sample tasks...');
    await seedTasks(users);
    
    console.log('\n✅ Database seeding completed successfully!');
    console.log('\n📋 Sample User Accounts:');
    sampleUsers.forEach(user => {
      console.log(`   Email: ${user.email} | Password: ${user.password}`);
    });
    console.log('\n🚀 You can now test the application with these accounts!');
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    // Close database connection
    mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
};

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };