import React, { useContext, useEffect, useReducer} from 'react'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from 'axios';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import ListGroup from 'react-bootstrap/ListGroup';
import Raiting from '../components/Raiting';
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';
import { useLocation } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/esm/Container';
import  {useState}  from 'react';
import { Store } from '../Store';


function reducer(state , action)
{
    switch(action.type)
    {
      case ('fetch_data') : {return {loading : false , product : action.payload}} 

      default : return {loading : false , err : action.payload}
    }
}

export default function ProductScreen() {
  
  let location = useLocation()
  const [state , dispatch] = useReducer(reducer , {loading:true})
  const {loading , product , err} = state
  const [selected , setSelected] = useState('red')  
  const {state:ctxState , dispatch : ctxDispatch} = useContext(Store)
  //console.log(product)
  useEffect(()=>{
    try
    {
      async function fetch_d()
        {
          

          const result = await axios.get(`${location.pathname}`)
          
          dispatch({type : 'fetch_data' , payload : result.data})
          setSelected(result.data.sub_prod[2])
        }
       fetch_d() 
       
    }catch(err)
    {
      dispatch({type : 'fetch_err' , payload : err})
    }
  } , [dispatch])
  const handleClick = async ()=>{
    const id = selected._id
    const result = await axios.get(`${location.pathname}/${id}`)
    const prod = result.data
    console.log(prod._id)
    let quantity = 1 ; 

    const exist_item = ctxState.cart.cartitems.find((x)=>(x._id === prod._id)) 
    
    exist_item && (quantity = exist_item.quantity + 1)
    console.log(quantity)
    prod.countInStock < quantity ? 
    window.alert('Sorry the product is out of stock')
    :ctxDispatch({type:'add_to_cart' , payload : {...selected , quantity}})
  }
  return (
    loading ? <LoadingBox/>
    :err ? <MessageBox variant='danger'key='primary' err={err}></MessageBox>
    :
    <div>
      <Container >
        <Row className='mxh joi' >
          
          
          
          <Col lg = '5' md = '5' sm = 'auto' className='po'>
              <img src = {selected.img} alt='main_product' className='w-100  rounded border border-dark'/>
               
          </Col>
          <Col lg = '4' md = '4' sm = 'auto'>
            
              <ListGroup className='h-100'>

                  <h1>{product.name}</h1>
                  <Card>
                  <ListGroup.Item className='h-100  d-flex align-items-center justify-content-center'><Raiting n_reviews={product.numReviews} raiting={product.rating}/></ListGroup.Item>
                  <ListGroup.Item className='h-100  d-flex align-items-center justify-content-center'>
                    <strong>Price : </strong>
                    {
                        <strong>&nbsp;{selected.price}dh</strong>
                        
                    }
                  </ListGroup.Item>
                  <ListGroup.Item className='products h-100 d-flex align-items-center justify-content-center'>
                    <Row>
                    {
                      
                      product.sub_prod.map((x)=>
                      
                        ( <Col  key={x.name}>
                        <Button variant="outline-light" onClick={()=>{setSelected(x)}}>
                        <Card>
                          <Card.Img variant="top" src = {x.img} />
                          <Card.Title><p className='clr_blue' style={{padding:'0px' , margin:'0px'}}>{x.name}</p></Card.Title>
                        </Card>
                        </Button>
                        </Col>)
                     )
                     
                    }
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item className='h-100'><span>Description : </span> <p>{product.description}</p></ListGroup.Item>
                  </Card>
              </ListGroup>
              
          </Col>
          
         
          
          <Col lg = '3' md = '3' sm = '12'>
            
              <Card>
              <ListGroup>
                  <ListGroup.Item >
                    <Row>
                      <Col>
                      <p>Price : </p>
                      </Col>
                      <Col>
                      {
                       <p>{selected.price}dh</p>
                        
                      }
                        
                      </Col>
                    </Row>
                    </ListGroup.Item>
                  
                  <ListGroup.Item>
                    <Row>
                      <Col>
                        <p>Status: </p>
                      </Col>
                      <Col>
                        <p>{selected.countInStock ? <Badge bg="success">availible</Badge>
                            :<Badge bg="danger">Unavailible</Badge>}</p>
                      </Col>
                    </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                    <Row>
                      <Col className='d-flex  flex-column '>
                      <Button variant="primary" className='m-2' onClick={handleClick}>add to card</Button>
                      </Col>
                    </Row>
                    </ListGroup.Item>
                    </ListGroup>
                  
              </Card>

              <Table bordered = '1' hover = '1'  className=' StandardTable striped bordered hover mt-5'>
              <thead >
                <tr>
                <th  colSpan={2}>nutritional profile <p><strong>large egg (63 grams)</strong></p></th>
          
               </tr>
              </thead>
      <tbody>
        
        <tr>
          <td className='double-width'>Protein</td>
          <td>6 grams</td>
          
        </tr>
        <tr>
          <td className='double-width' >Fat</td>
          <td>5 grams</td>
         
        </tr>
        <tr>
          <td className='double-width' >Carbs</td>
          <td>less than 1 gram</td>
         
        </tr>
        <tr>
          <td className='double-width' >Calories</td>
          <td>72</td>
         
        </tr>

 

       
      </tbody>
      
      </Table>
             
          </Col>
          
        </Row>
        </Container >
        
          
      
    
    </div>
  )
}
