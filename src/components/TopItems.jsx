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
            <h2>Top 3 Popular Items</h2>
            {topItems.map((item) => (
                <div key={item.id}>
                    <h3>{item.name}</h3>
                    <p>Price: ${item.price}</p>
                    <p>Popularity: {item.popularity}</p>
                </div>
            ))}
        </div>
    );
}

export default TopItems;