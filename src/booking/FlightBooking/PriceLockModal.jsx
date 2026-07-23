import { useState, useEffect, useCallback, useRef } from 'react';
import api from '../../api/axios.js';
import PriceLockHeader from './components/PriceLockHeader';
import PriceLockForm from './components/PriceLockForm';
import PriceLockBenefits from './components/PriceLockBenefits';

const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_T9vYEo3gUdolCX';

const loadRazorpayScript = () => {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) { resolve(true); return; }
    const s = document.createElement('script');
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.onload = () => resolve(true);
    s.onerror = () => reject(new Error('Failed to load Razorpay SDK'));
    document.body.appendChild(s);
  });
};

export default function PriceLockModal({ isOpen, onClose, flight, onLockSuccess }) {
  const [lockOptions, setLockOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const mountedRef = useRef(true);

  useEffect(() => {
    return () => { mountedRef.current = false; };
  }, []);

  const scheduleId = flight?.scheduleId;
  const airlineName = flight?.flight?.airlineName || flight?.operator?.name || "Unknown Airline";
  const flightNumber = flight?.flight?.flightNumber || flight?.flightNumber || "--";
  const source = flight?.journey?.source || "Origin";
  const destination = flight?.journey?.destination || "Destination";
  const departureDate = flight?.journey?.departureDate
    ? new Date(flight.journey.departureDate).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })
    : "--";
  const departureTime = flight?.journey?.departureTime || "--:--";
  const arrivalTime = flight?.journey?.arrivalTime || "--:--";
  const baseFare = flight?.pricing?.baseFare || flight?.pricing?.calculatedFare || 0;
  const availableSeats = flight?.seats?.available ?? "N/A";
  const cabinClass = flight?.flight?.cabinClasses?.[0] || flight?.cabin?.class || "Economy";
  const stopsInfo = (() => {
    const layovers = flight?.journey?.stops || flight?.route?.layovers || [];
    return layovers.length === 0 ? "Non Stop" : `${layovers.length} stop(s)`;
  })();

  useEffect(() => {
    if (!isOpen || !baseFare) return;

    const durations = [
      { id: '4h',  label: '4 hours',  pct: 0.015, minFee: 99  },
      { id: '8h',  label: '8 hours',  pct: 0.020, minFee: 149, isPopular: true },
      { id: '12h', label: '12 hours', pct: 0.025, minFee: 199 },
      { id: '1d',  label: '1 day',    pct: 0.030, minFee: 299 },
      { id: '3d',  label: '3 days',   pct: 0.040, minFee: 499 },
      { id: '7d',  label: '7 days',   pct: 0.055, minFee: 799 },
    ];

    const options = durations.map(d => ({
      id: d.id,
      duration: d.label,
      fee: Math.max(d.minFee, Math.round(baseFare * d.pct)),
      flightPrice: baseFare,
      isPopular: d.isPopular || false,
    }));

    if (!mountedRef.current) return;
    setLockOptions(options);
    setSelectedOption(options[1]);
    setSuccess(null);
    setError(null);
  }, [isOpen, baseFare]);

  const getExpiryPreview = useCallback(() => {
    if (!selectedOption) return "";
    const ms = {
      '4h': 4 * 3600000, '8h': 8 * 3600000, '12h': 12 * 3600000,
      '1d': 86400000, '3d': 3 * 86400000, '7d': 7 * 86400000,
    };
    const expiry = new Date(Date.now() + (ms[selectedOption.id] || 0));
    return expiry.toLocaleDateString('en-IN', {
      month: 'short', day: 'numeric', year: 'numeric',
    }) + ' | ' + expiry.toLocaleTimeString('en-IN', {
      hour: '2-digit', minute: '2-digit', hour12: true,
    });
  }, [selectedOption]);

  const handleLockPrice = async () => {
    if (!scheduleId || !selectedOption) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const initRes = await api.post('/api/v1/flights/price-locks', {
        scheduleId,
        lockDurationId: selectedOption.id,
      });

      const initData = initRes.data?.data;
      if (!initRes.data?.success || !initData) {
        throw new Error(initRes.data?.message || 'Failed to initiate price lock');
      }

      const priceLockId = initData.priceLock?.priceLockId || initData.priceLock?._id;
      const { razorpayOrderId, amount, currency } = initData;

      await loadRazorpayScript();

      const razorpayOptions = {
        key: RAZORPAY_KEY,
        amount: Math.round((amount || selectedOption.fee) * 100),
        currency: currency || 'INR',
        name: 'Payanam',
        description: `Price Lock – ${selectedOption.duration}`,
        order_id: razorpayOrderId,
        theme: { color: '#2563eb' },
        modal: {
          ondismiss: () => {
            setLoading(false);
            setError('Payment cancelled. Your price lock was not activated.');
          },
        },
        handler: async (paymentResp) => {
          try {
            const verifyRes = await api.post('/api/v1/flights/price-locks/verify', {
              priceLockId,
              razorpayOrderId: paymentResp.razorpay_order_id,
              razorpayPaymentId: paymentResp.razorpay_payment_id,
              razorpaySignature: paymentResp.razorpay_signature,
            });

            if (verifyRes.data?.success) {
              setSuccess(verifyRes.data.data);
              if (onLockSuccess) onLockSuccess(verifyRes.data.data);
            } else {
              throw new Error(verifyRes.data?.message || 'Payment verification failed');
            }
          } catch (verifyErr) {
            console.error('Price lock verify error:', verifyErr);
            setError(verifyErr.response?.data?.message || 'Payment verification failed. Contact support.');
          } finally {
            setLoading(false);
          }
        },
      };

      const rzp = new window.Razorpay(razorpayOptions);
      rzp.on('payment.failed', (resp) => {
        setLoading(false);
        setError(resp.error?.description || 'Payment failed. Please try again.');
      });
      rzp.open();
    } catch (err) {
      console.error('Price lock error:', err);
      const msg = err.response?.data?.message || err.message || 'Failed to lock price. Please try again.';
      setError(msg);
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  if (success) {
    return <PriceLockBenefits success={success} onClose={onClose} />;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 font-sans" onClick={onClose}>
      <div className="w-full max-w-xl bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden relative flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 overflow-y-auto space-y-5">
          <PriceLockHeader
            onClose={onClose}
            airlineName={airlineName}
            flightNumber={flightNumber}
            source={source}
            destination={destination}
            departureDate={departureDate}
            departureTime={departureTime}
            arrivalTime={arrivalTime}
            stopsInfo={stopsInfo}
            cabinClass={cabinClass}
            availableSeats={availableSeats}
          />

          <PriceLockForm
            lockOptions={lockOptions}
            selectedOption={selectedOption}
            onSelectOption={(opt) => { setSelectedOption(opt); setError(null); }}
            error={error}
            loading={loading}
            onSubmit={handleLockPrice}
            getExpiryPreview={getExpiryPreview}
            baseFare={baseFare}
          />
        </div>
      </div>
    </div>
  );
}
