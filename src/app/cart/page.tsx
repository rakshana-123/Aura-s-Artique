"use client";

import React, { useState } from "react";
import { useCart, CartItem } from "@/context/CartContext";
import Link from "next/link";
import { 
  ShoppingBag, Trash2, ArrowRight, User, Mail, 
  MapPin, CheckCircle, CreditCard, Sparkles, Package, 
  Truck
} from "lucide-react";
import confetti from "canvas-confetti";

interface OrderTracking {
  id: number;
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
  totalAmount: number;
  gstAmount: number;
  status: "PENDING_PAYMENT" | "PAID" | "IN_PRODUCTION" | "DISPATCHED";
  trackingAwb: string | null;
  items: CartItem[];
}

export default function CartAndCheckout() {
  const { 
    cart, updateQuantity, removeFromCart, clearCart,
    getCartSubtotal, getCartGst, getCartTotal, getResellerEarnings
  } = useCart();

  // Checkout shipping states
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");

  // System states (FR-2.3 Pipeline)
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeOrder, setActiveOrder] = useState<OrderTracking | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // 1. Initiate Checkout (PENDING_PAYMENT trigger)
  const handleInitiateCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerEmail || !shippingAddress) return;

    setIsSubmitting(true);

    // Simulate backend REST call compiling the order payload
    const mockOrder: OrderTracking = {
      id: Math.floor(100000 + Math.random() * 900000),
      customerName,
      customerEmail,
      shippingAddress,
      totalAmount: getCartTotal(),
      gstAmount: getCartGst(),
      status: "PENDING_PAYMENT",
      trackingAwb: null,
      items: [...cart]
    };

    // Simulate network latency
    setTimeout(() => {
      setActiveOrder(mockOrder);
      setIsSubmitting(false);
      setShowPaymentModal(true);
    }, 1200);
  };

  // 2. Complete Payment (PAID trigger)
  const handleCompletePayment = () => {
    setPaymentProcessing(true);

    setTimeout(() => {
      if (activeOrder) {
        const paidOrder: OrderTracking = {
          ...activeOrder,
          status: "PAID"
        };
        setActiveOrder(paidOrder);
        setPaymentProcessing(false);
        setShowPaymentModal(false);
        clearCart(); // Clear cart upon successful transaction

        // Trigger premium micro-animation confetti
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 }
        });
      }
    }, 2000);
  };

  // 3. Workshop Operator Fulfills Print Order (IN_PRODUCTION trigger)
  const triggerProduction = () => {
    if (activeOrder) {
      setActiveOrder({
        ...activeOrder,
        status: "IN_PRODUCTION"
      });
    }
  };

  // 4. Barcode dispatch & tracking numbers generated (DISPATCHED trigger)
  const triggerDispatch = () => {
    if (activeOrder) {
      const randomAwb = `AWB-${Math.floor(1000000000 + Math.random() * 9000000000)}`;
      setActiveOrder({
        ...activeOrder,
        status: "DISPATCHED",
        trackingAwb: randomAwb
      });
    }
  };

  if (activeOrder && activeOrder.status !== "PENDING_PAYMENT") {
    // Order Status Tracking Screen (FR-2.3 Pipeline visualizer)
    return (
      <div className="max-w-2xl mx-auto py-6 flex flex-col gap-8">
        <div className="bg-white border border-black/5 rounded-2xl p-6 shadow-diffused text-center">
          <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-100">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-neutral-800">Payment Verified Successfully!</h2>
          <p className="text-xs text-neutral-500 font-sans mt-1">
            Order Reference: <strong className="text-neutral-700 font-mono">#ORD-{activeOrder.id}</strong>
          </p>
          <div className="mt-4 bg-stone-50 border border-neutral-100 rounded-xl px-4 py-2 text-[11px] text-neutral-500 font-sans inline-block">
            Factory print line locks are now active. Adjustments are secured.
          </div>
        </div>

        {/* Dynamic Status Progress Pipeline */}
        <div className="bg-white border border-black/5 rounded-2xl p-6 shadow-diffused">
          <h3 className="text-xs uppercase font-bold tracking-wider text-neutral-400 mb-6">
            OMS Tracking Pipeline
          </h3>

          <div className="relative flex flex-col gap-8 pl-8 border-l border-neutral-100">
            {/* Step 1: Paid */}
            <div className="relative">
              <div className={`absolute -left-[41px] w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                activeOrder.status === "PAID" 
                  ? "bg-rose-500 text-white ring-4 ring-rose-100 animate-pulse" 
                  : "bg-emerald-500 text-white"
              }`}>
                {activeOrder.status !== "PAID" ? "✓" : "1"}
              </div>
              <div>
                <h4 className="text-xs font-bold text-neutral-800">PAID & VERIFIED</h4>
                <p className="text-[11px] text-neutral-400 mt-0.5 leading-normal">
                  High-res image package packaged and queued for physical print development.
                </p>
              </div>
            </div>

            {/* Step 2: Production */}
            <div className="relative">
              <div className={`absolute -left-[41px] w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                activeOrder.status === "IN_PRODUCTION" 
                  ? "bg-rose-500 text-white ring-4 ring-rose-100 animate-pulse" 
                  : activeOrder.status === "DISPATCHED"
                  ? "bg-emerald-500 text-white"
                  : "bg-stone-200 text-neutral-400"
              }`}>
                {activeOrder.status === "DISPATCHED" ? "✓" : "2"}
              </div>
              <div>
                <h4 className={`text-xs font-bold ${
                  activeOrder.status === "PAID" ? "text-neutral-400" : "text-neutral-800"
                }`}>IN PRODUCTION</h4>
                <p className="text-[11px] text-neutral-400 mt-0.5 leading-normal">
                  Fulfillment specialist assembly in progress (material cuts, sizing, backing wraps).
                </p>
              </div>
            </div>

            {/* Step 3: Dispatched */}
            <div className="relative">
              <div className={`absolute -left-[41px] w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                activeOrder.status === "DISPATCHED" 
                  ? "bg-emerald-500 text-white ring-4 ring-emerald-100" 
                  : "bg-stone-200 text-neutral-400"
              }`}>
                3
              </div>
              <div>
                <h4 className={`text-xs font-bold ${
                  activeOrder.status !== "DISPATCHED" ? "text-neutral-400" : "text-neutral-800"
                }`}>DISPATCHED</h4>
                <p className="text-[11px] text-neutral-400 mt-0.5 leading-normal">
                  Airway Bill (AWB) barcode generated. Transferred to Delhivery logistics hubs.
                </p>
                {activeOrder.trackingAwb && (
                  <div className="bg-emerald-50/70 text-emerald-800 border border-emerald-100/50 p-2.5 rounded-lg text-[10px] font-mono mt-2 flex justify-between items-center w-fit gap-4">
                    <span>AWB: {activeOrder.trackingAwb}</span>
                    <span className="font-semibold text-emerald-600 uppercase text-[9px]">Live Courier Tracking</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Summary Details */}
        <div className="bg-white border border-black/5 rounded-2xl p-6 shadow-diffused flex flex-col gap-4">
          <h3 className="text-xs uppercase font-bold tracking-wider text-neutral-400">Order Summary</h3>
          <div className="flex flex-col gap-3 max-h-[200px] overflow-y-auto pr-1">
            {activeOrder.items.map((item, idx) => (
              <div key={idx} className="flex gap-3 text-xs justify-between items-center border-b border-neutral-50 pb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded bg-stone-100 overflow-hidden shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.customImageUrl} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-neutral-800 leading-none">{item.baseProductName}</span>
                    <span className="text-[10px] text-neutral-400 font-sans mt-0.5">
                      {item.frameSizeLayout} &middot; &quot;{item.customText}&quot; &times; {item.quantity}
                    </span>
                  </div>
                </div>
                <span className="font-bold text-neutral-800">
                  ₹{(item.baseProductPrice + item.filmLayoutPrice + 50 + item.resellerMargin) * 1.18 * item.quantity}
                </span>
              </div>
            ))}
          </div>
          <div className="flex justify-between border-t border-neutral-100 pt-3 text-sm font-bold text-neutral-800">
            <span>Total Retail cost</span>
            <span className="text-rose-700">₹{activeOrder.totalAmount.toFixed(2)}</span>
          </div>
        </div>

        {/* Demo Operators Controls Panel */}
        <div className="bg-stone-50 border border-stone-200 rounded-2xl p-6 text-center flex flex-col gap-3">
          <span className="text-[9px] uppercase font-bold tracking-wider text-neutral-400 bg-white px-2.5 py-1 rounded-full w-fit mx-auto border border-neutral-200">
            Workshop Simulator Controls (For testing FR-2.3)
          </span>
          <p className="text-[11px] text-neutral-500 font-sans max-w-md mx-auto">
            Simulate the operational dashboard updates typically triggered by workshop operators and logistics barcode handlers:
          </p>
          <div className="flex gap-3 mt-1 justify-center">
            <button
              onClick={triggerProduction}
              disabled={activeOrder.status !== "PAID"}
              className="bg-white hover:bg-neutral-50 border border-neutral-200 disabled:opacity-50 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all"
            >
              <Package className="w-3.5 h-3.5 text-rose-500" />
              Start Production
            </button>
            <button
              onClick={triggerDispatch}
              disabled={activeOrder.status !== "IN_PRODUCTION"}
              className="bg-white hover:bg-neutral-50 border border-neutral-200 disabled:opacity-50 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all"
            >
              <Truck className="w-3.5 h-3.5 text-emerald-500" />
              Dispatch Shipment
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-4">
      {/* Page Title */}
      <div className="mb-8 border-b border-black/5 pb-4 flex justify-between items-end">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-rose-500">Shopping Cart Module</span>
          <h1 className="font-serif text-4xl font-extrabold text-neutral-800 mt-1">My Shopping Cart</h1>
        </div>
        <span className="text-xs text-neutral-400 font-sans">
          {cartCount} unique items configured
        </span>
      </div>

      {cart.length === 0 ? (
        <div className="text-center py-20 bg-white/40 border border-black/5 rounded-2xl shadow-sm max-w-xl mx-auto flex flex-col items-center gap-4">
          <div className="w-14 h-14 bg-pastel-pink rounded-full flex items-center justify-center text-rose-600">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif text-xl font-bold">Your cart is empty</h3>
            <p className="text-xs text-neutral-400 font-sans mt-1">Configure custom frame templates and snap layouts to list them here.</p>
          </div>
          <Link
            href="/customizer"
            className="bg-neutral-800 hover:bg-neutral-900 text-white font-semibold py-2.5 px-6 rounded-xl text-xs transition-all flex items-center gap-1.5 shadow"
          >
            <span>Launch Customizer Studio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Grid: Cart items list */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {cart.map((item) => {
              // Mathematical Pricing calculations
              const pBaseVal = item.baseProductPrice + item.filmLayoutPrice;
              const pCustVal = item.customImageUrl ? 50 : 0;
              const subtotalVal = pBaseVal + pCustVal + item.resellerMargin;
              const retailPriceUnit = subtotalVal * 1.18;
              const totalRowCost = retailPriceUnit * item.quantity;

              return (
                <div 
                  key={item.id} 
                  className="bg-white border border-black/5 rounded-2xl p-4 shadow-diffused flex items-start justify-between gap-4 font-sans"
                >
                  <div className="flex gap-4 items-center flex-1">
                    {/* Image Preview thumbnail */}
                    <div className="w-20 aspect-square bg-stone-100 rounded-xl overflow-hidden shrink-0 border border-neutral-100 flex items-center justify-center relative shadow-sm">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.customImageUrl} alt="" className="w-full h-full object-cover" />
                      <div 
                        style={{ backgroundColor: item.frameColorTint }} 
                        className="absolute bottom-1 right-1 w-3 h-3 rounded-full border border-white shadow-sm"
                        title="Frame border color"
                      ></div>
                    </div>

                    {/* Configuration Metadata */}
                    <div className="flex flex-col gap-0.5 flex-1 text-xs">
                      <span className="font-bold text-neutral-800 leading-tight block">
                        {item.baseProductName}
                      </span>
                      <span className="text-[10px] text-neutral-400 font-sans">
                        Layout: {item.frameSizeLayout} &middot; Quality: Verified ({item.customImageResolution})
                      </span>
                      
                      {item.customText && (
                        <span className="font-cursive text-neutral-700 italic font-medium mt-1 inline-block bg-stone-50 px-2 py-0.5 rounded border border-neutral-100/50 w-fit">
                          &quot;{item.customText}&quot;
                        </span>
                      )}

                      {/* Margin allocations details */}
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700">
                          ₹{item.resellerMargin} Creator Markup
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Quantity Stepper & Price Column */}
                  <div className="flex flex-col items-end justify-between self-stretch text-right min-w-[100px]">
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-neutral-300 hover:text-rose-500 transition-colors p-1"
                      title="Remove Item"
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                    </button>

                    <div className="flex flex-col items-end gap-1">
                      <div className="flex items-center gap-2 bg-stone-50 border border-neutral-200 rounded px-1.5 py-0.5 scale-90">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="hover:bg-neutral-200 rounded px-1 text-xs text-neutral-500 font-bold"
                        >
                          -
                        </button>
                        <span className="font-bold text-xs text-neutral-800 w-4 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="hover:bg-neutral-200 rounded px-1 text-xs text-neutral-500 font-bold"
                        >
                          +
                        </button>
                      </div>
                      <span className="font-bold text-neutral-800 text-sm mt-1">
                        ₹{totalRowCost.toFixed(0)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Grid: Shipping Details & Transaction Summary */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Transaction Pricing Summary */}
            <div className="bg-white border border-black/5 rounded-2xl p-6 shadow-diffused flex flex-col gap-3 font-sans text-xs text-neutral-500">
              <h3 className="text-xs uppercase font-bold tracking-wider text-neutral-400 mb-2 border-b border-neutral-100 pb-2">
                Order Summary
              </h3>
              <div className="flex justify-between">
                <span>Production Subtotal</span>
                <span>₹{getCartSubtotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Goods & Services Tax (GST at 18%)</span>
                <span>₹{getCartGst().toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold text-emerald-700">
                <span>Incl. Creator Commissions Portion</span>
                <span>₹{getResellerEarnings().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-neutral-800 border-t border-neutral-200 pt-3">
                <span>Total Retail Cost</span>
                <span className="text-rose-700 text-base">₹{getCartTotal().toFixed(2)}</span>
              </div>
            </div>

            {/* Shipping Form & Order initiation */}
            <div className="bg-white border border-black/5 rounded-2xl p-6 shadow-diffused">
              <h3 className="text-xs uppercase font-bold tracking-wider text-neutral-400 mb-4 border-b border-neutral-100 pb-2">
                Shipping Details
              </h3>
              
              <form onSubmit={handleInitiateCheckout} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">Full Name</label>
                  <div className="flex items-center border border-neutral-200 rounded-xl px-3 py-2 bg-stone-50/50">
                    <User className="w-4 h-4 text-neutral-400 mr-2 shrink-0" />
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Jane Doe"
                      className="flex-1 text-xs focus:outline-none bg-transparent text-neutral-800"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">Email Address</label>
                  <div className="flex items-center border border-neutral-200 rounded-xl px-3 py-2 bg-stone-50/50">
                    <Mail className="w-4 h-4 text-neutral-400 mr-2 shrink-0" />
                    <input
                      type="email"
                      required
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="jane.doe@example.com"
                      className="flex-1 text-xs focus:outline-none bg-transparent text-neutral-800"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">Shipping Address</label>
                  <div className="flex items-start border border-neutral-200 rounded-xl px-3 py-2.5 bg-stone-50/50">
                    <MapPin className="w-4 h-4 text-neutral-400 mr-2 shrink-0 mt-0.5" />
                    <textarea
                      required
                      rows={3}
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      placeholder="Apartment, Street Name, City, PIN Code"
                      className="flex-1 text-xs focus:outline-none bg-transparent text-neutral-800 resize-none font-sans leading-normal"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-neutral-800 hover:bg-neutral-900 text-white font-semibold py-4.5 px-4 rounded-xl text-xs transition-transform duration-200 hover:scale(1.02) flex items-center justify-center gap-1.5 shadow mt-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Initiating Secure Checkout...</span>
                    </>
                  ) : (
                    <>
                      <span>Proceed to Payment Gateway</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Simulated Payment Gateway Modal */}
      {showPaymentModal && activeOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-neutral-200 rounded-2xl w-full max-w-sm p-6 shadow-2xl relative animate-fade-in font-sans">
            <div className="text-center flex flex-col items-center gap-3">
              <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center border border-rose-100">
                <CreditCard className="w-6 h-6 animate-pulse" />
              </div>
              <h3 className="font-serif text-lg font-bold text-neutral-800">Secure Payment Gateway</h3>
              <p className="text-[11px] text-neutral-400 leading-normal max-w-xs">
                Simulating payments handshake for <strong>₹{activeOrder.totalAmount.toFixed(0)}</strong> via Cards, UPI, or NetBanking networks.
              </p>
            </div>

            {/* Payment Details */}
            <div className="bg-stone-50 rounded-xl p-3.5 my-5 border border-neutral-100 flex flex-col gap-1.5 text-xs text-neutral-500">
              <div className="flex justify-between">
                <span>Billing Name:</span>
                <span className="font-semibold text-neutral-700">{activeOrder.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span>Email Address:</span>
                <span className="font-semibold text-neutral-700">{activeOrder.customerEmail}</span>
              </div>
              <div className="flex justify-between border-t border-dashed border-neutral-200 pt-1.5 font-bold text-neutral-800">
                <span>Payable Amount:</span>
                <span className="text-rose-700">₹{activeOrder.totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={handleCompletePayment}
                disabled={paymentProcessing}
                className="w-full bg-rose-600 hover:bg-rose-700 text-white font-semibold py-3 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 shadow"
              >
                {paymentProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing Secure Gateway Transaction...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 fill-white" />
                    <span>Authorize & Complete Payment</span>
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  setShowPaymentModal(false);
                  setActiveOrder(null);
                }}
                disabled={paymentProcessing}
                className="w-full py-2.5 hover:bg-neutral-50 border border-neutral-200 text-neutral-500 rounded-xl text-xs font-semibold"
              >
                Cancel transaction
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
