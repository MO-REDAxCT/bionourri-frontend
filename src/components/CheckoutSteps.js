import React from 'react'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/esm/Container'
export default function CheckoutSteps(props) {
  return (
    <Container>
        <Row className='checkout-steps'>
            <Col className={props.step1 ? 'active' : ''}>
                <p>
                    Sign-in
                </p>

            </Col>
            <Col className={props.step2 ? 'active' : ''}>
                <p>
                    Shipping
                </p>

            </Col>
            <Col className={props.step3 ? 'active' : ''}>
                <p>
                    Payment
                </p>

            </Col>
            <Col className={props.step4 ? 'active' : ''}>
                <p>
                    Place Order
                </p>

            </Col>
        </Row>
        </Container>
  )
}
