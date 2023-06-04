import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Row, Col } from 'reactstrap';
import axios from 'axios';
import Button from '../../components/Common/Button';
import actions from '../../actions';
import Payment from '../Payment';

const Checkout = (props) => {
  const { addressFormData, cartItems, placeOrder, orderitems } = props;
  const history = useHistory();

  useEffect(() => {
    // Redirect to checkout page if orderitems is empty
    if (!orderitems || !orderitems.items || orderitems.items.length === 0) {
      history.push('/checkout');
    }
  }, [orderitems, history]);

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
            {orderitems.items.map((item) => (
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
          {/* Render the PaymentForm component */}
          <Payment
            addressFormData={addressFormData}
            orderitems={orderitems}
            placeOrder={placeOrder}
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
