import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Button from '../../components/Common/Button';
import Checkbox from '../../components/Common/Checkbox';

const PaymentForm = props => {

  const { addressFormData, cartItems, placeOrder,finalamount,orderitems } =props;
  const [loading, setLoading] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [captcha, setCaptcha] = useState('');
  const [captchaError, setCaptchaError] = useState('');
  const [generatedCaptcha, setGeneratedCaptcha] = useState('');
  const [orderAmount, setOrderAmount] = useState(0);
  const [orders, setOrders] = useState([]);
  const location = useLocation();

  console.log(cartItems)
  console.log(orderitems)

  const url = 'http://localhost:3000/api';

  useEffect(() => {
    generateCaptcha();
  }, []);

  const generateCaptcha = () => {
    const newCaptcha = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedCaptcha(newCaptcha);
  };

  useEffect(() => {
    let isMounted = true;
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get(`${url}/payres`);
        if (isMounted) {
          setOrders(data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchOrders();

    return () => {
      isMounted = false;
    };
  }, [orderAmount]);

 
  const getTotalOrderAmount = (orderitems) => {
   
    return orderitems.total; // Return 0 if orderitems or items array is not valid
};

   // Replace 0 with the calculated total amount
  

  const loadRazorpay = async () => {
    const { addressFormData, cartItems } = props; // Assuming these props contain the required data
    const totalOrderAmount = getTotalOrderAmount(orderitems);

    try {
      setLoading(true);
      const result = await axios.post(`${url}/createorder`, {
        amount: totalOrderAmount * 100,
        address: addressFormData, // Pass addressFormData to the backend to use in the order creation
        items: cartItems, // Pass orderitems to the backend to use in the order creation
      });
  
      const { amount, id: order_id, currency } = result.data;
      const { data: { key: razorpayKey }} = await axios.get(`${url}/getrazorpaykey`);
  
      const options = {
        key: razorpayKey,
        amount: getTotalOrderAmount(cartItems), // Amount must be in paise (multiply by 100)
        currency: currency, // Make sure to provide the correct currency code, it should be a string (e.g., 'INR')
        name: 'SSP TRENDS',
        description: 'thank you for your order',
        order_id: order_id,
        handler: async function (response) {
          try {
            const result = await axios.post(`${url}/payorder`, {
              amount: getTotalOrderAmount(cartItems),
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
            });
           
           
            placeOrder(addressFormData, cartItems, 'Online Payment');
          } catch (error) {
            
            alert('Payment failed. Please try again later.');
          }
        },
        prefill: {
          name: addressFormData.name, // Use the customer's name from addressFormData
          email: addressFormData.email, // Use the customer's email from addressFormData
          contact: addressFormData.phone, // Use the customer's phone from addressFormData
        },
        theme: {
          color: '#00AB55',
        },
        netbanking: {
          hide: true,
        },
      };
  
      setLoading(false);
      const paymentObject = new Razorpay(options);
      paymentObject.open();
    } catch (err) {
      console.log(err);
      alert('Failed to initiate payment. Please try again later.');
      setLoading(false);
    }
  };
  

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const totalAmount = searchParams.get('total');
    if (totalAmount) {
      setOrderAmount(parseInt(totalAmount));
    } else {
      const calculatedTotalAmount = getTotalOrderAmount(cartItems);
      setOrderAmount(calculatedTotalAmount);
    }
  }, [location.search, cartItems]);

  const handlePayment = async () => {
    setLoading(true);

    if (paymentMethods.length === 0) {
      // No payment method selected, show an alert or update state to inform the user
      alert('Please choose a payment method');
      setLoading(false);
      return;
    }

    if (paymentMethods.includes('cod') && captcha === generatedCaptcha) {
      try {
        placeOrder(addressFormData, cartItems,finalamount, 'Cash on Delivery');
      } catch (error) {
        console.log(error);
      }
    } else if (paymentMethods.includes('online')) {
      try {
        loadRazorpay();
      } catch (err) {
        alert(err);
      }
    }

    setLoading(false);
  };

  const isProceedEnabled =
    paymentMethods.length > 0 &&
    (paymentMethods.includes('online') ||
      (paymentMethods.includes('cod') && captcha === generatedCaptcha));

  const handleCheckboxChange = (method) => {
    const updatedMethods = paymentMethods.includes(method)
      ? paymentMethods.filter((m) => m !== method)
      : [...paymentMethods, method];
    setPaymentMethods(updatedMethods);
  };

  return (
    <div>
      <h3>Select Payment Method:</h3>
      <div>
        <label>
          <Checkbox
            type="checkbox"
            value="cod"
            checked={paymentMethods.includes('cod')}
            onChange={() => handleCheckboxChange('cod')}
          />
          Cash on Delivery
        </label>
      </div>
      {paymentMethods.includes('cod') && (
        <div>
          <p>Enter the Captcha: (Hint: {generatedCaptcha})</p>
          <input
            type="text"
            value={captcha}
            onChange={(e) => {
              setCaptcha(e.target.value);
              setCaptchaError('');
            }}
          />
          {captchaError && <p>{captchaError}</p>}
        </div>
      )}
      <div>
        <label>
          <Checkbox
            type="checkbox"
            value="online"
            checked={paymentMethods.includes('online')}
            onChange={() => handleCheckboxChange('online')}
          />
          Online Payment
        </label>
      </div>
      <div>
        <Button
          type="submit"
          disabled={loading || !isProceedEnabled}
          text={paymentMethods.includes('online') ? 'Proceed to Payment' : 'Proceed'}
          onClick={handlePayment}
        />
      </div>
    </div>
  );
  
};

export default PaymentForm;