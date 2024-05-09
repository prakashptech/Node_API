
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors'); // Import the cors package

const app = express();
const PORT = 5000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/mydatabase', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => console.log('Connected to MongoDB'));


// Define Employee schema
const employeeSchema = new mongoose.Schema({
  name: String,
  position: String,
  salary: Number
});

const Employee = mongoose.model('Employee', employeeSchema);

// Middleware
app.use(bodyParser.json());
app.use(cors());

// CRUD APIs for employees

// Create Employee API
app.post('/api/employees', async (req, res) => {
  try {
    const { name, position, salary } = req.body;
    const employee = new Employee({ name, position, salary });
    const savedEmployee = await employee.save();
    res.status(201).json(savedEmployee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get All Employees API
app.get('/api/employees', async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Employee by ID API
app.get('/api/employees/:id', async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update Employee API
app.put('/api/employees/:id', async (req, res) => {
  try {
    const { name, position, salary } = req.body;
    const updatedEmployee = await Employee.findByIdAndUpdate(req.params.id, { name, position, salary }, { new: true });
    if (!updatedEmployee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json(updatedEmployee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete Employee API
app.delete('/api/employees/:id', async (req, res) => {
  try {
    const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);
    if (!deletedEmployee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



// Define User schema
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const User = mongoose.model('User', userSchema);

// Middleware
app.use(bodyParser.json());
app.use(cors()); // Use the cors middleware

// Login API - Generate token
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, password });
  if (user) {
    const token = jwt.sign({ userId: user._id }, 'secret_key', { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Invalid username or password' });
  }
});

// Profile API - Get profile data
app.get('/profile', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]; // Get token from authorization header
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decodedToken = jwt.verify(token, 'secret_key');
    const userId = decodedToken.userId;
    // Here you would fetch profile data from MongoDB based on userId
    // For simplicity, I'm just sending back a mock response
  
    res.json(
      
        { userId, username: 'prakash', email: 'prakash@paswan.com' }
      
      
  );
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// // index.js
// const express = require('express');
// const bodyParser = require('body-parser');

// const app = express();
// const PORT = process.env.PORT || 3000;

// // Middleware
// app.use(bodyParser.json());

// // Dummy employee data
// let employees = [
//   { id: 1, name: 'John Doe', role: 'Developer' },
//   { id: 2, name: 'Jane Smith', role: 'Designer' },
// ];

// // Routes
// // Get all employees
// app.get('/employees', (req, res) => {
//   res.json(employees);
// });

// // Get employee by ID
// app.get('/employees/:id', (req, res) => {
//   const employeeId = parseInt(req.params.id);
//   const employee = employees.find(emp => emp.id === employeeId);
//   if (!employee) {
//     return res.status(404).json({ message: 'Employee not found' });
//   }
//   res.json(employee);
// });

// // Add new employee
// app.post('/employees', (req, res) => {
//   const newEmployee = req.body;
//   employees.push(newEmployee);
//   res.status(201).json(newEmployee);
// });

// // Update employee
// app.put('/employees/:id', (req, res) => {
//   const employeeId = parseInt(req.params.id);
//   const updatedEmployee = req.body;
//   employees = employees.map(emp =>
//     emp.id === employeeId ? { ...emp, ...updatedEmployee } : emp
//   );
//   res.json(updatedEmployee);
// });

// // Delete employee
// app.delete('/employees/:id', (req, res) => {
//   const employeeId = parseInt(req.params.id);
//   employees = employees.filter(emp => emp.id !== employeeId);
//   res.status(204).send();
// });

// Start server
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

// server.js
// const express = require('express');
// const bodyParser = require('body-parser');
// const mongoose = require('mongoose');
// const cors = require('cors');

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Middleware
// app.use(bodyParser.json());
// app.use(cors());

// // MongoDB Connection
// mongoose.connect('mongodb://localhost/employeeDB', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// // Employee Schema
// const employeeSchema = new mongoose.Schema({
//   name: String,
//   position: String,
//   department: String,
// });

// const Employee = mongoose.model('Employee', employeeSchema);

// // Routes
// app.get('/api/employees', async (req, res) => {
//   try {
//     const employees = await Employee.find();
//     res.json(employees);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// app.post('/api/login', async (req, res) => {
//   const employee = new Employee(req.body);
//   console.log(employee)
//   try {
//     const newEmployee = await employee.save();
//     res.status(201).json(newEmployee);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// app.put('/api/employees/:id', async (req, res) => {
//   const { id } = req.params;
//   try {
//     const updatedEmployee = await Employee.findByIdAndUpdate(id, req.body, { new: true });
//     res.json(updatedEmployee);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// app.delete('/api/employees/:id', async (req, res) => {
//   const { id } = req.params;
//   try {
//     await Employee.findByIdAndRemove(id);
//     res.json({ message: 'Employee deleted successfully' });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// Start server
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
// const express = require('express');
// const bodyParser = require('body-parser');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const jwt = require('jsonwebtoken');

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Middleware
// app.use(bodyParser.json());
// app.use(cors());

// // MongoDB Connection
// mongoose.connect('mongodb://localhost/employeeDB', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// // Employee Schema
// const employeeSchema = new mongoose.Schema({
//   username: String,
//   password: String,
// });

// const Employee = mongoose.model('Employee', employeeSchema);

// // JWT secret key
// const secretKey = 'your_secret_key';

// // Login endpoint
// app.post('/login', async (req, res) => {
//   const { username, password } = req.body;
//   try {
//     // Check if the user exists in the database
//     const user = await Employee.findOne({ username });

//     if (!user || user.password !== password) {
//       return res.status(401).json({ message: 'Invalid username or password' });
//     }

//     // Generate JWT token
//     const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '1h' });

//     // Send the token back to the client
//     res.json({ token });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // Protected route example
// app.get('/profile', authenticateToken, async (req, res) => {
//   try {
//     const employees = await Employee.find();
//     res.json(employees);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // Middleware to authenticate JWT token
// function authenticateToken(req, res, next) {
//   const authHeader = req.headers['authorization'];
//   const token = authHeader && authHeader.split(' ')[1];
//   if (token == null) {
//     return res.sendStatus(401);
//   }

//   jwt.verify(token, secretKey, (err, decoded) => {
//     if (err) {
//       return res.sendStatus(403);
//     }
//     req.userId = decoded.userId;
//     next();
//   });
// }

// // Start server
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
// const express = require('express');
// const bodyParser = require('body-parser');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const jwt = require('jsonwebtoken');

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Middleware
// app.use(bodyParser.json());
// app.use(cors());

// // MongoDB Connection
// mongoose.connect('mongodb://localhost/myDB', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// // Schema and Model for Login
// const loginSchema = new mongoose.Schema({
//   username: String,
//   password: String,
// });

// const Login = mongoose.model('Login', loginSchema);

// // Schema and Model for Profile
// const profileSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Login', // Reference to the Login collection
//   },
//   // Add more profile fields as needed
//   email: String,
//   username: String,
//   password: String,
// });

// const Profile = mongoose.model('Profile', profileSchema);

// // JWT secret key
// const secretKey = 'your_secret_key';

// // Login endpoint
// app.post('/login', async (req, res) => {
//   const { username, password } = req.body;
//   try {
//     // Check if the user exists in the database
//     const user = await Login.findOne({ username });

//     if (!user || user.password !== password) {
//       return res.status(401).json({ message: 'Invalid username or password' });
//     }

//     // Generate JWT token
//     const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '1h' });

//     // Send the token back to the client
//     res.json({ token });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // Protected route example (Fetching profile)
// app.get('/profile', authenticateToken, async (req, res) => {
//   try {
//     const userId = req.userId;
//     const profile = await Profile.findOne({ userId });
//     res.json(profile);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // Middleware to authenticate JWT token
// function authenticateToken(req, res, next) {
//   const authHeader = req.headers['authorization'];
//   const token = authHeader && authHeader.split(' ')[1];
//   if (token == null) {
//     return res.sendStatus(401);
//   }

//   jwt.verify(token, secretKey, (err, decoded) => {
//     if (err) {
//       return res.sendStatus(403);
//     }
//     req.userId = decoded.userId;
//     next();
//   });
// }

// // Start server
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

//1st
// const express = require('express');
// const bodyParser = require('body-parser');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const jwt = require('jsonwebtoken');

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Middleware
// app.use(bodyParser.json());
// app.use(cors());

// // MongoDB Connection
// mongoose.connect('mongodb://localhost/myDB', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// // Schema and Model for Login
// const loginSchema = new mongoose.Schema({
//   username: String,
//   password: String,
// });

// const Login = mongoose.model('Login', loginSchema);

// // Schema and Model for Profile
// // const profileSchema = new mongoose.Schema({
// //   userId: {
// //     type: mongoose.Schema.Types.ObjectId,
// //     ref: 'Login', // Reference to the Login collection
// //   },
// //   // Add more profile fields as needed
// //   email: String,
// //   username: String,
// //   password: String,
// // });

// // const Profile = mongoose.model('Profile', profileSchema);
// // Schema and Model for Profile
// const profileSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Login', // Reference to the Login collection
//   },
//   username: String,
//   email: String,
// });

// const Profile = mongoose.model('Profile', profileSchema);

// // Protected route example (Fetching profile)
// app.get('/profile', authenticateToken, async (req, res) => {
//   try {
//     const userId = req.userId;
//     const profile = await Profile.findOne({ userId });
//     if (!profile) {
//       return res.status(404).json({ message: 'Profile not found' });
//     }
//     // Only return username and email
//     const { username, email } = profile;
//     res.json({ username, email });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // JWT secret key
// const secretKey = 'your_secret_key';

// // Login endpoint
// app.post('/login', async (req, res) => {
//   const { username, password } = req.body;
//   try {
//     // Check if the user exists in the database
//     const user = await Login.findOne({ username });

//     if (!user || user.password !== password) {
//       return res.status(401).json({ message: 'Invalid username or password' });
//     }

//     // Generate JWT token
//     const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '1h' });

//     // Send the token back to the client
//     res.json({ token });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // Protected route example (Fetching profile)
// app.get('/profile', authenticateToken, async (req, res) => {
//   try {
//     const userId = req.userId;
//     const profile = await Profile.findOne({ userId });
//     res.json(profile);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // Middleware to authenticate JWT token
// function authenticateToken(req, res, next) {
//   const authHeader = req.headers['authorization'];
//   const token = authHeader && authHeader.split(' ')[1];
//   if (token == null) {
//     return res.sendStatus(401);
//   }

//   jwt.verify(token, secretKey, (err, decoded) => {
//     if (err) {
//       return res.sendStatus(403);
//     }
//     req.userId = decoded.userId;
//     next();
//   });
// }

// // Start server
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
//test data with profile
// server.js
// const express = require('express');
// const bodyParser = require('body-parser');

// const app = express();
// const PORT = 5000;

// // Sample data - replace this with a database in production
// let employees = [
//   { id: 1, username: 'john', password: 'password123', name: 'John Doe' },
//   { id: 2, username: 'jane', password: 'password456', name: 'Jane Smith' },
// ];

// // Middleware
// app.use(bodyParser.json());

// // Routes
// app.get('/api/employees', (req, res) => {
//   res.json(employees);
// });

// app.post('/api/employees', (req, res) => {
//   const newEmployee = req.body;
//   employees.push(newEmployee);
//   res.status(201).json(newEmployee);
// });

// app.put('/api/employees/:id', (req, res) => {
//   const id = parseInt(req.params.id);
//   const updatedEmployee = req.body;

//   employees = employees.map(employee => {
//     if (employee.id === id) {
//       return { ...employee, ...updatedEmployee };
//     }
//     return employee;
//   });

//   res.json(updatedEmployee);
// });

// app.delete('/api/employees/:id', (req, res) => {
//   const id = parseInt(req.params.id);
//   employees = employees.filter(employee => employee.id !== id);
//   res.json({ message: 'Employee deleted successfully' });
// });

// // Start server
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

