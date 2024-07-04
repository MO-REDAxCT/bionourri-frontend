import React , { useEffect, useState } from 'react'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/esm/Button';
import Container from 'react-bootstrap/esm/Container';
import { Link } from 'react-router-dom';
import Toast from 'react-bootstrap/Toast';
import LoadingBox from '../components/LoadingBox';
import axios from 'axios'
import { useNavigate , useLocation} from 'react-router-dom';
import { useContext } from 'react';
import { Store } from '../Store';


export default function SignupScreen() {

    
   const [name , setName] = useState('')
   const [email , setEmail] = useState('')
   const [password , setPassword]  = useState('')
   const [confirmPassword , setConPassword] = useState('')
   const [t_state , setT_state] = useState({err : '' , loading : ''})
   const {err , loading} = t_state
   const Navigate = useNavigate()
   const {search} = useLocation()
   const redirectUrl = new URLSearchParams(search).get('redirect')
   const redirect = redirectUrl ? redirectUrl : '/'
   const {state , dispatch} = useContext(Store)

   async function handleSubmit(e)
        {
            e.preventDefault()
            let result
      
    if(password === confirmPassword)
      {
         try
         {
           result =  await axios.post('/api/users/signup' , {name : name , email : email , password : password})
           console.log(500)
         }
         catch(error)
         {
           result = error.response
           
         }
           
         console.log(typeof(result.data))
         if(`${typeof(result.data)}` === 'object')
           {
             
               dispatch({type:'USER_SIGNIN' , payload:result.data})  
                  
               Navigate(`${redirect}`)
           }
         else
           {
             console.log("hola machi jay")
             
             setT_state({err:result.data , loading:false})
             
           }
      }
      
      else
         {
            setT_state({err:'The Confirm password does not match' , loading:false})
         }
        
        }
  return (
    <Container style={{textAlign:'left', maxWidth:'45rem'}}>
        <h1 className='mb-3 mt-3'>Shipping address</h1>
        <Form style={{textAlign:'left', maxWidth:'45rem'}} onSubmit={(e)=>{handleSubmit(e)}}>
             <Form.Group className="mb-3">

                <Form.Label>Name</Form.Label>
                <Form.Control  type="text"  defaultValue={name} onChange={(e)=>{setName(e.target.value)}}/>

             </Form.Group>
             <Form.Group className="mb-3">

                <Form.Label>Email</Form.Label>
                <Form.Control  type="text"  defaultValue={email} onChange={(e)=>{setEmail(e.target.value)}}/>

             </Form.Group>
             <Form.Group className="mb-3" >

                <Form.Label>Password</Form.Label>
                <Form.Control  type="text"  defaultValue={password} onChange={(e)=>{setPassword(e.target.value)}}/>

             </Form.Group>
             <Form.Group className="mb-3">

                <Form.Label>Confirm Password</Form.Label>
                <Form.Control  type="text"   defaultValue={confirmPassword} onChange={(e)=>{setConPassword(e.target.value)}}/>

             </Form.Group>
             <Button type='submit' className='mb-2 wb' onClick={()=>{ setT_state({err:'' , loading:true})}}>Continue</Button>
        </Form>
        <Form.Text><p className='ft_2'>Already have an account ? <Link to={`/signin}`}>      Sign in</Link></p></Form.Text>

        <div>
         <Toast  style={{maxWidth:'40%' ,  position: "absolute", top:'15%' , left:'60%'  ,textAlign:'center' , fontSize:'16px' , fontWeight:'400', backgroundColor:'transparent' , border:'0' , boxShadow:'none'}}  onClose={()=>{setT_state({...t_state , loading : false})}}  show={loading} delay={10000} autohide>
               <Toast.Body>
               <LoadingBox ></LoadingBox>
               </Toast.Body>
               </Toast>
          <Toast  style={{maxWidth:'40%' ,  position: "absolute", top:'15%' , left:'60%' ,zIndex: 9999 ,textAlign:'center' , fontSize:'16px' , fontWeight:'400'}} bg='warning' onClose={()=>{setT_state({...t_state  ,err : false})}}  show={err} delay={1000} autohide>
               <Toast.Body>
                  {err}
               </Toast.Body>
            </Toast>
    
         </div>
        </Container>
  )
}
