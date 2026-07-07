import { useState, useEffect, useCallback } from "react";
import api from "../api/axios";

/**
 * Custom hook for Razorpay payment integration
 * 
 * Flow:
 * 1. Create booking → get bookingMongoId
 * 2. Create Razorpay order → get razorpayOrderId, amount
 * 3. Open Razorpay checkout modal
 * 4. On success → verify payment → get confirmed booking
 * 5. On failure → log payment failure
 */
export const useRazorpay = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null); // 'success' | 'failed' | 'pending' | null
  const [paymentData, setPaymentData] = useState(null);
  const [error, setError] = useState(null);

  // Load Razorpay checkout script dynamically
  useEffect(() => {
    const loadRazorpayScript = () => {
      return new Promise((resolve, reject) => {
        if (window.Razorpay) {
          resolve(true);
          return;
        }

        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => reject(new Error("Failed to load Razorpay SDK"));
        document.body.appendChild(script);
      });
    };

    loadRazorpayScript().catch((err) => {
      console.error("Razorpay script load error:", err);
    });
  }, []);

  /**
   * Initialize Razorpay payment
   * @param {Object} options
   * @param {string} options.bookingMongoId - MongoDB _id of the booking
   * @param {number} options.amount - Amount in rupees
   * @param {string} options.customerName - Customer name
   * @param {string} options.customerEmail - Customer email
   * @param {string} options.customerContact - Customer phone
   * @param {string} options.description - Payment description (e.g., "Bus Ticket - PAY-A3F2B1")
   * @returns {Promise<Object>} Payment verification response
   */
  const initiatePayment = useCallback(async (options) => {
    const {
      bookingMongoId,
      amount,
      customerName,
      customerEmail,
      customerContact,
      description,
    } = options;

    setIsProcessing(true);
    setError(null);
    setPaymentStatus(null);
    setPaymentData(null);

    try {
      // Step 1: Create Razorpay order on backend
      const orderResponse = await api.post("/api/v1/payments/create-order", {
        bookingMongoId,
      });

      if (!orderResponse.data?.success) {
        throw new Error(orderResponse.data?.message || "Failed to create payment order");
      }

      const { razorpayOrderId, amount: orderAmount, currency } = orderResponse.data.data;

      // Step 2: Configure Razorpay checkout options
      const razorpayOptions = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_T9vYEo3gUdolCX",
        amount: Math.round(orderAmount * 100), // Convert to paise
        currency: currency || "INR",
        name: "Payanam",
        description: description || "Travel Booking Payment",
        order_id: razorpayOrderId,
        prefill: {
          name: customerName || "",
          email: customerEmail || "",
          contact: customerContact || "",
        },
        theme: {
          color: "#65a30d", // Lime-600 to match Payanam branding
        },
        modal: {
          ondismiss: () => {
            console.log("Razorpay modal dismissed");
            setPaymentStatus("failed");
            setError("Payment cancelled by user");
            // Log failure to backend (fire-and-forget)
            api.post("/api/v1/payments/failure", {
              razorpayOrderId,
              errorCode: "USER_CANCELLED",
              errorDescription: "Payment cancelled by user",
              bookingMongoId,
            }).catch((err) => console.error("Failed to log payment failure:", err));
          },
        },
        handler: async (paymentResponse) => {
          // Step 3: Verify payment on backend
          try {
            const verifyResponse = await api.post("/api/v1/payments/verify", {
              razorpayOrderId: paymentResponse.razorpay_order_id,
              razorpayPaymentId: paymentResponse.razorpay_payment_id,
              razorpaySignature: paymentResponse.razorpay_signature,
              bookingMongoId,
            });

            if (verifyResponse.data?.success) {
              setPaymentStatus("success");
              setPaymentData(verifyResponse.data.data);
            } else {
              throw new Error(verifyResponse.data?.message || "Payment verification failed");
            }
          } catch (verifyError) {
            console.error("Payment verification error:", verifyError);
            setPaymentStatus("failed");
            setError(verifyError.response?.data?.message || "Payment verification failed");
            
            // Log failure to backend
            api.post("/api/v1/payments/failure", {
              razorpayOrderId: paymentResponse.razorpay_order_id,
              errorCode: "VERIFICATION_FAILED",
              errorDescription: verifyError.message,
              bookingMongoId,
            }).catch((err) => console.error("Failed to log payment failure:", err));
          } finally {
            setIsProcessing(false);
          }
        },
      };

      // Step 4: Open Razorpay checkout modal
      const razorpay = new window.Razorpay(razorpayOptions);
      
      razorpay.on("payment.failed", (response) => {
        console.error("Payment failed:", response.error);
        setPaymentStatus("failed");
        setError(response.error.description || "Payment failed");
        setIsProcessing(false);
        
        // Log failure to backend (fire-and-forget)
        api.post("/api/v1/payments/failure", {
          razorpayOrderId: response.error.metadata?.order_id,
          errorCode: response.error.code,
          errorDescription: response.error.description,
          bookingMongoId,
        }).catch((err) => console.error("Failed to log payment failure:", err));
      });

      razorpay.open();
    } catch (err) {
      console.error("Payment initiation error:", err);
      setError(err.response?.data?.message || err.message || "Failed to initiate payment");
      setPaymentStatus("failed");
      setIsProcessing(false);
    }
  }, []);

  const resetPayment = useCallback(() => {
    setPaymentStatus(null);
    setPaymentData(null);
    setError(null);
    setIsProcessing(false);
  }, []);

  return {
    initiatePayment,
    isProcessing,
    paymentStatus,
    paymentData,
    error,
    resetPayment,
  };
};

export default useRazorpay;
