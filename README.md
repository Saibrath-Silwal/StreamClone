# StreamClone

# Stream Clone Game Store with Stripe API

This is a simple e-commerce game store built using **Express.js** and integrated with **Stripe API** for payment processing. It mimics a "Stream" platform where users can browse and purchase games.

## Technologies Used

- Node.js
- Express.js
- EJS templating
- Stripe API
- dotenv
- CSS (custom)




Follow these steps to complete the exercise:

1. Clone the repo and install dependencies.
2. Launch the app with `node app.js`.
3. Browse the homepage to see the games.
4. Select a game and click "Buy Now".
5. Complete the checkout using Stripe's test card:
   - Use test card number: `4242 4242 4242 4242`
   - Any future expiry date, CVC, and postal code
6. View the success message after payment.

Optional: Add a new game to `games.json` and test it.

##  Live Demo

[Click here to view the live app]
https://streamclone.onrender.com/


## Project Structure

stream-clone/
├── public/
│   └── css/style.css
│   └── images/
├── views/
│   ├── index.ejs
│   ├── game.ejs
│   └── success.ejs
├── routes/index.js
├── games.json
├── app.js
├── .env
└── README.md

## Team Members

- Saibrath Silwal — Backend + Stripe Integration
- Oman Kunwar —  Backend + Stripe Integration
- Diwash Niroula — Frontend and EJS, Slides
- Manoj Khatri Chettri — Frontend and EJS, Slides
````
