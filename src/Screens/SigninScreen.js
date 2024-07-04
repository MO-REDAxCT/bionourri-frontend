import React, { useEffect } from 'react'
import Container from 'react-bootstrap/esm/Container'
import Form from 'react-bootstrap/Form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Button from 'react-bootstrap/esm/Button';
import  {useState}  from 'react';
import axios from 'axios'
import { Store } from '../Store';
import { useContext } from 'react';
import Toast from 'react-bootstrap/Toast';
import LoadingBox from '../components/LoadingBox';

export default function SigninScreen() {

  const [email , setEmail] = useState('')
  const [password , setPassword] = useState('')
  const [t_state , setT_state] = useState({err : '' , loading : ''})
  const {err , loading} = t_state
  const Navigate = useNavigate()
  const {search} = useLocation()
  const redirectUrl = new URLSearchParams(search).get('redirect')
  const redirect = redirectUrl ? redirectUrl : '/'
  const {state , dispatch} = useContext(Store)
  const u_name = state.userinfo ? state.userinfo.name : ''
  
  async function handleSubmit(e)
    {
      
      e.preventDefault()
      let result
      
    
      try
      {
        result =  await axios.post('/api/users/signin' , {email : email , password : password})
        console.log(500)
      }
      catch(error)
      {
        result = error.response
        console.log("backend")
      }
        
      console.log(typeof(result.data))
      console.log(result)
      if(result.data.message === "Internal server error")
        {
          console.log("hola machi jay")
          
          setT_state({err:result.data.message , loading:false})
          
           
        }
      else
        {
          dispatch({type:'USER_SIGNIN' , payload:result.data})  
               
          Navigate(`${redirect}`)
          
        }
        
    }
   useEffect(()=>{if(u_name)
                    Navigate(`${redirect}` )})
  return (
   
    
    <Container className='margin ' style={{textAlign:'left', maxWidth:'45rem'}}>
        <h1 className='mb-3'>Sign in</h1>
         <Form  style={{textAlign:'left', maxWidth:'45rem'}} onSubmit={(e)=>{handleSubmit(e)}
                                                                            }>
            <Form.Group className='margin'>
                <Form.Label>Email</Form.Label>
                <Form.Control style={{padding: '12px 20px' }} type='email' placeholder='Enter email' onChange={(e)=>{setEmail(e.target.value)}}/>
            </Form.Group>

            <Form.Group className='margin'>
                <Form.Label>Password</Form.Label>
                <Form.Control style={{padding: '12px 20px'}}type='password' placeholder='Enter password' onChange={(e)=>{setPassword(e.target.value)}}/>
            </Form.Group>
            <Button type='submit' className='mb-2 wb' onClick={()=>{ setT_state({err:'' , loading:true})}}>signin</Button>
            <div className='mb-2'><Form.Text><strong className='ft_1'>New customer ? </strong><Link to={`/signup?redirect=${redirect}`}>Create your account</Link></Form.Text></div>
            <div><Form.Text ><strong className='ft_1'>Forget password ? </strong><Link to={`/signup?redirect=${redirect}`}>Reset password</Link></Form.Text></div>
         </Form>
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
