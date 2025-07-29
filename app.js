// Load environment variables
require('dotenv').config();

const express = require('express');
const path = require('path');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const session = require('express-session'); // Optional, only if you want to track logins
const app = express();
const games = require('./game.json');

// Set EJS as view engine
app.set('view engine', 'ejs');

// Set views directory
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(session({
  secret: 'my_secret_key',
  resave: false,
  saveUninitialized: true
}));

// Home Page
app.get('/', (req, res) => {
  res.render('index', { games });
});

// Game Detail Page
app.get('/game/:id', (req, res) => {
  const game = games.find(g => g.id === req.params.id);
  if (!game) return res.sendStatus(404);
  res.render('game', { game });
});

// Contact Page
app.get('/contact', (req, res) => {
  res.render('contact');
});

// Login Page
app.get('/login', (req, res) => {
  res.render('login');
});

// Logout Page
app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).send('Logout failed');
    }
    res.render('logout');
  });
});

// Stripe Checkout Session
app.post('/create-checkout-session', async (req, res) => {
  const game = games.find(g => g.id === req.body.id);
  if (!game) return res.sendStatus(404);

  try {
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
  } catch (error) {
    console.error('Stripe error:', error);
    res.status(500).send('Error creating checkout session');
  }
});

// Success Page
app.get('/success', (req, res) => {
  res.render('success');
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

app.get('/cart', (req, res) => {
  // Example cart items (static for now, replace with real session or DB data)
  const cart = [
    { id: "1", title: "Cyber Adventure", price: 2999, image: "/images/cyber.jpg" },
    { id: "2", title: "Pixel Racer", price: 1999, image: "/images/racer.jpg" }
  ];
  res.render('cart', { cart });
});

