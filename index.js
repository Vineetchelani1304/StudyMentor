const express = require('express');
const app = express();

const profileRoutes = require('./src/routes/profile');
const courseRoutes = require('./src/routes/course');
// const paymentRoutes = require('./src/routes/payments'); // Uncomment when you add the payment routes
const userRoutes = require('./src/routes/user');

const database = require('./src/config/databse');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { cloudConnect } = require('./src/config/cloudconnect');

const fileUploader = require('express-fileupload');
const dotenv = require('dotenv');
dotenv.config();

const PORT = process.env.PORT || 4000;

// Connect to the database
database.DbConnect();

// Middleware
app.use(express.json());
app.use(cookieParser()); // Fixed: Added parentheses
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);
app.use(
  fileUploader({
    useTempFiles: true,
    tempFileDir: '/tmp',
  })
);

// Connect to cloud storage
cloudConnect();

// Routes
app.use('/api/v1/auth', userRoutes); 
app.use('/api/v1/course', courseRoutes); // Fixed: Added leading slash
app.use('/api/v1/profile', profileRoutes); // Fixed: Added leading slash

// Root endpoint
app.get('/', (req, res) => {
  return res.json({
    success: true,
    message: 'Your server is working properly',
  });
});
app.get('/',(req,res)=>{
    return res.send(`<h1>hello</h1>`);
 } )
// Start the server
app.listen(PORT, () => {
  console.log(`App is getting started on port ${PORT}`); // Fixed: Removed unnecessary parameters
});
