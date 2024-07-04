import React, { useContext } from 'react'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroupItem from 'react-bootstrap/esm/ListGroupItem';
import ListGroup from 'react-bootstrap/ListGroup';
import { Store } from '../Store';
import Card from 'react-bootstrap/Card';
import { Link, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container'



function Cart_itmes_l(total , item)
    {
      return total + item.quantity
    }

function total_Price(total , item )   
    {
      return total + (item.quantity*item.price)
    }

  
export default function CartScreen() {
  const {state , dispatch} =  useContext(Store)
  const {cart} = state 
  const {cartitems} = cart
  function add_handleClick(x)
    {
     const quantity = x.quantity + 1 
      dispatch({type:'add_to_cart' , payload : {...x, quantity}})
    }  
   function minus_handleClick(x) 
    {
      const quantity = x.quantity - 1 
      dispatch({type:'add_to_cart' , payload : {...x, quantity}})
    }
  function dlt_handleClick(x)
  {
      const quantity = 0
      dispatch({type:'dlt_from_cart' , payload : {...x, quantity}})
  }
  const Navigate = useNavigate()
  function handleCheckout()
  {
    
    Navigate('/signin?redirect=/shipping')
  }
  return (
    
    <>
    <Container>
    <h1>Shoping cart</h1>
    
    <Row>
      <Col sm={12} md={8} lg={8} className='mb-2'>
          <ListGroup>
            {cartitems.map((x)=>{
              
              return <ListGroupItem key={x} >
                <Row className='align-items-center hp '>
                  <Col className='d-flex align-items-center mb-3' sm={4} md={4} lg={4}>
                    
                      <Card style={{ width: '18rem'  , height : '100%'}}><Card.Img className='img-fluid rounded img-thumbnail' variant="top" src={x.img} /></Card>
                      &nbsp;&nbsp;
                     <Link to={`/products/${x.slug}`}>{x.name}</Link>
                  </Col>
                  <Col className='mb-3'sm={4} md={4} lg={4}>
                      <Button disabled = {x.quantity === 1} onClick={()=>{minus_handleClick(x)}}>
                          <i className='fas fa-minus-circle '></i>
                      </Button>&nbsp;&nbsp;
                      <span>{x.quantity}</span>&nbsp;&nbsp;
                      <Button disabled = {x.countInStock === x.quantity } onClick={()=>{add_handleClick(x)}}>
                          <i className={'fas fa-plus-circle font_aw'}></i>
                      </Button>
                  </Col>
                  <Col className='d-flex justify-content-start  mb-3' sm={2} md={2} lg={2}>
                      <strong className='w-100'>{x.price} $</strong>
                  </Col>
                  <Col className='mb-3'sm={2} md={2} lg={1}>
                      <Button onClick={()=>{dlt_handleClick(x)}}>
                          <i className={'fas fa-trash '} ></i>
                      </Button>
                  </Col>
                </Row>
              </ListGroupItem>



            })}
              
          </ListGroup>
      </Col>
      <Col>
            <ListGroup>
              <ListGroupItem><h3>{`Subtotal (${cartitems.reduce(Cart_itmes_l , 0)} items) : ${cartitems.reduce(total_Price , 0)} dh`}</h3></ListGroupItem>
              <ListGroupItem>
              
               <Button variant="primary" className='m-2' onClick={()=>{handleCheckout()}}>proceed to checkout</Button>
              
              </ListGroupItem>
            </ListGroup>
      </Col>
    </Row>
    </Container>
    </>
  )
}
