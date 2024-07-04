import React, { useEffect, useState } from 'react'
import Container from 'react-bootstrap/esm/Container'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/esm/Button';
import { Store } from '../Store';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import CheckoutSteps from '../components/CheckoutSteps';

export default function ShippingScreen() {
    
    const {state , dispatch} = useContext(Store)
    const {cart:{shipping}} = state
    const {userinfo} = state
    console.log("hana jit " , userinfo , "dororo")
    const [fullname , setFullname] = useState(shipping.fullname  || '')
    const [adress , setAdress] = useState(shipping.adress || '')
    const [city , setCity]  = useState(shipping.city || '')
    const [postalcode , setPostalcode] = useState(shipping.postalcode || '')
    const [country , setCountry] = useState(shipping.country || '')
    const navigate = useNavigate()
    
    console.log(JSON.parse(localStorage.getItem('cart')))

    function handleSubmit(e)
        {
            
            e.preventDefault()

            dispatch({type : 'SET_SHIPPING_INFO' , payload : {fullname : fullname
                , city : city, postalcode : postalcode , country : country, adress : adress}})
              navigate('/payment') 
        }
      useEffect(()=>{
        if(!userinfo) 
            {
                navigate('/signin?redirect=/shipping')
            }
      },[navigate , userinfo])  
  return (
    <>
        <CheckoutSteps step1 step2></CheckoutSteps>
        <Container style={{textAlign:'left', maxWidth:'45rem'}}>
        <h1 className='mb-3 mt-3'>Shipping address</h1>
        <Form style={{textAlign:'left', maxWidth:'45rem'}} onSubmit={(e)=>{handleSubmit(e)}}>
             <Form.Group className="mb-3">

                <Form.Label>Full Name</Form.Label>
                <Form.Control  type="text"  defaultValue={fullname} onChange={(e)=>{setFullname(e.target.value)}}/>

             </Form.Group>
             <Form.Group className="mb-3">

                <Form.Label>Address</Form.Label>
                <Form.Control  type="text"  defaultValue={adress} onChange={(e)=>{setAdress(e.target.value)}}/>

             </Form.Group>
             <Form.Group className="mb-3" >

                <Form.Label>City</Form.Label>
                <Form.Control  type="text"  defaultValue={city} onChange={(e)=>{setCity(e.target.value)}}/>

             </Form.Group>
             <Form.Group className="mb-3">

                <Form.Label>Postal Code</Form.Label>
                <Form.Control  type="number"   defaultValue={postalcode} onChange={(e)=>{setPostalcode(e.target.value)}}/>

             </Form.Group>
             <Form.Group className="mb-3" >

                <Form.Label>Country</Form.Label>
                <Form.Control  type="text" defaultValue={country} onChange={(e)=>{setCountry(e.target.value)}}/>

             </Form.Group>

             <Button type='submit' className='mb-2 wb'>Continue</Button>
        </Form>
        
        </Container>
        </>    
  )
}
