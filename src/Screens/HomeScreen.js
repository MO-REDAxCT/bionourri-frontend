import React, { useEffect, useReducer } from 'react'
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import axios from 'axios'
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import Product from '../components/Product';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function reducer(state , action)
{
    switch(action.type)
    {
        case 'loading' : return {...state , loading:true}

        case 'error' : return {...state , loading:false , err:action.payload}

        case  'products' : return {loading : false , err : false , products : action.payload}

        default : return state
    }
}
export default function HomeScreen() {
    const [state , dispatch]    =   useReducer(reducer , {products : [],  loading : true , err:false})
    const { err , products} = state
    const {loading} = state
    useEffect(()=>{
        dispatch({type : 'loading'})
            
        async function fetch_product(){
            try
            {
                const result = await axios.get('/products')
                
                dispatch({type:'products' , payload : result.data})
            }catch(err)
            {
                dispatch({type:'error' , payload : err})
            }
            
            
        }
        fetch_product()
    } , [dispatch])
  return (
    <div><h1>Nos produits</h1>
    {loading ? 
            <LoadingBox></LoadingBox>
        : err ? 
            <MessageBox variant='danger'key='primary' err={err}></MessageBox>
        :        
    <div className='products mb' >
      
      {
        products.map((x)=>(
         
          <Product key={x.name} x = {x}></Product>
          
        ))
      }
     
      
    </div>}</div>
    
  )
}




