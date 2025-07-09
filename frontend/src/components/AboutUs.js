import React from 'react';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-base-100">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-base-content">
            About De Canokart
          </h1>
          <p className="text-xl text-base-content/70 max-w-3xl mx-auto leading-relaxed">
            Your trusted online marketplace connecting quality products with exceptional customer service
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-base-content">Our Story</h2>
              <p className="text-base-content/80 mb-4 leading-relaxed">
                De Canokart was founded with a simple mission: to create a seamless shopping experience 
                that brings quality products directly to your doorstep. We believe that online shopping 
                should be convenient, reliable, and enjoyable.
              </p>
              <p className="text-base-content/80 leading-relaxed">
                From our carefully curated product selection to our customer-first approach, 
                every aspect of De Canokart is designed with you in mind.
              </p>
            </div>
            <div className="bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl p-8 text-center">
              <div className="text-4xl mb-4">🛍️</div>
              <h3 className="text-2xl font-semibold mb-2 text-base-content">Quality First</h3>
              <p className="text-base-content/70">
                Every product is carefully selected to meet our high standards
              </p>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center p-6 rounded-xl bg-base-200/50">
              <div className="text-3xl mb-4">🚚</div>
              <h3 className="text-xl font-semibold mb-3 text-base-content">Fast Delivery</h3>
              <p className="text-base-content/70">
                Quick and reliable shipping to get your orders to you on time
              </p>
            </div>
            <div className="text-center p-6 rounded-xl bg-base-200/50">
              <div className="text-3xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold mb-3 text-base-content">Secure Shopping</h3>
              <p className="text-base-content/70">
                Your data and transactions are protected with industry-standard security
              </p>
            </div>
            <div className="text-center p-6 rounded-xl bg-base-200/50">
              <div className="text-3xl mb-4">💬</div>
              <h3 className="text-xl font-semibold mb-3 text-base-content">24/7 Support</h3>
              <p className="text-base-content/70">
                Our customer service team is always ready to help you
              </p>
            </div>
          </div>

          {/* Values Section */}
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-8 text-base-content">What We Stand For</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-4">
                <h4 className="font-semibold text-lg mb-2 text-base-content">Trust</h4>
                <p className="text-base-content/70 text-sm">Building lasting relationships through transparency</p>
              </div>
              <div className="p-4">
                <h4 className="font-semibold text-lg mb-2 text-base-content">Quality</h4>
                <p className="text-base-content/70 text-sm">Only the best products make it to our platform</p>
              </div>
              <div className="p-4">
                <h4 className="font-semibold text-lg mb-2 text-base-content">Innovation</h4>
                <p className="text-base-content/70 text-sm">Constantly improving your shopping experience</p>
              </div>
              <div className="p-4">
                <h4 className="font-semibold text-lg mb-2 text-base-content">Community</h4>
                <p className="text-base-content/70 text-sm">Supporting customers and sellers alike</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;