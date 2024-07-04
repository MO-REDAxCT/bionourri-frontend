import React, {createContext, useReducer } from 'react'
import { json } from 'react-router-dom';

function reducer(state , action)
{
  let cartitems = state.cart.cartitems
  let i = 0 ;
    switch(action.type)
     {
        case 'add_to_cart':
          {
          const exist_item = state.cart.cartitems.find((x)=>(x._id === action.payload._id))
          
          if(exist_item )
          {
           cartitems = cartitems.map((x)=>{if(x._id === exist_item._id) {return action.payload } else{ return x}})
            localStorage.setItem('cart' , JSON.stringify({...state.cart , cartitems}))
           return {...state , cart : {...state.cart , cartitems}}
          }
          
          else
          {
            localStorage.setItem('cart' , JSON.stringify('cart' , {...state.cart , cartitems : [...state.cart.cartitems , action.payload]}))
            return {...state , cart : {...state.cart , cartitems : [...state.cart.cartitems , action.payload]}}
           
          }
          
        }

     case 'dlt_from_cart':
        {
           const item =  state.cart.cartitems.find((x)=>{
                  if(action.payload._id === x._id) 
                  {
                    return true ;
                  }
                  else
                  {
                    
                    i++;
                  }
          })
          console.log(i)

          state.cart.cartitems.splice(i , 1)
          console.log(state.cart.cartitems)
          const cartitems = state.cart.cartitems
          localStorage.setItem('cart' , {...state.cart , cartitems})
          return {...state , cart : {...state.cart , cartitems}}
          break
        }
     case 'USER_SIGNIN' : 
      {
        localStorage.setItem('userinfo' , JSON.stringify(action.payload))    
        return {...state , userinfo : action.payload}
       
      }  
      case 'USER_SIGNOUT' : 
      localStorage.removeItem('userinfo')  
      localStorage.removeItem('cart')  
      return {...state , userinfo : '' , cart:{cartitems:[] , shipping : {} , paymentMethod:''}}

      case 'SET_SHIPPING_INFO' :
      console.log(JSON.stringify({...state.cart , shipping:{...action.payload}}))  
      localStorage.setItem('cart' , JSON.stringify({...state.cart , shipping:{...action.payload}}))
      console.log(JSON.parse(localStorage.getItem('cart')))
      console.log('l hilola')  
      return {...state , cart : {...state.cart , shipping:{...action.payload}}}

      
      case 'SAVE_PAYMENT_METHOD' :
        localStorage.setItem('cart' , JSON.stringify({...state.cart , paymentMethod:action.payload}))
        return {...state , cart : {...state.cart , paymentMethod:action.payload}}

      case 'CART_CLEAR' : 
      localStorage.setItem('cart' , JSON.stringify({...JSON.parse(localStorage.getItem('cart')) , cartitems:[]}))
       return {...state , cart : {...state.cart , cartitems:[]}}

      case 'PLACE_ORDER' :
        localStorage.setItem('cart' ,JSON.stringify({...state.cart , order:action.payload}))
        return {...state , cart : {...state.cart , order:action.payload}}
     default : return state
}
}

export const Store = createContext({})

const initialState = {
    userinfo : localStorage.getItem('userinfo') ? 
     JSON.parse(localStorage.getItem('userinfo'))
     :'' , 
    cart : localStorage.getItem('cart') ? 
             JSON.parse(localStorage.getItem('cart'))
             :{cartitems:[] , shipping : {} , paymentMethod:''}
}
export  function StoreProvider({children}) {

    const [state , dispatch] = useReducer(reducer , initialState)
    const value = {state , dispatch}
  return (
    
    <Store.Provider value={value}>{children}</Store.Provider>
  )
}


