import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Menu from './components/Menu';
import Navbar from './components/Navbar';
import OrdersManagement from './components/Orders';
import PaymentForm from './components/PaymentForm';
import OrderConfirmation from './components/OrderConfirmation';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/orders" element={<OrdersManagement />} />
          <Route path="/payment" element={<PaymentForm />} />
          <Route path="/OrderConfirmation" element={<OrderConfirmation />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
