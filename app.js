// app.js
require('dotenv').config();
const express = require('express');
const path = require('path');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const app = express();
const games = require('./game.json');

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Home Page
app.get('/', (req, res) => {
  res.render('index', { games });
});

// Game Detail
app.get('/game/:id', (req, res) => {
  const game = games.find(g => g.id === req.params.id);
  if (!game) return res.sendStatus(404);
  res.render('game', { game });
});

// Stripe Checkout
app.post('/create-checkout-session', async (req, res) => {
  const game = games.find(g => g.id === req.body.id);
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

// Success Page
app.get('/success', (req, res) => {
  res.render('success');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));