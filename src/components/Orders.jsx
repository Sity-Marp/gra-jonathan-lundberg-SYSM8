import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const OrdersManagement = () => {
  const navigate = useNavigate();
  const [currentOrder, setCurrentOrder] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersResponse, menuItemsResponse] = await Promise.all([
          fetch('http://localhost:3002/orders'),
          fetch('http://localhost:3002/menuItems')
        ]);

        if (!ordersResponse.ok || !menuItemsResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        //parses the JSON responses
        const ordersData = await ordersResponse.json();
        const menuItemsData = await menuItemsResponse.json();

        const userOrder = ordersData
          .filter(order => order.status === 'pending')
          .sort((a, b) => parseInt(b.id) - parseInt(a.id))[0] || null;

        setCurrentOrder(userOrder);
        setMenuItems(menuItemsData || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  //function that gets menu item by its id
  const getMenuItem = (menuItemId) => {
    return menuItems.find(item => item.id === menuItemId.toString());
  };

  // calculate total price fororder
  const calculateOrderTotal = (orderItems) => {
    return orderItems.reduce((total, item) => {
      const menuItem = getMenuItem(item.menuItemId);
      return total + (menuItem ? menuItem.price * item.quantity : 0);
    }, 0);
  };

  const updateQuantity = async (menuItemId, newQuantity) => {
    if (newQuantity < 1 || !currentOrder) return;
    
    try {
      const updatedItems = currentOrder.items.map(item => 
        item.menuItemId === menuItemId 
          ? { ...item, quantity: newQuantity }
          : item
      );

      const newTotal = calculateOrderTotal(updatedItems);

      const updatedOrder = {
        ...currentOrder,
        items: updatedItems,
        totalPrice: newTotal
      };

      // update db
      const response = await fetch(`http://localhost:3002/orders/${currentOrder.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedOrder)
      });

      if (!response.ok) throw new Error('Failed to update order');

      setCurrentOrder(updatedOrder);
    } catch (err) {
      console.error('Error updating quantity:', err);
      alert('Failed to update quantity. Please try again.');
    }
  };

  const removeItem = async (menuItemId) => {
    if (!currentOrder) return;

    try {
      const updatedItems = currentOrder.items.filter(item => item.menuItemId !== menuItemId);

      if (updatedItems.length === 0) {
        const response = await fetch(`http://localhost:3002/orders/${currentOrder.id}`, {
          method: 'DELETE'
        });

        if (!response.ok) throw new Error('Failed to delete order');

        setCurrentOrder(null);
      } else {
        const newTotal = calculateOrderTotal(updatedItems);
        const updatedOrder = {
          ...currentOrder,
          items: updatedItems,
          totalPrice: newTotal
        };

        const response = await fetch(`http://localhost:3002/orders/${currentOrder.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedOrder)
        });

        if (!response.ok) throw new Error('Failed to update order');
        
        setCurrentOrder(updatedOrder);
      }
    } catch (err) {
      console.error('Error removing item:', err);
      alert('Failed to remove item. Please try again.');
    }
  };

const goToPayment = () => {
  navigate('/payment', {
    state: {
      order: currentOrder,
      total: currentOrder.totalPrice
    }
  });
};

  const backToMenu = () => {
    navigate('/menu');
  };

  if (loading) {
    return <div style={{ padding: '20px' }}>Loading your order...</div>;
  }

  if (error) {
    return <div style={{ padding: '20px', color: 'red' }}>Error: {error}</div>;
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Your Order</h1>
      
      {!currentOrder ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>You don't have any active orders.</p>
          <button
            onClick={backToMenu}
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Go to Menu
          </button>
        </div>
      ) : (
        <div>
          <div style={{ border: '1px solid #ccc', padding: '15px', margin: '10px 0' }}>
            
            {currentOrder.items.map((item, index) => {
              const menuItem = getMenuItem(item.menuItemId);
              if (!menuItem) return null;

              return (
                <div key={`${currentOrder.id}-${item.menuItemId}-${index}`} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  padding: '10px 0',
                  borderBottom: '1px solid #eee'
                }}>
                  <div>
                    <strong>{menuItem.name}</strong>
                    <br />
                    {menuItem.price.toFixed(2)} kr each
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button 
                      onClick={() => updateQuantity(item.menuItemId, item.quantity - 1)}
                      disabled={item.quantity === 1}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.menuItemId, item.quantity + 1)}
                    >
                      +
                    </button>
                    
                    <span style={{ marginLeft: '20px' }}>
                      {(menuItem.price * item.quantity).toFixed(2)} kr
                    </span>
                    
                    <button 
                      onClick={() => removeItem(item.menuItemId)}
                      style={{ marginLeft: '10px', color: 'red' }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
            
            <div style={{ marginTop: '15px', fontWeight: 'bold', fontSize: '18px' }}>
              Total: {currentOrder.totalPrice.toFixed(2)} kr
            </div>

            <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
              <button
                onClick={backToMenu}
                style={{
                  padding: '12px 20px',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                Continue Shopping
              </button>
              
              <button
                onClick={goToPayment}
                style={{
                  padding: '12px 20px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: 'bold'
                }}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersManagement;