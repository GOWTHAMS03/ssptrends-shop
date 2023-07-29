import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Button from '../../components/Common/Button';
import Checkbox from '../../components/Common/Checkbox';


const PaymentForm = ({ addressFormData, orderitems, placeOrder }) => {
  const [loading, setLoading] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [captcha, setCaptcha] = useState('');
  const [captchaError, setCaptchaError] = useState('');
  const [generatedCaptcha, setGeneratedCaptcha] = useState('');
  const [orderAmount, setOrderAmount] = useState(0);
  const [orders, setOrders] = useState([]);
  const location = useLocation();

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

  const getTotalOrderAmount = () => {
    // Implement this function to calculate the total order amount based on your business logic
    // For example:
    // const totalAmount = orderitems.reduce((total, item) => total + item.price, 0);
    // return totalAmount;
    return 0; // Replace 0 with the calculated total amount
  };

  const loadRazorpay = async () => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onerror = () => {
      alert('Razorpay SDK failed to load. Are you online?');
    };
    script.onload = async () => {
      try {
        setLoading(true);
        const result = await axios.post(`${url}/createorder`, {
          amount: orderAmount,
        });
        const { amount, id: order_id, currency } = result.data;
        const {
          data: { key: razorpayKey },
        } = await axios.get(`${url}/getrazorpaykey`);

        const options = {
          key: razorpayKey,
          amount: getTotalOrderAmount() * 100, // Amount must be in paise (multiply by 100)
          currency: currency,
          name: 'example name',
          description: 'example transaction',
          order_id: order_id,
          handler: async function (response) {
            try {
              const result = await axios.post(`${url}/payorder`, {
                amount: getTotalOrderAmount(),
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature,
              });
              console.log(response);
              alert(result.data.msg);
              placeOrder(addressFormData, orderitems, 'Online Payment');
            } catch (error) {
              console.log(error);
            }
          },
          prefill: {
            name: 'SSP Trends',
            email: 'ssptrends@gmail.com',
            contact: '+91 9445460403',
          },
          notes: {
            address: 'example address',
          },
          theme: {
            color: '#00AB55',
          },
          netbanking: {
            hide: true,
          },
          wallet: {
            hide: true,
          },
        };

        setLoading(false);
        const paymentObject = new Razorpay(options);
        paymentObject.open();
      } catch (err) {
        alert(err);
        setLoading(false);
      }
    };
    document.body.appendChild(script);
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const totalAmount = searchParams.get('total');
    if (totalAmount) {
      setOrderAmount(parseInt(totalAmount));
    }
  }, [location.search]);

  const handlePayment = async () => {
    setLoading(true);

    if (paymentMethods.includes('cod') && captcha === generatedCaptcha) {
      try {
        placeOrder(addressFormData, orderitems, 'Cash on Delivery');
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
