import React, { useContext, useEffect } from 'react'
import Container from 'react-bootstrap/esm/Container'
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import { useReducer} from 'react';
import { Store } from '../Store';
import axios from 'axios';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import Button from 'react-bootstrap/esm/Button';
import { Link } from 'react-router-dom';

function reducer(state , action)
    {
        switch(action.type)
            {
                case 'ORDERS_REQ' : 
                    return {...state , loading : true}    
                    break;

                case 'ORDERS_ERR' : 
                    console.log("err inside reducer " , action.payload)
                    return {...state , err : action.payload , loading : false}    
                    break;

                case 'ORDERS_SUCC'    :
                    console.log("order succ inside reducccer" )
                    return {...state , err : false , loading : false , orders : action.payload}
                    break;
                default:
                    return state    
            }

    }
export default function OrderHistoryScreen() {

    const [{err , loading , orders} , dispatch] = useReducer(reducer , {err : false , loading : true})
    const {state} = useContext(Store)
    const {userinfo} = state
    console.log('loding' , loading)
    useEffect(()=>{
        dispatch({type : 'ORDERS_REQ'})

        async function fetch_orders()
            {
                try{
                    const result = await axios.get(`/api/order/all`  , {
                        headers : 
                            {
                                authorization :  `Bearer ${userinfo.token}`
                            }
                    })          
                    console.log("dispatch succ")
                    console.log("result " , result)
                    dispatch({type : 'ORDERS_SUCC' , payload : result.data})
                }
                catch(err){
                        console.log("err inside catch" , err.message)
                        dispatch({type : 'ORDERS_ERR' , payload : err})
                }
            }

            fetch_orders()
    } , [userinfo.token])
  return (
    
    loading ? 
       <LoadingBox></LoadingBox>

    : err ? 
        <Container>
        <MessageBox variant='danger'key='primary' err={err}></MessageBox>
        </Container>
    :      
    
        <Container>
            <h1>Order History</h1>

            <Row  className='mt-4 mb-1 pb-2  sm-fontSize'  id='border_order_h'>
                <Col className='col-4'>
                    <strong>ID</strong>
                </Col>
                <Col >
                    <strong>DATE</strong>
                </Col>
                <Col>
                    <strong>TOTAL</strong>
                </Col>
                <Col>
                    <strong>DELIVRED</strong>
                </Col>
                <Col>
                    <strong>PAID</strong>
                </Col>
                <Col>
                    <strong>ACTIONS</strong>
                </Col>
            </Row>
            {
                orders.map((x)=>{
                    
                return <Row className='mt-1  sm-fontSize' style={{alignItems : 'center'}} id='border_order_h'>
                <Col className='col-4'>
                    {x._id}
                </Col>
                <Col >
                    {new Date(x.createdAt).toLocaleDateString()}
                </Col>
                <Col>
                    {x.totalPrice}
                </Col>
                <Col>
                    
                    {x.isDelivered ? "Yes" : "No"}
                    
                </Col>
                <Col>
                    {x.isPaid ? 'Yes' : 'No'}
                </Col>
                <Col>
                <Link to={`/order/${x._id}`} mg-b='1'>
               <Button variant="primary" className='m-2' id='sm-btn-fontSize'>Details</Button>
              </Link>    
                </Col>
            </Row>
                })
            }
            
        </Container>
        
)
}
