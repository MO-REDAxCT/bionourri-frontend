import React, { useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/esm/Container';
import Card from 'react-bootstrap/Card';
import { Store } from '../Store';
import { useContext } from 'react';
import ListGroupItem from 'react-bootstrap/esm/ListGroupItem';
import ListGroup from 'react-bootstrap/ListGroup';
import { Link , useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import axios from 'axios'
import Toast from 'react-bootstrap/Toast';
import LoadingBox from '../components/LoadingBox';
import CheckoutSteps from '../components/CheckoutSteps';
import {flushSync} from 'react-dom';

function Total_price(total , item)
{
    
    return total + (item.price*item.quantity)
}


export default function PlaceOrderScreen() {
    
    const {state , dispatch} = useContext(Store)
    const {cart} = state 
    const [t_state , setT_state] = useState({err:false , loading:false})
    const {err , loading} = t_state
    cart.shippingAdress = cart.shipping.adress
    cart.itemsPrice = cart.cartitems.reduce(Total_price,0)
    cart.shippingPrice = (cart.itemsPice < 200) ? 0 :  10
    cart.taxPrice = cart.itemsPrice * 0.15 
    cart.totalPrice = cart.itemsPrice + cart.shippingPrice + cart.taxPrice 
    
    const navigate = useNavigate()
   
    async function  handleClick()
    {
        console.log("pop" , cart.cartitems)
        
            setT_state({err:false , loading:true}) 
            
            
             
        try
            {
                       
                console.log("ya wla" , state)
                const result = await axios.post('/api/order' , {
                    
                    orderItems : cart.cartitems , 
                    shippingAdress : cart.shipping , 
                    paymentMethod : cart.paymentMethod , 
                    itemsPrice : cart.itemsPrice , 
                    shippingPrice : cart.shippingPrice , 
                    taxPrice : cart.taxPrice , 
                    totalPrice : cart.totalPrice
                    
                } , {
                    headers:{
                        authorization : `Bearer ${state.userinfo.token}` , 
                    },
                })
                    
                    dispatch({type : 'CART_CLEAR'})
                    console.log("hassi" , result.data.order)
                    dispatch({type : 'PLACE_ORDER' , payload : result.data.order})
                    navigate(`/order/${result.data.order._id}`)
            }
        catch(err)
            {
                  
              setTimeout(()=>{setT_state({loading:false  , err : err.message})} , 1000)
            }
    
    
}
  return (
    <>
    <CheckoutSteps  step1 step2 step3 step4></CheckoutSteps>
    <Container className='mt-4' style={{
         
         marginInline:'auto'
    }}>
        <h1>Preview Order</h1>
        <Row className='mt-4'>
            <Col lg='8' sm='12' md='8' style={{textAlign:'left'}}>
                
                <Card className='mb-3'>
                    <Card.Header>Shipping</Card.Header>
                    <Card.Body>
                        <Card.Text>
                            <strong>Name:&nbsp;</strong>
                            {state.cart.shipping.fullname}
                        </Card.Text>
                        <Card.Text>
                            <strong>Adress:&nbsp;</strong>
                            {cart.shippingAdress}
                        </Card.Text>
                        <Card.Link>Edit</Card.Link>
                    </Card.Body>
                </Card>

                <Card className='mb-3'>
                    <Card.Header>Payment</Card.Header>
                    <Card.Body>
                        <Card.Text>
                            <strong>Method:&nbsp;</strong>
                            {state.cart.paymentMethod}
                        </Card.Text>
                        <Card.Link>Edit</Card.Link>
                    </Card.Body>
                </Card>
                <Card className='mb-3'>
                    <Card.Header>items</Card.Header>
                    <Card.Body>
                        <ListGroup>
                        {
                            state.cart.cartitems.map((x)=>{
                                return <ListGroupItem key={x}>
                                    <Row className='align-items-center '>
                                        <Col className='d-flex align-items-center' >
                                            <Card style={{width:'65px'}}><Card.Img className='img-fluid rounded img-thumbnail' variant="top" src={x.img} /></Card>
                                            &nbsp;&nbsp;
                                            <Link to={`/products/${x.slug}`}>{x.name}</Link>
                                        </Col>
                                        <Col style={{textAlign:'center'}}>
                                            <p>{x.quantity}</p>
                                        </Col>
                                        <Col style={{textAlign:'center'}}>
                                            <p>{ x.quantity * x.price}dh</p>
                                        </Col>
                                    </Row>
                                </ListGroupItem>
                            })
                         
                        }
                        </ListGroup>
                        <Card.Link>Edit</Card.Link>
                    </Card.Body>
                </Card>
            </Col>

            <Col lg='4' sm='12' md='4' >
                        
                            <Card>
                                <Card.Header>Order Summary</Card.Header>
                                <Card.Body>
                                    <ListGroup>
                                        <ListGroupItem>
                                            <Row>
                                                <Col>
                                                    <p>Items</p>
                                                </Col>
                                                <Col>
                                                    <p>{cart.itemsPrice}dh</p>
                                                </Col>
                                            </Row>
                                        </ListGroupItem>    
                                        <ListGroupItem>  
                                            <Row>
                                                <Col>
                                                    <p>Shipping</p>
                                                </Col>
                                                <Col>
                                                    <p>{cart.shippingPrice}</p>
                                                </Col>
                                            </Row>
                                        </ListGroupItem>                    
                                        <ListGroupItem>                    
                                            <Row>
                                                <Col>
                                                    <p>Tax</p>
                                                </Col>
                                                <Col>
                                                    <p>{cart.taxPrice}</p>
                                                </Col>
                                            </Row>
                                        </ListGroupItem>   
                                        <ListGroupItem>  
                                            <Row>
                                                <Col>
                                                    <strong>Order total</strong>
                                                </Col>
                                                <Col>
                                                    <strong>{cart.totalPrice}dh</strong>
                                                </Col>
                                            </Row>

                                        </ListGroupItem>
                                        <ListGroupItem>
                                        <Button className='w-100' variant="primary" onClick={(e)=>{ 
                                                                                                                   
                                                                                                    handleClick()}}>Place order</Button>
                                        </ListGroupItem>
                                    </ListGroup>
                                    
                                </Card.Body>
                            </Card>
                        
            </Col>
        </Row>
        <div>
         <Toast  style={{maxWidth:'40%' ,  position: "absolute", top:'15%' , left:'60%'  ,textAlign:'center' , fontSize:'16px' , fontWeight:'400', backgroundColor:'transparent' , border:'0' , boxShadow:'none'}}  onClose={()=>{setT_state({...t_state , loading : false})}}  show={loading} delay={1000} autohide>
               <Toast.Body>
               <LoadingBox ></LoadingBox>
               </Toast.Body>
               </Toast>
               <Toast  style={{maxWidth:'40%' ,  position: "absolute", top:'18%' , left:'60%' ,zIndex: 9999 ,textAlign:'center' , fontSize:'16px' , fontWeight:'400'}} bg='warning' onClose={()=>{setT_state({...t_state  ,err : false})}}  show={err} delay={1000} autohide>
              <Toast.Body>
                  {err}
                  
               </Toast.Body>
            </Toast>
    
         </div>
    </Container>
    </>
  )
}
