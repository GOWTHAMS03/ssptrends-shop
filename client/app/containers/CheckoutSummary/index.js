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

 const renderOrderDetails = item =>{

if(item){
  return (
                 
      <div className="item-details">
                      
          <div key={item._id}>
            <img src={item.imageUrl[0]} alt={item.name} />
                    </div>
        
              </div>
    )

}
else {
  return <img className='item-image' src='/images/placeholder-image.png' />;
}
  }

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
      
        <div className='order-list'>
        
        {orderitems.items.map((item,index) => (

      <div key={index} className='order-box'>
        <div  className='d-block box-link'>
      <div className='d-flex flex-column flex-lg-row mb-3' >

        <div className='order-first-item p-lg-3'>
         
          {renderOrderDetails(item)}
        </div>

         <div className='d-flex flex-column flex-xl-row justify-content-between flex-1 ml-lg-2 mr-xl-4 p-3'>
                <div className='order-details'>
                  
                  <div className='mb-1'>
                    <span>Order #</span>
                    <span className='order-label'>{item._id}</span>
                  </div>
                  <div className='mb-1'>
                    <span>Order Name</span>
                    <span className='order-label'>{item.createdAt}</span>
                  </div>
                  <div className='mb-1'>
                    <span>Order Total</span>
                    <span className=''>  ₹{item.total}</span>
                  </div>
                  <div>
                   
                  </div>
                </div>
              </div>
              </div>
              </div>
              </div>
        ))}
       
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