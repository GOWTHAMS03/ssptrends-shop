import React from 'react';
import { Container, Row, Col } from 'reactstrap';

const CartSummary = props => {
  const { cartTotal } = props;

  // Calculate the shipping cost based on the cartTotal
  const shippingCost = cartTotal.total >= 500 ? 50 : 0;
console.log(shippingCost)
  return (
    <div className='cart-summary'>
      <Container>
        <Row className='mb-2 summary-item'>
          <Col xs='9'>
            <p className='summary-label'>Free Shipping</p>
          </Col>
          <Col xs='3' className=''>
            <p className=''>₹ {shippingCost}</p>
          </Col>
        </Row>
        <Row className='mb-2 summary-item'>
          <Col xs='9'>
            <p className='summary-label'>Total</p>
          </Col>
          <Col xs='3' className='text-right'>
            <p className=''>₹{cartTotal.total}</p>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default CartSummary;
