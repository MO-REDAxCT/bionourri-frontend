import React from 'react'

export default function Raiting({raiting , n_reviews}) {
  return (
    <>
    {(raiting >=0.5) ? 
    (raiting < 1) ? <i className='fas fa-star-half-alt'></i> 
    :<i className='fas fa-star'></i>
    : <i className='far fa-star'></i>}

    {(raiting >=1.5) ? 
    (raiting < 2) ? <i className='fas fa-star-half-alt'></i> 
    :<i className='fas fa-star'></i>
    : <i className='far fa-star'></i>}

    {(raiting >=2.5) ? 
    (raiting < 3) ? <i className='fas fa-star-half-alt'></i> 
    :<i className='fas fa-star'></i>
    : <i className='far fa-star'></i>}

    {(raiting >=3.5) ? 
    (raiting < 4) ? <i className='fas fa-star-half-alt'></i> 
    :<i className='fas fa-star'></i>
    : <i className='far fa-star'></i>}  

    {(raiting >=4.5) ? 
    (raiting < 5) ? <i className='fas fa-star-half-alt'></i> 
    :<i className='fas fa-star'></i>
    : <i className='far fa-star'></i>}

                <span>{n_reviews}  reviews</span>
                
                </>
  )
  
}
