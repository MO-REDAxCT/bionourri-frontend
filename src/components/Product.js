import React, { useContext } from 'react'
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Raiting from './Raiting';
import { Link } from 'react-router-dom';
import { Store } from '../Store';

export default function Product({x}) {
  const {dispatch} = useContext(Store)
  
  return (
    <div key={x.slug} className='product'>
            <Card style={{ width: '18rem'  , height : '100%'}}>
            <Link to={`products/${x.slug}`}><Card.Img className='mb-auto' variant="top" src={x.image} /></Link>
              <Card.Body className='d-flex  flex-column ' style={{padding: '2px'}}>
                    <Link to={`products/${x.slug}`} className='mb-1'><Card.Title className='mb-auto'>{x.name}</Card.Title></Link>
                    <Card.Text className='mb-auto'>
                       <Raiting n_reviews={x.numReviews} raiting={x.rating}></Raiting>
                    </Card.Text>
                    <Card.Text className='mb-auto'>
                       {x.description}
                    </Card.Text>
                    <Card.Text  className='mb-auto'>
                       <strong>{x.price } dh</strong>
                    </Card.Text>
              <Link to={`products/${x.slug}`}>
               <Button variant="primary" className='m-2'>add to cart</Button>
              </Link>
              </Card.Body>
            </Card>
          </div>
  )
}
