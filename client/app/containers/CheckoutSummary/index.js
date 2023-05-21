import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import Button from '../../components/Common/Button';

const Checkout = props => {
  const { addressFormData, orderitems } = props;
  const history = useHistory(); // import and use useHistory hook

  const handleProceedToPayment = () => {
    const totalAmount = orderitems.total;
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
        {orderitems.items && orderitems.items.length > 0 && (
          <div className='item-details'>
            <p>Order Details:</p>
            {orderitems.items.map(item => (
              <div key={item._id}>
                <img src={item.imageUrl[0]} alt={item.name} />
            
                <p>{item.name}</p>
              </div>
              
            ))}
            <p>Total: {orderitems.total}</p>
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
    orderitems: state.orderitem.orderitems,
  };
};

export default connect(mapStateToProps)(Checkout);
