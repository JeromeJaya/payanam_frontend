import React, { useState, useEffect, useCallback } from 'react';
import { X, Lock, Plane, TrendingUp, ArrowRight, Shield, Clock, AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import api from '../../api/axios.js';

/**
 * PriceLockModal — Dynamic, API-connected modal for locking flight fares.
 *
 * Props:
 *   - isOpen: boolean — controls visibility
 *   - onClose: () => void — close callback
 *   - flight: object — full flight search result object
 *   - onLockSuccess: (lock) => void — callback after successful lock
 */
export default function PriceLockModal({ isOpen, onClose, flight, onLockSuccess }) {
  const [lockOptions, setLockOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  // Extract flight details
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

  // Calculate lock options based on fare
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

    setLockOptions(options);
    setSelectedOption(options[1]); // Default to 8h (popular)
    setSuccess(null);
    setError(null);
  }, [isOpen, baseFare]);

  // Compute expiry preview
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

  // Handle Lock submission
  const handleLockPrice = async () => {
    if (!scheduleId || !selectedOption) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await api.post('/api/v1/flights/price-locks', {
        scheduleId,
        lockDurationId: selectedOption.id,
      });

      if (res.data?.success) {
        setSuccess(res.data.data);
        if (onLockSuccess) onLockSuccess(res.data.data);
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.errors?.[0] || "Failed to lock price. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  // ── SUCCESS STATE ──────────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 font-sans" onClick={onClose}>
        <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <CheckCircle2 size={32} className="text-emerald-600 dark:text-emerald-400" />
            </div>
            <h2 className="text-xl font-black text-gray-900 dark:text-slate-100">Price Locked Successfully!</h2>
            <div className="space-y-2 text-sm text-gray-600 dark:text-slate-400">
              <p>Your fare of <span className="font-bold text-gray-900 dark:text-slate-100">₹{success.lockedFare?.toLocaleString('en-IN')}</span> has been locked.</p>
              <p>Lock ID: <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{success.priceLockId}</span></p>
              <p className="text-xs text-gray-400 dark:text-slate-500">
                Expires: {new Date(success.expiresAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
              </p>
            </div>
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg p-3 text-xs text-amber-800 dark:text-amber-300">
              <Info size={14} className="inline mr-1" />
              The lock fee of ₹{success.lockFee} is non-refundable and not adjusted toward the ticket price.
            </div>
            <button
              onClick={onClose}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-colors mt-2"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── MAIN MODAL ─────────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 font-sans" onClick={onClose}>
      <div className="w-full max-w-xl bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden relative flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>

        {/* Header Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 rounded-full text-gray-400 dark:text-slate-500 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-gray-700 dark:hover:text-slate-200 transition-colors z-10"
        >
          <X size={20} strokeWidth={2} />
        </button>

        {/* Inner Content Wrapper */}
        <div className="p-6 overflow-y-auto space-y-5">

          {/* Main Headline Block */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-200 dark:shadow-blue-900/30">
              <Lock size={18} />
            </div>
            <div>
              <h2 className="text-xl font-black text-gray-900 dark:text-slate-100 tracking-tight">
                Lock this price & pay later!
              </h2>
              <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">Freeze the fare. Book when you're ready.</p>
            </div>
          </div>

          {/* Route Overview Segment Card */}
          <div className="border border-gray-100 dark:border-slate-700 rounded-xl p-4 space-y-3 bg-gray-50/50 dark:bg-slate-700/30">
            {/* Flight Row */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-gray-800 dark:text-slate-200 font-bold text-sm">
                <Plane size={15} className="text-blue-900 dark:text-blue-400 rotate-45" />
                <span>{source.split('(')[0]?.trim()}</span>
                <ArrowRight size={14} className="text-gray-400 dark:text-slate-500" />
                <span>{destination.split('(')[0]?.trim()}</span>
              </div>
              <p className="text-xs font-medium text-gray-500 dark:text-slate-400 pl-6">
                {departureDate} | {departureTime} - {arrivalTime} | {stopsInfo} | {cabinClass}
              </p>
              <p className="text-xs font-semibold text-gray-400 dark:text-slate-500 pl-6">
                {airlineName} · {flightNumber}
              </p>
            </div>

            {/* Demand Indicator */}
            {availableSeats !== "N/A" && availableSeats <= 15 && (
              <div className="bg-amber-50/70 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-700 rounded-lg p-2.5 flex items-center gap-2 text-xs text-amber-900 dark:text-amber-300">
                <TrendingUp size={14} className="text-amber-600 dark:text-amber-400 shrink-0" />
                <p className="font-medium">
                  Only <span className="font-black">{availableSeats} seat(s)</span> left! Prices may increase soon.
                </p>
              </div>
            )}
          </div>

          {/* Duration Selector */}
          <div>
            <h3 className="text-xs font-black text-gray-900 dark:text-slate-100 uppercase tracking-wider mb-3">
              Select Price Lock Duration :
            </h3>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {lockOptions.map((opt) => {
                const isSelected = selectedOption?.id === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => { setSelectedOption(opt); setError(null); }}
                    className={`relative rounded-xl border p-3 text-center cursor-pointer select-none transition-all ${
                      isSelected
                        ? 'bg-blue-50/70 dark:bg-blue-900/30 border-blue-500 ring-1 ring-blue-500'
                        : 'bg-white dark:bg-slate-700/50 border-gray-200 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    {opt.isPopular && (
                      <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-indigo-700 text-white font-black text-[8px] uppercase tracking-wide px-2 py-0.5 rounded-full shadow-sm whitespace-nowrap">
                        Popular
                      </span>
                    )}
                    <div className="text-[11px] font-black text-gray-900 dark:text-slate-100">{opt.duration}</div>
                    <div className="text-xs font-bold text-gray-600 dark:text-slate-300 mt-1">₹{opt.fee}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Time Warning Label */}
          {selectedOption && (
            <div className="flex items-center gap-2 text-xs text-gray-700 dark:text-slate-300 font-medium">
              <Clock size={14} className="text-gray-400 dark:text-slate-500" />
              Complete your booking by <span className="font-black text-amber-600 dark:text-amber-400">{getExpiryPreview()}</span>
            </div>
          )}

          {/* Cost Summary Box */}
          {selectedOption && (
            <div className="border border-gray-200 dark:border-slate-700 rounded-xl divide-y divide-gray-100 dark:divide-slate-700 bg-white dark:bg-slate-800 overflow-hidden shadow-sm">
              {/* Row 1: Lock fee */}
              <div className="p-4 flex justify-between items-start">
                <div>
                  <h4 className="font-black text-sm text-gray-900 dark:text-slate-100">Cost of Price Lock</h4>
                  <p className="text-[11px] text-gray-400 dark:text-slate-500 font-medium max-w-[280px] mt-1 leading-tight">
                    <span className="text-red-500 dark:text-red-400 font-bold">Non-refundable</span> & not adjusted against the flight booking amount
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-base font-black text-gray-900 dark:text-slate-100">₹{selectedOption.fee.toLocaleString('en-IN')}</span>
                  <span className="block text-[10px] text-gray-400 dark:text-slate-500 font-medium mt-px">for 1 traveller</span>
                </div>
              </div>

              {/* Row 2: Locked fare */}
              <div className="p-4 flex justify-between items-center bg-gray-50/40 dark:bg-slate-700/30">
                <span className="font-black text-sm text-gray-900 dark:text-slate-100">
                  Locked Price for {selectedOption.duration}*
                </span>
                <span className="text-base font-black text-gray-900 dark:text-slate-100">
                  ₹{baseFare.toLocaleString('en-IN')}
                </span>
              </div>

              {/* Row 3: Protection info */}
              <div className="p-3 flex items-center gap-2 text-xs text-gray-500 dark:text-slate-400">
                <Shield size={14} className="text-emerald-500 dark:text-emerald-400 shrink-0" />
                <span>Fare increase protection up to <span className="font-bold text-gray-800 dark:text-slate-200">₹7,500</span> per passenger. If fare drops, you pay less.</span>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl text-xs text-red-700 dark:text-red-400 font-medium">
              <AlertTriangle size={14} className="shrink-0" />
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handleLockPrice}
            disabled={loading || !selectedOption}
            className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-blue-300 dark:disabled:bg-blue-800/50 text-white font-black text-sm py-3.5 px-6 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 group tracking-wide"
          >
            {loading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Processing...
              </>
            ) : (
              <>
                PAY ₹{selectedOption?.fee?.toLocaleString('en-IN') || '...'} AND LOCK
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>

          {/* Disclaimer */}
          <p className="text-[10px] text-center text-gray-400 dark:text-slate-500 leading-tight">
            Price Lock does not reserve a seat. If the flight sells out before you complete booking,
            the lock fee will be refunded.
          </p>

        </div>
      </div>
    </div>
  );
}