// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid'); // Import the uuid package for generating unique IDs

// Create an Express app
const app = express();

// Configure CORS middleware to allow requests from specific origins
const corsOptions = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
};

// Middleware to parse JSON request bodies
app.use(cors(corsOptions)); // Use the CORS middleware
app.use(bodyParser.json());

// Configure Multer for handling file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, `${__dirname}/Uploads/`);
    },
    filename: (req, file, cb) => {
        const uniqueFileName = `${uuidv4()}-${file.originalname}`; // Generate a unique filename
        cb(null, uniqueFileName);
      },
});

// sets up middleware for handling file uploads using the multer package
const upload = multer({ storage });

// Sample data (in-memory database)
const recordings = [];

// POST route to upload a new voice recording
app.post('/upload', upload.single('audio'), (req, res) => {

    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }
    // Handle the uploaded audio file, e.g., save it to a directory or process it
    console.log('File uploaded successfully:', req.file.filename);
    res.status(200).send('File uploaded successfully.');

});

// GET route to retrieve all voice recordings sorted by date
app.get('/list', (req, res) => {
  const sortedRecordings = recordings.slice().sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });
  res.json(sortedRecordings);
});

// Start the Express server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
