import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { Row, Col } from 'reactstrap';
import axios from 'axios';
import Button from '../../components/Common/Button';
import actions from '../../actions';


const Checkout = (props) => {
  const { addressFormData, cartItems, placeOrder, orderitems } = props;
  const history = useHistory();

  const [loading, setLoading] = useState(false);
  const [orderAmount, setOrderAmount] = useState(0);
  const [order, setOrder] = useState({});
  const location = useLocation();

  const url = 'http://localhost:3000/api';

  useEffect(() => {
    let isMounted = true;
    const fetchOrder = async () => {
      try {
        const { data } = await axios.get(`${url}/payres`);
        if (isMounted) {
          setOrder(data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchOrder();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    // Redirect to checkout page if orderitems is empty
    if (!orderitems || !orderitems.items || orderitems.items.length === 0) {
      history.push('/checkout');
    }
  }, [orderitems, history]);

  const loadRazorpay = async () => {
    const paymentType = 'razorpay';
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onerror = () => {
      alert('Razorpay SDK failed to load. Are you online?');
    };
    script.onload = async () => {
      try {
        setLoading(true);
        const result = await axios.post(`${url}/createorder`, {
          amount: orderitems.total,
        });
        const { amount, id: order_id, currency } = result.data;
        const {
          data: { key: razorpayKey },
        } = await axios.get(`${url}/getrazorpaykey`);

        const options = {
          key: razorpayKey,
          amount: (orderitems.total * 100).toString(),
          currency: currency,
          name: 'ssp trends',
          description: 'ssp trends',
          order_id: order_id,
          handler: async function (response) {
            try {
              const result = await axios.post(`${url}/payorder`, {
                amount: orderAmount,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature,
              });
              console.log(response);
              

              // Dispatch the placeOrder action with addressFormData and orderitems
              placeOrder(addressFormData, orderitems);

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
        const paymentObject = new window.Razorpay(options);
        paymentObject.open();

      } catch (err) {
        alert(err);
        setLoading(false);
      }
    };
    document.body.appendChild(script);
  };

  const handleClick = () => {
    placeOrder(addressFormData, orderitems);
 
  };

  return (
    <div>
      <div>
        <h2>Checkout Summary</h2>
        <p>Shipping Address:</p>
        <p>{addressFormData.address}</p>
        <p>
          {addressFormData.city}, {addressFormData.state} {addressFormData.zipCode}
        </p>
        <p>{addressFormData.phonenumber}</p>
        <p>{addressFormData.country}</p>
      </div>
      <div>
        {orderitems.items && orderitems.items.length > 0 && (
          <div className="item-details">
            <p>Order Details:</p>
            {orderitems.items.map(item => (
              <div key={item._id}>
                <img src={item.imageUrl[0]} alt={item.name} />
                <p>{item.name}</p>
              </div>
            ))}
            <h3>
              Total: <h2>{orderitems.total}</h2>
            </h3>
          </div>
        )}
      </div>
      <div>
        <div className='parent-container'>
          <Button
            type="submit"
            disabled={loading}
            text="Proceed to Payment"
            onClick={loadRazorpay}
            
          />
        </div>
      </div>
     
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    addressFormData: state.address.addressFormData,
    cartItems: state.cart.cartItems,
    orderitems: state.orderitem.orderitems,
  };
};

export default connect(mapStateToProps, actions)(Checkout);
