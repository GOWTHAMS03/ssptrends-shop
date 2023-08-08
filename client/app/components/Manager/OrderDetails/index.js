import React from 'react';
import { Row, Col } from 'reactstrap';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ROLES } from '../../../constants';
import OrderMeta from '../OrderMeta';
import OrderItems from '../OrderItems';
import OrderSummary from '../OrderSummary';
import OrderTrack from '../OrderTrack';

const OrderDetails = (props) => {
  const { order,returnOrder, user, users, cancelOrder, updateOrderItemStatus, onBack } = props;


  const handleDownload = () => {
    const doc = new jsPDF();

    // Get the order details container
    const orderDetailsContainer = document.getElementById('order-details');

    // Create a promise that resolves when all sections are rendered as images
    const promises = [];

    // Iterate over each child element of the order details container
    for (let i = 0; i < orderDetailsContainer.children.length; i++) {
      const childElement = orderDetailsContainer.children[i];

      // Convert each child element to a canvas using html2canvas and add the promise to the promises array
      promises.push(html2canvas(childElement));
    }

    // Wait for all promises to resolve
    Promise.all(promises).then((canvases) => {
      // Iterate over the canvases and add each image to the PDF document
      for (let i = 0; i < canvases.length; i++) {
        const canvas = canvases[i];
        const imageData = canvas.toDataURL('image/png');
        doc.addImage(imageData, 'PNG', 10, 10, 190, 0);
        if (i < canvases.length - 1) {
          doc.addPage(); // Add a new page for each section except the last one
        }
      }

      // Add the order details ID separately to the PDF document
      doc.addPage();
      doc.text(`Order Details ID: ${order._id}`, 10, 10); // Replace `order.id` with the actual property of your order object

      // Save the PDF document
      doc.save('order_details.pdf');
    });
  };

  return (
    <div className="order-details " >
      <div id="order-details">
      <Row>
        <Col xs="12" md="12" >
          <OrderMeta  order={order} users={users} cancelOrder={cancelOrder} onBack={onBack} />
        </Col>
      </Row>
      <Row className="mt-5" id="order-details-container">
        <Col xs="12" lg="8">
          <OrderItems order={order} user={user} updateOrderItemStatus={updateOrderItemStatus} />
        </Col>
        <Col xs="12" lg="4" className="mt-5 mt-lg-0">
          <OrderSummary order={order} />
        </Col>
      </Row>
      </div>
      {/* <Row>
        <Col xs="12" lg="12" className="mt">
          <OrderTrack order={order} />
        </Col>
      </Row> */}
      {user.role === ROLES.Admin && (
        <Row>
          <Col xs="12" lg="12" className="mt-3">
            <button onClick={handleDownload}>Download PDF</button>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default OrderDetails;
