import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { transactionAPI } from '../api';
import './ActionPage.css';

const QUICK_AMOUNTS = [500, 1000, 2000, 5000];

export default function Deposit() {
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!amount || parseFloat(amount) < 1) return setError('Enter a valid amount');
    setLoading(true);
    try {
      const { data } = await transactionAPI.deposit({ amount: parseFloat(amount), note });
      setSuccess(`₹${parseFloat(amount).toLocaleString('en-IN')} deposited. New balance: ₹${data.data.balance.toLocaleString('en-IN')}`);
      setAmount(''); setNote('');
      setTimeout(() => navigate('/dashboard'), 1800);
    } catch (err) {
      setError(err.response?.data?.message || 'Deposit failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell">
      <div className="page-content">
        <div className="page-title">Deposit funds</div>
        <p className="page-subtitle">Add money to your PayVault wallet</p>

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

            <div className="quick-amounts">
              {QUICK_AMOUNTS.map((a) => (
                <button key={a} type="button" className={`quick-btn ${amount == a ? 'quick-btn--active' : ''}`}
                  onClick={() => setAmount(a)}>
                  ₹{a.toLocaleString('en-IN')}
                </button>
              ))}
            </div>

            <div className="field">
              <label>Note <span className="optional">optional</span></label>
              <input className="input" type="text" placeholder="e.g. Salary, Top-up"
                value={note} onChange={(e) => setNote(e.target.value)} maxLength={100} />
            </div>

            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? <span className="spinner" /> : 'Deposit'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}