import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Row, Col } from 'reactstrap';

import Input from '../../components/Common/Input';
import Button from '../../components/Common/Button';

function index() {
  const [coupons, setCoupons] = useState([]);
  const [couponCode, setCouponCode] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [discountedPrice, setDiscountedPrice] = useState(0);

  const url = 'http://localhost:3000/api';

  // Fetch the list of coupons on mount
  useEffect(() => {
    axios.get(`${url}/coupons`)
      .then((res) => setCoupons(res.data))
      .catch((err) => console.error(err));
  }, []);


  // Apply the coupon to the total price on submit
  function handleSubmit(event) {
    event.preventDefault();
    axios.post(`${url}/coupons/apply`, { code: couponCode, totalPrice })
      .then((res) => setDiscountedPrice(res.data.discountedPrice))
      .catch((err) => console.error(err));
  }

  // Create a new coupon on submit
  function handleCreate(event) {
    event.preventDefault();
    const data = {
      code: event.target.code.value,
      discount: event.target.discount.value,
    };
    axios.post(`${url}/coupons`, data)
      .then((res) => setCoupons([...coupons, res.data]))
      .catch((err) => console.error(err));
  }

  // Update a coupon on submit
  function handleUpdate(event) {
    event.preventDefault();
    const id = event.target.id.value;
    const data = {
      code: event.target.code.value,
      discount: event.target.discount.value,
    };
    axios.put(`${url}/coupons/${id}`, data) // fixed URL
      .then((res) => {
        const updatedCoupon = res.data;
        setCoupons(coupons.map((coupon) => coupon._id === updatedCoupon._id ? updatedCoupon : coupon));
      })
      .catch((err) => console.error(err));
  }


  // Delete a coupon on click
  function handleDelete(id) {
    axios.delete(`${url}/coupons/${id}`)
      .then(() => setCoupons(coupons.filter((coupon) => coupon._id !== id)))
      .catch((err) => console.error(err));
  }

  return (
    <div>
      <Col xs='12' lg='10'>
        <h1>Coupon Management System</h1>
        <h2>List of Coupons</h2>
        <table xs="10" lg="8">
          <thead>
            <tr>
              <th>ID</th>
              <th>Code</th>
              <th>%</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((coupon) => (
              <tr key={coupon._id}>
                <td>{coupon._id}</td>
                <td>{coupon.code}</td>
                <td>{coupon.discount}</td>
                <td><Button type='submit' text='Delete' onClick={() => handleDelete(coupon._id)} /> </td>
              </tr>
            ))}
          </tbody>

        </table>
      </Col>
      <Col xs='12' lg='6'>
        <h2>Create Coupon</h2>
        <form onSubmit={handleCreate}>
          <label htmlFor="code">Code:</label>
          <Input type="text" id="code" />
          <br />
          <label htmlFor="discount">Discount (%):</label>
          <Input type="number" id="discount" />
          <br />
          <div className='reset-actions'>
            <Button type='submit' text='Create Coupon'></Button>
          </div>
        </form>
      </Col>
      <Col xs='12' lg='6'>
        <h2>Update Coupon</h2>
        <form onSubmit={handleUpdate}>
          <label htmlFor="id">ID:</label>
          <Input type="text" id="id" />
          <br />
          <label htmlFor="code">Code:</label>
          <Input type="text" id="code" />
          <br />

          <label htmlFor="discount">Discount (%):</label>
          <input type="number" id="discount" />

          <br />
          <Button type="submit" text="Update Coupon" />
        </form>
      </Col>
    </div>

  );
}

export default index;
