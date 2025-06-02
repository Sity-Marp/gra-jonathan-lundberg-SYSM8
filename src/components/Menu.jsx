import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

function Menu() {
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3002/menuItems')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch menu items');
        return res.json();
      })
      .then((data) => setMenuItems(data))
      .catch((error) => console.error('Error fetching menu items:', error));
  }, []);

  const goHome = () => navigate('/');
  const goBack = () => navigate(-1);

  return (
    <div style={{ padding: '20px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <h1 style={{ textAlign: 'center' }}>Menu Page</h1>
      
      {/* Menu Items Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px',
        margin: '20px 0',
        maxWidth: '1200px',
        marginLeft: 'auto',
        marginRight: 'auto'
      }}>
        {menuItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>Loading menu...</div>
        ) : (
          menuItems.map(item => (
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
              {/* Item Content */}
              <div>
                <h3 style={{ 
                  margin: '0 0 8px 0', 
                  fontSize: '18px',
                  fontWeight: 'normal'
                }}>
                  Item name example: {item.name}
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

              {/* Plus Button */}
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
                onClick={() => console.log(`Add ${item.name} to cart`)}
              >
                +
              </button>
            </div>
          ))
        )}
      </div>

      {/* Navigation Buttons */}
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
          Go Home (Button)
        </button>
       
        <button
          onClick={goBack}
          style={{
            margin: '10px',
            padding: '10px 20px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Go Back
        </button>
      </div>
    </div>
  );
}

export default Menu;