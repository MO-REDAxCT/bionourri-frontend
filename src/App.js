import logo from './logo.svg';
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import NavDropdown from 'react-bootstrap/NavDropdown';
import Container from 'react-bootstrap/Container'
import './App.css';
import { Link, Route, Router, Routes } from 'react-router-dom';
import HomeScreen from './Screens/HomeScreen';
import ProductScreen from './Screens/ProductScreen';
import { useContext } from 'react';
import {Store} from './Store'
import Badge from 'react-bootstrap/esm/Badge';
import CartScreen from './Screens/CartScreen';
import SigninScreen from './Screens/SigninScreen';
import ShippingScreen from './Screens/ShippingScreen';
import SignupScreen from './Screens/SignupScreen';
import PaymentScreen from './Screens/PaymentScreen';
import PlaceOrderScreen from './Screens/PlaceOrderScreen';
import OrderScreen from './Screens/OrderScreen';
import OrderHistoryScreen from './Screens/orderHistoryScreen';
import UserProfileScreen from './Screens/UserProfileScreen';

function App() {

  const {state , dispatch} = useContext(Store)
  function Cart_itmes_l(total , item)
    {
      return total + item.quantity
    }
  
    console.log(state.cart.cartitems)
    console.log("Hola")
    console.log(state.userinfo)
    const u_name = state.userinfo ? state.userinfo.name : ''
    
  return (
    
    
    <div className="App" >
      <header>
         <Navbar className='bg-green' data-bs-theme="dark">
            <Container >
              <Link  className='nav-link' to={'/'}>
                <Navbar.Brand href='#' style={{fontSize : '23px' , color:'white'}}>BioNourri</Navbar.Brand>
              </Link>
                
               <Nav>
                  <Link className=' nav-link pb-1' to='/cart'>
                  <span style={{fontSize : '23px' , color:'white'}}>Cart&nbsp;</span>
                      {
                        
                        state.cart.cartitems.length > 0 && 
                        <Badge  bg="primary">{state.cart.cartitems.reduce(Cart_itmes_l , 0)}</Badge>
                        
                      }
                  </Link>
                  {u_name ? 
                  <NavDropdown align='end' title={u_name} style={{fontSize : '20px' , color:'white' , textAlign:'center' }} >
                    <NavDropdown.Item href=''>User Profile</NavDropdown.Item>
                    <NavDropdown.Item href=''>Order History</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href='' onClick={()=>{dispatch({type:'USER_SIGNOUT'})}}>Sign out</NavDropdown.Item>  
                  </NavDropdown>
                    : <Link  className='nav-link' to={'/signin'}>
                      <span style={{fontSize : '23px' , color:'white'}}>Sign in</span>
                    </Link>
                  }
                </Nav> 
            </Container>
         </Navbar>

      </header>

      <main>
          <Routes>
            <Route path="/" element={<HomeScreen/> } /> 
            <Route path='/cart' element={<CartScreen/>}/>
             <Route path='/products/:slug' element = {<ProductScreen/>}></Route>
             <Route path='/signin' element = {<SigninScreen/>}></Route>
             <Route path='/shipping' element = {<ShippingScreen/>}></Route>
             <Route path='/signup' element = {<SignupScreen/>}></Route>
             <Route path='/payment' element = {<PaymentScreen/>}></Route>
             <Route path='/placeorder' element = {<PlaceOrderScreen/>}></Route>
             <Route path= '/order/:id' element = {<OrderScreen/>}></Route>
             <Route path= '/orderhistory' element = {<OrderHistoryScreen/>}></Route>
             <Route path= '/userprofile' element = {<UserProfileScreen/>}></Route>
          </Routes>
      </main>
    </div>
   

    
   
  );
}

export default App;
