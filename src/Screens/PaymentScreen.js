import React, { useEffect, useState } from 'react'
import Form  from 'react-bootstrap/Form';
import Container from 'react-bootstrap/esm/Container';
import CheckoutSteps from '../components/CheckoutSteps';
import Button from 'react-bootstrap/esm/Button';
import { Store } from '../Store';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';

export default function PaymentScreen() {
    
    const {state , dispatch} = useContext(Store)
    const {cart} = state
    const shipping = cart.shipping
    const [PaymentMethod , setPaymentMethod ] = useState(cart.paymentMethod)
    const Navigate = useNavigate()

   function handleSubmit(e)
    {
        e.preventDefault()
        console.log('la taroute' , PaymentMethod)
        dispatch({type:'SAVE_PAYMENT_METHOD'  , payload : PaymentMethod})
        console.log('stroke' , state.cart.paymentMethod)
        Navigate('/placeorder')
    }   
    
    useEffect(()=>{if(!shipping.fullname)
                    {
                        console.log('d' , shipping)
                    Navigate('/shipping')} 
                } , [shipping , Navigate])
                   
  return (
    <>
    <CheckoutSteps  step1 step2 step3></CheckoutSteps>
    <Container className='mt-4'style={{
         maxWidth:'fit-content',
         marginInline:'auto'
    }}>
    <h1 className='mb-3'>Payment Method</h1>
    <Form  style={{textAlign:'left', maxWidth:'45rem'}} onSubmit={(e)=>{handleSubmit(e)}}>

        <Form.Check
            label="PayPal"
            name="group1"
            type='radio'
            id='inline-1'
            value='PayPal'
            checked={PaymentMethod === 'PayPal'}
            onChange={(e)=>{setPaymentMethod(e.target.value)}}
            />
          
          <Form.Check
            label="Stripe"
            name="group1"
            type='radio'
            id='inline-2'
            value='Stripe'
            className='mt-3'
            checked={PaymentMethod === 'Stripe'}
            onChange={(e)=>{setPaymentMethod(e.target.value)}}
            />
           <Button type='submit' className='mt-3 wb'>Continue</Button>
     </Form>
     </Container>
     </>
  )
}
