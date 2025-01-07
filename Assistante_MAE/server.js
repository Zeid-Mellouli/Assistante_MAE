const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose'); // Import Mongoose
const path = require('path');
const cors = require('cors');  // Declare CORS only once
const bcrypt = require('bcryptjs'); // Import bcrypt for hashing passwords
const app = express();

// Use static files (for main.html and other files in the project)
app.use(express.static(path.join(__dirname, '/')));

// Serve the main HTML file on root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'main.html'));
});

const port = process.env.PORT || 10000;

app.use(cors());

const chatRoute = require("./routes/authRoutes");
app.use(bodyParser.json());

// MongoDB connection setup using Mongoose
const mongoUrl = 'mongodb';

mongoose.connect(mongoUrl)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1); // Stop server if MongoDB connection fails
  });

// Use authentication routes
app.use("/api", chatRoute);

// Define Mongoose schemas for users and claims
const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  phone: { type: String, required: true },
  situation: { type: String, required: true }
});

const reclamationSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  email: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Reclamation = mongoose.model('Reclamation', reclamationSchema);

// Route to handle claims submission (POST)
app.post('/api/reclamations', async (req, res) => {
  const { nom, email, description } = req.body;
  
  try {
    const reclamation = new Reclamation({ nom, email, description });
    await reclamation.save();
    res.status(200).json({ message: 'Réclamation soumise avec succès' });
  } catch (err) {
    console.error('Erreur lors de l\'insertion de la réclamation:', err);
    res.status(500).json({ message: 'Erreur lors de la soumission de la réclamation', error: err.message });
  }
});

// Route for user sign up (POST)
app.post('/api/signup', async (req, res) => {
  const { email, password, firstname, lastname, phone, situation } = req.body;

  if (!email || !password || !firstname || !lastname || !phone || !situation) {
    return res.status(400).json({ success: false, message: 'Tous les champs sont nécessaires.' });
  }

  try {
    // Hashing the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ email, password: hashedPassword, firstname, lastname, phone, situation });
    await newUser.save();
    res.status(201).json({ success: true, user: newUser });
  } catch (err) {
    console.error('Erreur lors de l\'insertion de l\'utilisateur:', err.message);
    res.status(500).json({ success: false, message: 'Erreur lors de la création de l\'utilisateur.', error: err  });
  }
});

// Route for user login (POST)
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Identifiants invalides.' });
    }

    // Compare entered password with hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Identifiants invalides.' });
    }

    res.status(200).json({ success: true, user });
  } catch (err) {
    console.error('Erreur lors de la connexion:', err);
    res.status(500).json({ success: false, message: 'Erreur lors de la connexion.', error: err.message });
  }
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Erreur interne du serveur:', err);
  res.status(500).json({ message: 'Une erreur est survenue, veuillez réessayer plus tard.' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
