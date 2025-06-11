import React, { useState, useEffect } from 'react';
function TopItems() {
    const [topItems, setTopItems] = useState([]);
   
    useEffect(() => {
        const fetchTopItems = async () => {
            try {
                const response = await fetch('http://localhost:3002/menuItems');
                const menuItems = await response.json();
               
                const sortedItems = menuItems
                    .sort((a, b) => b.popularity - a.popularity)
                    .slice(0, 3);
               
                setTopItems(sortedItems);
            } catch (err) {
                console.error('Error fetching items:', err);
            }
        };
        fetchTopItems();
    }, []);
   
    return (
        <div>
            <h2>Top Popular Items</h2>
            {/* menu items grid
            pretty much c & p from menu, big nono.
            should write reusable code.*/}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '20px',
                margin: '20px 0',
                maxWidth: '1200px',
                marginLeft: 'auto',
                marginRight: 'auto'
            }}>
                {topItems.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '20px' }}>Loading top items...</div>
                ) : (
                    topItems.map(item => (
                        <div
                            key={item.id}
                            style={{
                                backgroundColor: '#6b6b6b',
                                color: 'white',
                                borderRadius: '12px',
                                position: 'relative',
                                minHeight: '240px',
                                display: 'flex',
                                flexDirection: 'column',
                                overflow: 'hidden'
                            }}
                        >
                            <div style={{
                                height: '160px',
                                backgroundImage: item.image ? `url(${item.image})` : 'none',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                backgroundRepeat: 'no-repeat',
                                backgroundColor: '#8b8b8b'
                            }}>
                            </div>

                            <div style={{
                                padding: '15px',
                                backgroundColor: '#6b6b6b',
                                flex: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between'
                            }}>
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
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
export default TopItems;