import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import Button from '../../components/Common/Button';

const Checkout = props => {
  const { addressFormData, orderitems } = props;
  const history = useHistory(); // import and use useHistory hook


  const handleProceedToPayment = () => {
    const totalAmount = orderitems.orderitems.total;
    history.push(`/payment?total=${totalAmount}`); // add query parameter to URL
  }

  return (
    <div>
      <div>
        <h2>Checkout Summary</h2>
        <p>Shipping Address:</p>
        <p>{addressFormData.address}</p>
        <p>{addressFormData.city}, {addressFormData.state} {addressFormData.zipCode}</p>
        <p>{addressFormData.country}</p>
      </div>
      <div>
        {orderitems.orderitems && orderitems.orderitems.items && orderitems.orderitems.items.length > 0 && (
          <div className='item-details'>
            <p>Order Details:</p>
            <img src={orderitems.orderitems.items[0].imageUrl[0]} />
            <p>{orderitems.orderitems.items[0].name}</p>
            <p>{orderitems.orderitems.total}</p>
          </div>
        )}

      </div>
      <div>
        <div className='add-address-actions'>
          <Button type='submit' text='Proceed to Payment' onClick={handleProceedToPayment} />
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    addressFormData: state.address.addressFormData,
    cartItems: state.cart.cartItems,
    orderitems: state.orderitem,
  };
};

export default connect(mapStateToProps)(Checkout);
