const Stripe = require('stripe');
const stripe = Stripe('sk_test_your_secret_key'); // Replace with your Stripe secret key

exports.createPaymentIntent = async (req, res) => {
  try {
    const { amount, currency } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
      amount, // amount in cents
      currency,
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};