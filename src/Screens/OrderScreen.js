import React, { useEffect } from 'react'
import {Store} from '../Store'
import { useContext } from 'react'
import Card from 'react-bootstrap/Card'
import Container from 'react-bootstrap/esm/Container';
import CardHeader from 'react-bootstrap/esm/CardHeader';
import CardBody from 'react-bootstrap/esm/CardBody';
import ListGroupItem from 'react-bootstrap/esm/ListGroupItem';
import ListGroup from 'react-bootstrap/ListGroup';
import { Link, useParams } from 'react-router-dom';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import axios from 'axios'
import Button from 'react-bootstrap/esm/Button';
import { PayPalButtons , usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { useReducer } from 'react';
import LoadingBox from '../components/LoadingBox';
import { Navigate } from "react-router-dom";
import MessageBox from '../components/MessageBox'


function reducer(state , action)
    {
        switch(action.type)
            {
                case 'order_Request':
                    console.log("147")
                    return {...state , error : false , loading : true}
                    
                case 'req_orderFailed':
                    return {...state , error : action.payload , loading : false}
                    
                case 'req_orderSuccess' :
                    console.log(123)
                    return {...state , error : false , loading : false , order : action.payload}    
                case 'Pay_request' :
                    return {...state , loadingPay : true} 
                    
                case 'Pay_success' : 
                    return {...state  , lodingPay : false , successPay : true  , errorPay : false}    
                    
                case 'Pay_failed' : 
                    return {...state , lodingPay : false , successPay : false , errorPay : true} 
                
                case 'Pay_reset' : 
                    return {...state , lodingPay : false , successPay : false}
                   default : 
                    return state;      
            }
        
    }


  
export default function OrderScreen() {

    const {state} = useContext(Store)
    const {userinfo} = state;
    const {id : orderID} = useParams()
    const [{error , loading , order , successPay , loadingPay , errorPay} , dispatch] = useReducer(reducer , {error : false , loading : true , order : null , successPay : false , lodingPay : false , errorPay : false})
    const [{isPending} , paypalDispatch]    =    usePayPalScriptReducer()
    console.log("errorPay " , errorPay)
    console.log("loading  " , loading)
    console.log("isPending " , isPending)
      if(loading == false)
        {
            console.log("uyo " , order)
        }
    if(errorPay === undefined)
        {
            console.log("hOHO")
        }
    function createOrder(data , actions)
    {
        return actions.order.create({
            purchase_units : [
                {
                    amount : {value : order.totalPrice},
                }
            ]
        }).then((orderID)=>{
            return orderID;
        })
    }  

    function onApprove(data , actions)
        {
            return actions.order.capture().then(async function (details){
                dispatch({type : 'Pay_request'})
                try 
                {
                    const {data} = await axios.put(`/api/order/${order._id}/pay` , details , 
                        {
                            headers : 
                                {
                                    authorization : `Bearer ${userinfo.token}`
                                }
                        }
                    )
                    dispatch({type : 'Pay_success' , payload : data})
                    
                }
                catch(err)
                {
                    
                    dispatch({type : 'Pay_failed' , payload : err})
                }
            })
        }    
 
        function onError(err)
            {
                
                dispatch({type : 'Pay_failed' , payload : err})
            }
    useEffect(()=>{

         
        function fetch_order() 
            {
                dispatch({type:'order_Request'})
                 async function  fetch()
                    {
                        try{
                    
                            const {data : result} = await axios.get(`/api/order/${orderID}`  , {
                               headers : 
                                   {
                                       authorization :  `Bearer ${state.userinfo.token}`
                                   }
                           })
                           console.log(result)
                           dispatch({payload : result  , type : 'req_orderSuccess'})
                   }
                   catch(err)
                   {
                       console.log("rooda")
                           dispatch({payload : err , type : 'req_orderFailed'})                   
                   }                
                               
                    }
                    fetch()
            }    
            if(!userinfo)
                {
                    Navigate('/login')
                }
            if(!order || successPay)
                {
                    console.log("waa3")
                    fetch_order();
                }    
            else
                {
                    console.log("new")
                    const loadPayPalScript = async ()=>{
                        
                        try{
                        const {data:ClientID} = await axios.get(`/api/paypal/key` , {
                            headers : {
                                authorization : `Bearer ${userinfo.token}`
                            }
                        })
                        paypalDispatch({type : 'resetOptions' , value : {
                            'client-id' : ClientID , 
                             currency : 'USD'
                        }})
                        console.log("serLoadingStatus")
                        paypalDispatch({type : 'setLoadingStatus' , value : 'pending'})
                        }
                        catch(err)
                            {
                                console.log("145" , err)
                               
                               dispatch({type : 'Pay_failed' , payload : err.message})
                            }
                    }
                    loadPayPalScript()

                    
                }
                if(successPay)
                    {
                        dispatch({type : 'Pay_reset'})
                    }

    }, [order , orderID , state , userinfo , successPay])
  return (
    <>
        {loading ? 
            <LoadingBox/>
            : error ? 
            <MessageBox variant='danger'key='primary' err={error}></MessageBox>
            : errorPay ? 
            <MessageBox variant='danger'key='primary' err={error}></MessageBox>
            :
            
            <Container lg = '12' sm='12' md='12' className='mt-4'>
        <h1 style={{maxWidth:'10px' , fontSize:'4vw'}}>Order {order._id}</h1>
            <Row className='mt-4'>
                <Col lg='8' sm='12' md='8' style={{textAlign:'left'}}>
            <Card className='mb-3'>
                <Card.Header>Shipping</Card.Header>
                <Card.Body>
                    <Card.Text>
                        <strong>Name :&nbsp;</strong>
                        {order.shippingAdress.fullname}
                    </Card.Text>

                    <Card.Text>
                        <strong>Adress :&nbsp;</strong>
                        {order.shippingAdress.adress}
                    </Card.Text>
                        
                    <Card id={(!order.isDelivered) ? 'danger' : 'success'} style={{textAlign:'center'}}>
                        <Card.Body>
                            <Card.Text><strong>{(!order.isDelivered) ? "Not Delivered" : " Delivered" }</strong></Card.Text>
                        </Card.Body>
                    </Card>
                </Card.Body>
            </Card>

            <Card className='mb-3'>
                <CardHeader>
                    Payment
                </CardHeader>

                <CardBody>
                    <Card.Text>
                         <strong>Method :&nbsp;</strong>
                         {order.paymentMethod}
                    </Card.Text>
                    <Card id={(!order.isPaid) ? 'danger' : 'success'} style={{textAlign:'center'}}>
                        <Card.Body>
                            <Card.Text><strong>{(!order.isPaid) ? "Not Paid" : "Paid" }</strong></Card.Text>
                        </Card.Body>
                    </Card>
                </CardBody>
            </Card>

            <Card className='mb-3'>
                    <Card.Header>items</Card.Header>
                    <Card.Body>
                      <ListGroup>
                        {
                        order.orderItems.map((x)=>{
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
                <Col>
                <Col lg='4' sm='12' md='4' style={{width:'100%'}}>
                        
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
                                                <p>{order.itemsPrice}dh</p>
                                            </Col>
                                        </Row>
                                    </ListGroupItem>    
                                    <ListGroupItem>  
                                        <Row>
                                            <Col>
                                                <p>Shipping</p>
                                            </Col>
                                            <Col>
                                                <p>{order.shippingPrice}</p>
                                            </Col>
                                        </Row>
                                    </ListGroupItem>                    
                                    <ListGroupItem>                    
                                        <Row>
                                            <Col>
                                                <p>Tax</p>
                                            </Col>
                                            <Col>
                                                <p>{order.taxPrice}</p>
                                            </Col>
                                        </Row>
                                    </ListGroupItem>   
                                    <ListGroupItem>  
                                        <Row>
                                            <Col>
                                                <strong>Order total</strong>
                                            </Col>
                                            <Col>
                                                <strong>{order.totalPrice}dh</strong>
                                            </Col>
                                        </Row>

                                    </ListGroupItem>
                                     
                                        {
                                            (!order.isPaid) && (
                                                <ListGroupItem>
                                                    {
                                                        isPending ? 
                                                        (
                                                            <>
                                                            <div>gg</div>
                                                            <LoadingBox></LoadingBox>
                                                            </>
                                                        ):
                                                        (
                                                            <PayPalButtons
                                                                createOrder={createOrder} 
                                                                onApprove={onApprove}
                                                                onError={onError}
                                                                
                                                            >

                                                            </PayPalButtons>
                                                            
                                                           
                                                        )
                                                    }
                                                    {loadingPay && <LoadingBox></LoadingBox>}
                                                </ListGroupItem>
                                               
                                            )
                                        }
                                    
                                </ListGroup>
                                
                            </Card.Body>
                        </Card>
                    
        </Col>
                </Col>       
                </Row> 
        </Container>
        }

        
    </>
  )
}
