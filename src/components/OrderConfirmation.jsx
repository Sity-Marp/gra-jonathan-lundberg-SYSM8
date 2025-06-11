import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // get data from PaymentForm
  const order = location.state?.order;
  const total = location.state?.total;
  const customerInfo = location.state?.customerInfo;

  // fallback if it fucks up and no data gets sent for whatver reason
  useEffect(() => {
    if (!order || !total) {
      navigate('/menu');
      return;
    }

    const fetchMenuItems = async () => {
      try {
        const response = await fetch('http://localhost:3002/menuItems');
        if (response.ok) {
          const items = await response.json();
          setMenuItems(items);
        }
      } catch (error) {
        console.error('Error fetching menu items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, [order, total, navigate]);

  const getMenuItemById = (id) => {
    return menuItems.find(item => item.id === id);
  };

  const orderNumber = order?.id ? `#${order.id.toString().padStart(4, '0')}` : '#0000';

  if (loading) {
    return (
      <div style={{
        maxWidth: '500px',
        margin: '0 auto',
        padding: '20px',
        textAlign: 'center'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: '500px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: '#f9f9f9',
      borderRadius: '12px'
    }}>
      
      {/* confirmation header */}
      <div style={{
        backgroundColor: '#e8f5e8',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '25px',
        textAlign: 'center'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          backgroundColor: '#28a745',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 15px',
          color: 'white',
          fontSize: '24px',
          fontWeight: 'bold'
        }}>
          ✓
        </div>
        <h2 style={{ 
          margin: '0 0 10px 0',
          fontSize: '24px'
        }}>
          Thanks for your order{customerInfo?.firstName ? `, ${customerInfo.firstName}` : ''}!
        </h2>
        <p style={{
          margin: '0',
          color: '#2d5a2d',
          fontWeight: 'bold'
        }}>
          Order number: {orderNumber}
        </p>
      </div>

      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        border: '2px solid #ddd',
        marginBottom: '20px'
      }}>
        <h3 style={{
          margin: '0 0 20px 0',
          fontSize: '18px',
          fontWeight: 'bold'
        }}>
          Your order
        </h3>
        
        {/* show all items from order */}
        {order?.items?.map((orderItem, index) => {
          const menuItem = getMenuItemById(orderItem.menuItemId);
          const itemTotal = menuItem ? menuItem.price * orderItem.quantity : 0;
          
        //styles each item with a border and spacing except last item
          return (
            <div key={index} style={{ 
              marginBottom: index === order.items.length - 1 ? '0' : '15px',
              paddingBottom: index === order.items.length - 1 ? '0' : '15px',
              borderBottom: index === order.items.length - 1 ? 'none' : '1px solid #eee'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: '15px'
              }}>
                <div style={{ flex: '1' }}>
                  <div style={{ 
                    fontWeight: 'bold', 
                    fontSize: '16px',
                    marginBottom: '5px',
                    lineHeight: '1.2'
                  }}>
                    {menuItem?.name || 'unknown produkt'}
                  </div>
                  <div style={{ 
                    fontSize: '14px', 
                    color: '#666',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span style={{
                      backgroundColor: '#f0f0f0',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      {orderItem.quantity}x
                    </span>
                    <span>
                      {menuItem?.price?.toFixed(2) || '0.00'} kr each
                    </span>
                  </div>
                </div>
                <div style={{ 
                  fontWeight: 'bold',
                  fontSize: '16px',
                  color: '#2d5a2d',
                  textAlign: 'right',
                  minWidth: '80px'
                }}>
                  {itemTotal.toFixed(2)} kr
                </div>
              </div>
            </div>
          );
        })}

        {/* Total */}
        <div style={{
          borderTop: '2px solid #ddd',
          paddingTop: '15px',
          marginTop: '20px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{
              fontSize: '18px',
              fontWeight: 'bold'
            }}>
              Total cost:
            </span>
            <span style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#2d5a2d'
            }}>
              {total?.toFixed(2) || '0.00'} kr
            </span>
          </div>
        </div>
      </div>

      {customerInfo && (
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          border: '2px solid #ddd',
          marginBottom: '20px'
        }}>
          <h3 style={{
            margin: '0 0 15px 0',
            fontSize: '18px',
            fontWeight: 'bold'
          }}>
            Delivery adress
          </h3>
          <p style={{ margin: '5px 0' }}>
            <strong>{customerInfo.firstName} {customerInfo.lastName}</strong>
          </p>
          <p style={{ margin: '5px 0' }}>{customerInfo.address}</p>
          <p style={{ margin: '5px 0' }}>Tel: {customerInfo.phoneNumber}</p>
          <p style={{ margin: '5px 0' }}>
            Payment method: {customerInfo.paymentMethod === 'card' ? 'Card' : 'Swish'}
          </p>
        </div>
      )}

      
        <button 
          onClick={() => navigate('/')}
          style={{
            width: '100%',
            padding: '15px',
            fontSize: '16px',
            fontWeight: 'bold',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Home Page
        </button>
        
      
    </div>
  );
};

export default OrderConfirmation;