import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

function Menu() {
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // fetch menu items & current pending order
    // this is a bit confusing still, should read up and not be dumb.
    const fetchData = async () => {
      try {
        const menuResponse = await fetch('http://localhost:3002/menuItems');
        if (!menuResponse.ok) throw new Error('Failed to fetch menu items');
        const menuData = await menuResponse.json();
        setMenuItems(menuData);
        setFilteredItems(menuData);

        // get unique categories
        const uniqueCategories = [...new Set(menuData.map(item => item.category))];
        setCategories(uniqueCategories);

        const ordersResponse = await fetch('http://localhost:3002/orders');
        if (ordersResponse.ok) {
          const orders = await ordersResponse.json();
          const pendingOrder = orders
            .filter(order => order.status === 'pending')
            .sort((a, b) => parseInt(b.id) - parseInt(a.id))[0] || null;
          setCurrentOrder(pendingOrder);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // filter items when category changes
  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredItems(menuItems);
    } else {
      setFilteredItems(menuItems.filter(item => item.category === selectedCategory));
    }
  }, [selectedCategory, menuItems]);

  // function to add item to cart/order
  const addToCart = async (menuItem) => {
    try {
      if (!currentOrder) {
        const newOrder = {
          items: [{ menuItemId: menuItem.id, quantity: 1 }],
          totalPrice: menuItem.price,
          status: 'pending'
        };

        const response = await fetch('http://localhost:3002/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newOrder)
        });

        if (!response.ok) throw new Error('Failed to create order');
        
        const createdOrder = await response.json();
        setCurrentOrder(createdOrder);
        console.log(`Created new order and added ${menuItem.name}`);
        
      } else {
        const existingItemIndex = currentOrder.items.findIndex(
          item => item.menuItemId === menuItem.id
        );

        let updatedItems;
        if (existingItemIndex >= 0) {
          // if item already exists, increase its quantity
          updatedItems = currentOrder.items.map((item, index) =>
            index === existingItemIndex 
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          //add new item to existing order
          updatedItems = [...currentOrder.items, { menuItemId: menuItem.id, quantity: 1 }];
        }

        // calculate the total price again, think of another(better?) way to do this, 
        // recalculating whole order price every time is not very efficient
        const newTotalPrice = updatedItems.reduce((total, item) => {
          const itemData = menuItems.find(mi => mi.id === item.menuItemId);
          return total + (itemData ? itemData.price * item.quantity : 0);
        }, 0);

        const updatedOrder = {
          ...currentOrder,
          items: updatedItems,
          totalPrice: newTotalPrice
        };

        const response = await fetch(`http://localhost:3002/orders/${currentOrder.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedOrder)
        });

        if (!response.ok) throw new Error('Failed to update order');
        
        const savedOrder = await response.json();
        setCurrentOrder(savedOrder);
        console.log(`Added ${menuItem.name} to existing order`);
      }
    } catch (error) {
      console.error('Error adding item to cart:', error);
      alert('Failed to add item to cart. Please try again.');
    }
  };

  const goHome = () => navigate('/');

  return (
    <div style={{ padding: '20px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <h1 style={{ textAlign: 'center' }}>Menu Page</h1>
      
      {currentOrder && (
        <div style={{
          backgroundColor: '#d4edda',
          border: '1px solid #c3e6cb',
          borderRadius: '5px',
          padding: '10px',
          margin: '20px auto',
          maxWidth: '1200px',
          textAlign: 'center'
        }}>
          {/* strong tells stuff like screen readers that something is important
          probably makes for good ux then? */}
          <strong>Current Order: </strong>
          {currentOrder.items.reduce((total, item) => total + item.quantity, 0)} items - 
          Total: {currentOrder.totalPrice.toFixed(2)} kr
          <button
            onClick={() => navigate('/orders')}
            style={{
              marginLeft: '10px',
              padding: '5px 10px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '3px',
              cursor: 'pointer'
            }}
          >
            View Order
          </button>
        </div>
      )}

      {/* category filter */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '40px',
        margin: '30px 0',
        flexWrap: 'wrap',
        borderBottom: '1px solid #e0e0e0',
        paddingBottom: '0'
      }}>
        <button
          onClick={() => setSelectedCategory('all')}
          style={{
            padding: '12px 16px',
            backgroundColor: 'transparent',
            color: selectedCategory === 'all' ? '#333' : '#888',
            border: 'none',
            borderBottom: selectedCategory === 'all' ? '3px solid #333' : '3px solid transparent',
            cursor: 'pointer',
            textTransform: 'capitalize',
            fontSize: '16px',
            fontWeight: selectedCategory === 'all' ? '600' : '400',
            transition: 'all 0.2s ease'
          }}
        >
          All ({menuItems.length})
        </button>
        {categories.map(category => {
          const categoryCount = menuItems.filter(item => item.category === category).length;
          return (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              style={{
                padding: '12px 16px',
                backgroundColor: 'transparent',
                color: selectedCategory === category ? '#333' : '#888',
                border: 'none',
                borderBottom: selectedCategory === category ? '3px solid #333' : '3px solid transparent',
                cursor: 'pointer',
                textTransform: 'capitalize',
                fontSize: '16px',
                fontWeight: selectedCategory === category ? '600' : '400',
                transition: 'all 0.2s ease'
              }}
            >
              {category} ({categoryCount})
            </button>
          );
        })}
      </div>
      
      {/* menu items grid
      1fr means 1 fraction of the available space */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px',
        margin: '20px 0',
        maxWidth: '1200px',
        marginLeft: 'auto',
        marginRight: 'auto'
      }}>
        {filteredItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            {menuItems.length === 0 ? 'Loading menu...' : 'No items found in this category'}
          </div>
        ) : (
          filteredItems.map(item => (
            <div
              key={item.id}
              style={{
                backgroundColor: '#6b6b6b',
                color: 'white',
                borderRadius: '12px',
                padding: '20px',
                position: 'relative',
                minHeight: '140px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              {/* category thingie at top right (badge?) */}
              {item.category && (
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '10px',
                  textTransform: 'uppercase',
                  fontWeight: 'bold'
                }}>
                  {item.category}
                </div>
              )}

              {/* item content
              name, price, etc */}
              <div>
                <h3 style={{ 
                  margin: '0 0 8px 0', 
                  fontSize: '18px',
                  fontWeight: 'normal'
                }}>
                  {item.name}
                </h3>
                <p style={{ 
                  margin: '0 0 12px 0', 
                  fontSize: '16px',
                  fontWeight: 'bold'
                }}>
                  {item.price} kr
                </p>
                <div>
                  <p style={{ 
                    margin: '0 0 4px 0', 
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}>
                    Item description
                  </p>
                  <p style={{ 
                    margin: '0', 
                    fontSize: '12px',
                    color: '#cccccc',
                    lineHeight: '1.3'
                  }}>
                    Lorem ipsum dolor sit amet, consectetur
                  </p>
                </div>
              </div>

              {/* //add to cart button */}
              <button
                style={{
                  position: 'absolute',
                  bottom: '15px',
                  right: '15px',
                  width: '35px',
                  height: '35px',
                  borderRadius: '50%',
                  backgroundColor: 'white',
                  color: '#6b6b6b',
                  border: 'none',
                  fontSize: '20px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold'
                }}
                onClick={() => addToCart(item)}
              >
                +
              </button>
            </div>
          ))
        )}
      </div>

      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <button
          onClick={goHome}
          style={{
            margin: '10px',
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Start Page
        </button>
       
        
      </div>
    </div>
  );
}

export default Menu;