// app.js
require('dotenv').config();
const express = require('express');
const path = require('path');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const session = require('express-session');
const bodyParser = require('body-parser');
const games = require('./game.json');

const app = express();

// View engine and public folder
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

// Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'your-secret-key', // Change this in production!
  resave: false,
  saveUninitialized: true
}));

// 🏠 Home Page
app.get('/', (req, res) => {
  res.render('index', { games, user: req.session.user });
});

// 🎮 Game Detail Page
app.get('/game/:id', (req, res) => {
  const game = games.find(g => g.id === req.params.id);
  if (!game) return res.sendStatus(404);
  res.render('game', { game, user: req.session.user });
});

// 🔐 Login - GET
app.get('/login', (req, res) => {
  res.render('login', { error: null });
});

// 🔐 Login - POST
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Dummy user validation (replace with DB lookup in production)
  if (username === 'admin' && password === '1234') {
    req.session.user = { name: 'Admin' };
    return res.redirect('/');
  }

  res.render('login', { error: 'Invalid username or password' });
});

// 🔓 Logout
app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

// 🆕 Register - GET
app.get('/register', (req, res) => {
  res.render('register', { error: null });
});

// 🆕 Register - POST
app.post('/register', (req, res) => {
  const { username, password, confirm } = req.body;

  // Simple validations
  if (!username || !password || !confirm) {
    return res.render('register', { error: 'All fields are required.' });
  }

  if (password !== confirm) {
    return res.render('register', { error: 'Passwords do not match.' });
  }

  // Simulate saving user and login
  req.session.user = { name: username };
  res.redirect('/');
});

// 💳 Stripe Checkout
app.post('/create-checkout-session', async (req, res) => {
  const game = games.find(g => g.id === req.body.id);
  if (!game) return res.sendStatus(404);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: {
          name: game.title,
        },
        unit_amount: game.price * 100,
      },
      quantity: 1,
    }],
    mode: 'payment',
    success_url: `${req.headers.origin}/success`,
    cancel_url: `${req.headers.origin}/game/${game.id}`,
  });

  res.json({ url: session.url });
});

// ✅ Payment Success Page
app.get('/success', (req, res) => {
  res.render('success');
});

// 🔊 Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
