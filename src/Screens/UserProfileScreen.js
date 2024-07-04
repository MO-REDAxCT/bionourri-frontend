import React, { useContext, useReducer } from 'react'
import { Store } from '../Store'
import Container from 'react-bootstrap/esm/Container'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useState } from 'react';
import axios from 'axios';
import Toast from 'react-bootstrap/Toast';  
import LoadingBox from '../components/LoadingBox';


export default function UserProfileScreen() {
   
    const {state , dispatch} = useContext(Store)
    const {userinfo} = state
    const [{loading , err} , setState] = useState({loading : false , err : false})
    const [name , setName] = useState('')
    const [email , setEmail] = useState('')
    const [password , setPassword] = useState('')
    const [confirmPassword , setConfirmPassword] = useState('')

    console.log("the error is " , err)
    console.log("the loading is " , loading)
    function change_UserInfo()
    {
        console.log(state.userinfo.token)
        setState({loading : true , err : false})  
        
        async function put_info()
            {
                console.log("confirm pass" , confirmPassword)
                console.log("pass" , password)
                if(confirmPassword !== password)
                    {
                        console.log("doesn't match")
                        setState({loading:false , err : {message:"confirm password incorrect"}})
                    }
                else
                    {    
                try{
                    await axios.put('/api/users/update' , {name : name , email : email , password : password} , {
                        headers:{
                            authorization : `Bearer ${state.userinfo.token}` , 
                        }
                    } )

                    dispatch({type:'USER_SIGNOUT'})

                    const sign_result =  await axios.post('/api/users/signin' , {email : email , password : password})
                    dispatch({type:'USER_SIGNIN' , payload:sign_result.data}) 
                }
            
            catch(err)
                {
                    console.log("err message " , err.message )

                    setState({loading : false , err : err})
                }
    }
    
    }
    put_info()
}
  return (
     
        
        <Container style={{textAlign:'left' , maxWidth:'45rem'}}>
            <h1>User Profile</h1>   
            <Form className='mt-4' onSubmit={(e)=>{
                e.preventDefault()
                change_UserInfo()}}>
                <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type='text' placeholder='enter new name' onChange={(e)=>{
                        setName(e.target.value)
                    }}/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Email Adress</Form.Label>
                    <Form.Control type='email' placeholder='enter new email' onChange={(e)=>{
                        setEmail(e.target.value)
                    }}/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type='password' placeholder='enter new password' onChange={(e)=>{setPassword(e.target.value)}}/>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control type='password' placeholder='confirm new password' onChange={(e)=>{setConfirmPassword(e.target.value)}}/>
                </Form.Group>   
                <Button type='submit' className='mb-2 wb'>Update</Button>
            </Form>
                    
            <Toast  style={{maxWidth:'40%' ,  position: "absolute", top:'15%' , left:'60%'  ,textAlign:'center' , fontSize:'16px' , fontWeight:'400', backgroundColor:'transparent' , border:'0' , boxShadow:'none'}}  onClose={()=>{setState({err: false ,  loading : false})}}  show={loading} delay={1000} autohide>
               <Toast.Body>
               <LoadingBox ></LoadingBox>
               </Toast.Body>
               </Toast>
                
               <Toast  style={{maxWidth:'40%' ,  position: "absolute", top:'15%' , left:'60%' ,zIndex: 9999 ,textAlign:'center' , fontSize:'16px' , fontWeight:'400'}} bg='warning' onClose={()=>{setState({loading:false  ,err : false})}}  show={err} delay={1000} autohide>
               <Toast.Body>
                  {err.message}
               </Toast.Body>
            </Toast> 

        </Container>
     
    
  )
}
