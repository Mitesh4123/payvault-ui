import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { transactionAPI, walletAPI } from '../api';
import './ActionPage.css';

export default function Withdraw() {
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    walletAPI.getBalance().then((r) => setBalance(r.data.data.balance));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    const amt = parseFloat(amount);
    if (!amt || amt < 1) return setError('Enter a valid amount');
    if (balance !== null && amt > balance) return setError('Insufficient balance');
    setLoading(true);
    try {
      const { data } = await transactionAPI.withdraw({ amount: amt, note });
      setSuccess(`₹${amt.toLocaleString('en-IN')} withdrawn. New balance: ₹${data.data.balance.toLocaleString('en-IN')}`);
      setAmount(''); setNote('');
      setTimeout(() => navigate('/dashboard'), 1800);
    } catch (err) {
      setError(err.response?.data?.message || 'Withdrawal failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell">
      <div className="page-content">
        <div className="page-title">Withdraw funds</div>
        <p className="page-subtitle">
          Available balance:{' '}
          <strong>₹{balance !== null ? balance.toLocaleString('en-IN') : '...'}</strong>
        </p>

        <div className="card">
          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label>Amount</label>
              <div className="input-prefix-wrapper">
                <span className="input-prefix">₹</span>
                <input className="input" type="number" min="1" placeholder="0.00"
                  value={amount} onChange={(e) => setAmount(e.target.value)} />
              </div>
            </div>
            <div className="field">
              <label>Note <span className="optional">optional</span></label>
              <input className="input" type="text" placeholder="e.g. Rent, Bills"
                value={note} onChange={(e) => setNote(e.target.value)} maxLength={100} />
            </div>
            <button className="btn btn-danger" type="submit" disabled={loading}>
              {loading ? <span className="spinner" /> : 'Withdraw'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}