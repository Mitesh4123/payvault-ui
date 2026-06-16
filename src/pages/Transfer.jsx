import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { transactionAPI } from '../api';
import './ActionPage.css';

const THRESHOLD = 1000;

export default function Transfer() {
  const [step, setStep] = useState(1); // 1: form, 2: otp
  const [form, setForm] = useState({ recipient: '', amount: '', note: '' });
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const needsOTP = parseFloat(form.amount) >= THRESHOLD;

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.recipient) return setError('Enter recipient phone or email');
    if (!form.amount || parseFloat(form.amount) < 1) return setError('Enter a valid amount');

    if (needsOTP) {
      setLoading(true);
      try {
        await transactionAPI.requestOTP({ amount: parseFloat(form.amount) });
        setStep(2);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to send OTP');
      } finally {
        setLoading(false);
      }
    } else {
      await submitTransfer();
    }
  };

  const submitTransfer = async (otpCode) => {
    setLoading(true);
    setError('');
    try {
      const payload = {
        recipient: form.recipient,
        amount: parseFloat(form.amount),
        note: form.note,
      };
      if (otpCode) payload.otp = otpCode;
      const { data } = await transactionAPI.transfer(payload);
      setSuccess(`₹${parseFloat(form.amount).toLocaleString('en-IN')} sent to ${data.data.recipient.name}`);
      setTimeout(() => navigate('/dashboard'), 1800);
    } catch (err) {
      setError(err.response?.data?.message || 'Transfer failed');
      setStep(1);
    } finally {
      setLoading(false);
    }
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) return setError('Enter the 6-digit OTP');
    await submitTransfer(otp);
  };

  return (
    <div className="page-shell">
      <div className="page-content">
        <div className="page-title">Send money</div>
        <p className="page-subtitle">Transfer to any PayVault user instantly</p>

        <div className="card">
          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          {step === 1 && (
            <form onSubmit={handleFormSubmit}>
              <div className="field">
                <label>Recipient</label>
                <input className="input" type="text" placeholder="Phone number or email"
                  value={form.recipient} onChange={(e) => setForm({ ...form, recipient: e.target.value })} />
              </div>
              <div className="field">
                <label>Amount</label>
                <div className="input-prefix-wrapper">
                  <span className="input-prefix">₹</span>
                  <input className="input" type="number" min="1" placeholder="0.00"
                    value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
                </div>
                {needsOTP && (
                  <p className="field-hint">⚡ OTP required for transfers above ₹{THRESHOLD.toLocaleString('en-IN')}</p>
                )}
              </div>
              <div className="field">
                <label>Note <span className="optional">optional</span></label>
                <input className="input" type="text" placeholder="e.g. Dinner, Rent split"
                  value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} maxLength={100} />
              </div>
              <button className="btn btn-primary" type="submit" disabled={loading}>
                {loading ? <span className="spinner" /> : needsOTP ? 'Send OTP & Continue' : 'Transfer'}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleOTPSubmit}>
              <div className="otp-header">
                <div className="otp-icon">🔐</div>
                <div className="otp-title">Enter OTP</div>
                <div className="otp-desc">
                  Check your server logs for the 6-digit OTP to confirm transfer of{' '}
                  <strong>₹{parseFloat(form.amount).toLocaleString('en-IN')}</strong>
                </div>
              </div>
              <div className="field">
                <label>OTP</label>
                <input className="input otp-input" type="text" inputMode="numeric"
                  maxLength={6} placeholder="••••••"
                  value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} />
              </div>
              <button className="btn btn-primary" type="submit" disabled={loading}>
                {loading ? <span className="spinner" /> : 'Confirm transfer'}
              </button>
              <button type="button" className="btn btn-outline" style={{ marginTop: 8 }}
                onClick={() => { setStep(1); setError(''); setOtp(''); }}>
                Back
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}