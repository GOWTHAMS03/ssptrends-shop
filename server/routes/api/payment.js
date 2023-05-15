const OrderSchema = require("../../models/order");
const Razorpay = require("razorpay");

const createOrder = (request, response) => {
  try {
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: request.body.price,
      currency: "INR",
    };
    instance.orders.create(options, (err, order) => {
      if (err) {
        console.error(err);
        return response.send("Some error occurred");
      }
      response.send(order);
    });
  } catch (error) {
    console.error(error);
    response.send(error);
  }
};

const payOrder = async (request, response) => {


  try {
    const { amount, razorpayPaymentId, razorpayOrderId, razorpaySignature } = request.body;
    const newOrder = await OrderSchema.create({
      isPaid: true,
      amount: amount,
      razorpay: {
        order_id: razorpayOrderId,
        payment_id: razorpayPaymentId,
        signature: razorpaySignature,
      },
    });
    response.send({ msg: "Payment was successful" });
  } catch (error) {
    console.error(error);
    response.send(error);
  }
};

const paymentResponse = async (request, response) => {
  try {
    const orders = await OrderSchema.find();
    console.log(orders);
    response.send(orders);
  } catch (error) {
    console.error(error);
    response.send(error);
  }
}

module.exports = {
  createOrder,
  payOrder,
  paymentResponse
};
