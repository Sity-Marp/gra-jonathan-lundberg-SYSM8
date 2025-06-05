import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function PaymentForm() {
    const location = useLocation();
    const navigate = useNavigate();
    
    const orderTotal = location.state.total;
    const order = location.state?.order;

    const handlePaymentSubmit = async (paymentData) => {
        // update the order status in database
        if (order) {
            await fetch(`http://localhost:3002/orders/${order.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...order,
                    status: 'completed',
                    customerInfo: {
                        firstName: paymentData.firstName,
                        lastName: paymentData.lastName,
                        phoneNumber: paymentData.phoneNumber,
                        address: paymentData.address,
                        paymentMethod: paymentData.paymentMethod
                    }
                })
            });
        }
        
        alert(`Payment successful! Total: ${orderTotal.toFixed(2)} kr`);
       
        navigate('/');
    };

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        address: '',
        paymentMethod: ''
    });

    const [errors, setErrors] = useState({});
    const [isProcessing, setIsProcessing] = useState(false);

    const inputStyle = {
        width: '100%',
        padding: '12px',
        fontSize: '16px',
        border: '2px solid #ddd',
        borderRadius: '8px',
        marginBottom: '10px',
        boxSizing: 'border-box'
    };

    const errorInputStyle = {
        ...inputStyle,
        borderColor: '#ff4444'
    };

    const labelStyle = {
        display: 'block',
        marginBottom: '5px',
        fontWeight: 'bold',
        fontSize: '14px'
    };

    const errorStyle = {
        color: '#ff4444',
        fontSize: '12px',
        marginBottom: '10px'
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handlePhoneInputChange = (e) => {
        const { value } = e.target;
        // remove non-digit characters, regex is confusion.
        const numbersOnly = value.replace(/\D/g, '');
        setFormData((prev) => ({ ...prev, phoneNumber: numbersOnly }));
    };

    const handleRadioChange = (e) => {
        setFormData((prev) => ({ ...prev, paymentMethod: e.target.value }));
    };

    const validatePhoneNumber = (phoneNumber) => {
        if (!phoneNumber.trim()) {
            return 'Phone number is required.';
        }
        
        const numbersOnly = phoneNumber.replace(/\D/g, '');
        if (numbersOnly !== phoneNumber) {
            return 'Phone number must contain only numbers.';
        }
        
        if (numbersOnly.length < 8) {
            return 'Phone number must contain at least 8 digits.';
        }
        
        if (numbersOnly.length > 12) {
            return 'Phone number cannot exceed 12 digits.';
        }
        
        return null;
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required.';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required.';
        
        const phoneError = validatePhoneNumber(formData.phoneNumber);
        if (phoneError) newErrors.phoneNumber = phoneError;
        
        if (!formData.address.trim()) newErrors.address = 'Address is required.';
        if (!formData.paymentMethod) newErrors.paymentMethod = 'Payment method is required.';
        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setErrors({});
        setIsProcessing(true);

        // simulate the processing fee thingie
        // ...formdata stuff needs to be read up on but it works ig ¯\_(ツ)_/¯
        setTimeout(async () => {
            await handlePaymentSubmit({ 
                ...formData, 
                order: order,
                totalAmount: orderTotal 
            });
            setIsProcessing(false);
        }, 2000);
    };

    return (
        <div style={{
            maxWidth: '500px',
            margin: '0 auto',
            padding: '20px',
            backgroundColor: '#f9f9f9',
            borderRadius: '12px'
        }}>
            <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Payment Information</h2>

            <div style={{
                backgroundColor: '#e8f5e8',
                padding: '15px',
                borderRadius: '8px',
                marginBottom: '25px',
                textAlign: 'center'
            }}>
                <h3 style={{ margin: '0 0 10px 0' }}>Order Total</h3>
                <p style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    margin: '0',
                    color: '#2d5a2d'
                }}>
                    {orderTotal.toFixed(2)} kr
                </p>
            </div>

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '20px' }}>
                    <label style={labelStyle}>First Name *</label>
                    <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        style={errors.firstName ? errorInputStyle : inputStyle}
                        placeholder="Enter your first name"
                    />
                    {errors.firstName && <div style={errorStyle}>{errors.firstName}</div>}
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label style={labelStyle}>Last Name *</label>
                    <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        style={errors.lastName ? errorInputStyle : inputStyle}
                        placeholder="Enter your last name"
                    />
                    {errors.lastName && <div style={errorStyle}>{errors.lastName}</div>}
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label style={labelStyle}>Phone Number * (8-12 digits)</label>
                    <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handlePhoneInputChange}
                        style={errors.phoneNumber ? errorInputStyle : inputStyle}
                        placeholder="Enter your phone number (numbers only)"
                        maxLength="12"
                    />
                    {errors.phoneNumber && <div style={errorStyle}>{errors.phoneNumber}</div>}
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label style={labelStyle}>Address *</label>
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        style={errors.address ? errorInputStyle : inputStyle}
                        placeholder="Enter your full address"
                        rows="3"
                    />
                    {errors.address && <div style={errorStyle}>{errors.address}</div>}
                </div>

                <div style={{ marginBottom: '30px' }}>
                    <label style={labelStyle}>Payment Method *</label>
                    <div style={{
                        border: errors.paymentMethod ? '2px solid #ff4444' : '2px solid #ddd',
                        borderRadius: '8px',
                        padding: '15px',
                        backgroundColor: 'white'
                    }}>
                        <div style={{ marginBottom: '10px' }}>
                            <label style={{
                                display: 'flex',
                                alignItems: 'center',
                                cursor: 'pointer',
                                fontSize: '16px',
                                fontWeight: 'normal'
                            }}>
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="card"
                                    checked={formData.paymentMethod === 'card'}
                                    onChange={handleRadioChange}
                                    style={{ marginRight: '10px', transform: 'scale(1.2)' }}
                                />
                                Credit/Debit Card
                            </label>
                        </div>
                        <div>
                            <label style={{
                                display: 'flex',
                                alignItems: 'center',
                                cursor: 'pointer',
                                fontSize: '16px',
                                fontWeight: 'normal'
                            }}>
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="cash"
                                    checked={formData.paymentMethod === 'cash'}
                                    onChange={handleRadioChange}
                                    style={{ marginRight: '10px', transform: 'scale(1.2)' }}
                                />
                                Swish
                            </label>
                        </div>
                    </div>
                    {errors.paymentMethod && <div style={errorStyle}>{errors.paymentMethod}</div>}
                </div>

                <button
                    type="submit"
                    disabled={isProcessing}
                    style={{
                        width: '100%',
                        padding: '15px',
                        fontSize: '18px',
                        fontWeight: 'bold',
                        backgroundColor: isProcessing ? '#ccc' : '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: isProcessing ? 'not-allowed' : 'pointer'
                    }}
                >
                    {isProcessing ? 'Processing Payment...' : `Pay ${orderTotal.toFixed(2)} kr`}
                </button>
            </form>
        </div>
    );
}

export default PaymentForm;