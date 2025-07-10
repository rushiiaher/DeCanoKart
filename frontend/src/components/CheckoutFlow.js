import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { useCart } from '../context/CartContext';
import CartReview from './checkout/CartReview';
import AddressSelection from './checkout/AddressSelection';
import OrderSummary from './checkout/OrderSummary';
import PaymentSelection from './checkout/PaymentSelection';
import OrderConfirmation from './checkout/OrderConfirmation';

const CheckoutFlow = ({ onBack, onOrderComplete, onNavigateToTracking }) => {
  const { user, token } = useAuth();
  const { items: cartItems, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState(1);
  const [checkoutData, setCheckoutData] = useState({
    items: cartItems,
    selectedAddress: null,
    paymentMethod: null,
    orderTotal: 0,
    orderId: null
  });

  // Update items when cartItems change or check for buy now product
  useEffect(() => {
    const buyNowProduct = localStorage.getItem('buyNowProduct');
    if (buyNowProduct) {
      const product = JSON.parse(buyNowProduct);
      setCheckoutData(prev => ({ ...prev, items: [{ ...product, quantity: 1 }] }));
      localStorage.removeItem('buyNowProduct');
    } else if (cartItems && cartItems.length > 0) {
      setCheckoutData(prev => ({ ...prev, items: cartItems }));
    }
  }, [cartItems]);

  const steps = [
    { id: 1, name: 'Cart Review', component: CartReview },
    { id: 2, name: 'Delivery Address', component: AddressSelection },
    { id: 3, name: 'Order Summary', component: OrderSummary },
    { id: 4, name: 'Payment', component: PaymentSelection },
    { id: 5, name: 'Confirmation', component: OrderConfirmation }
  ];

  const updateCheckoutData = (data) => {
    setCheckoutData(prev => ({ ...prev, ...data }));
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const CurrentComponent = steps[currentStep - 1].component;

  // Set up global navigation callbacks for OrderConfirmation
  useEffect(() => {
    window.navigateToOrderTracking = (orderId) => {
      if (onNavigateToTracking) onNavigateToTracking(orderId);
    };
    window.navigateToProducts = () => {
      if (onBack) onBack();
    };
    
    return () => {
      delete window.navigateToOrderTracking;
      delete window.navigateToProducts;
    };
  }, [onBack, onNavigateToTracking]);

  return (
    <div className="min-h-screen bg-gray-50 pt-[160px] lg:pt-[80px]">
      {/* Progress Bar */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          {/* Mobile Layout */}
          <div className="block md:hidden">
            <button onClick={onBack} className="text-blue-600 hover:text-blue-800 mb-4">
              ← Back to Shopping
            </button>
            <div className="flex items-center justify-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep >= steps[currentStep - 1].id ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {currentStep}
              </div>
              <span className="ml-2 text-sm font-medium text-blue-600">
                {steps[currentStep - 1].name}
              </span>
              <span className="ml-2 text-xs text-gray-500">
                ({currentStep} of {steps.length})
              </span>
            </div>
          </div>
          
          {/* Desktop Layout */}
          <div className="hidden md:flex items-center justify-between">
            <button onClick={onBack} className="text-blue-600 hover:text-blue-800">
              ← Back to Shopping
            </button>
            <div className="flex items-center space-x-4">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= step.id ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {step.id}
                  </div>
                  <span className={`ml-2 text-sm ${
                    currentStep >= step.id ? 'text-blue-600 font-medium' : 'text-gray-500'
                  }`}>
                    {step.name}
                  </span>
                  {index < steps.length - 1 && (
                    <div className={`w-8 h-0.5 mx-4 ${
                      currentStep > step.id ? 'bg-blue-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-4 md:py-8">
        <CurrentComponent
          checkoutData={checkoutData}
          updateCheckoutData={updateCheckoutData}
          nextStep={nextStep}
          prevStep={prevStep}
          currentStep={currentStep}
        />
      </div>
    </div>
  );
};

export default CheckoutFlow;