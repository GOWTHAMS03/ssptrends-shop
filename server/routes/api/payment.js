const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const OrderSchema = require('../../models/order');

const createOrder = async (request, response) => {
  try {
    const { amount } = request.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'inr',
      payment_method_types: ['card'],
    });

    response.send({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error(error);
    response.status(500).send('An error occurred');
  }
};

const payOrder = async (request, response) => {
  try {
    const { amount, payment_method_id } = request.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'usd',
      payment_method: payment_method_id,
      confirm: true,
    });

    if (paymentIntent.status === 'succeeded') {
      const newOrder = await OrderSchema.create({
        isPaid: true,
        amount: amount / 100,
        // Add order details here
      });

      response.send({ msg: 'Payment was successful' });
    } else {
      response.status(500).send({ error: 'Payment failed' });
    }
  } catch (error) {
    console.error(error);
    response.status(500).send({ error: 'An error occurred' });
  }
};

const paymentResponse = async (request, response) => {
  try {
    const orders = await OrderSchema.find();

    response.send(orders);
  } catch (error) {
    console.error(error);
    response.status(500).send({ error: 'An error occurred' });
  }
};

module.exports = {
  createOrder,
  payOrder,
  paymentResponse,
};
