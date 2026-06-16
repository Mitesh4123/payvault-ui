import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { walletAPI } from '../api';
import { useAuth } from '../context/AuthContext';
import TransactionItem from '../components/TransactionItem';
import './Dashboard.css';

export default function Dashboard() {
  const { user } = useAuth();
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [walletRes, txRes] = await Promise.all([
          walletAPI.getBalance(),
          walletAPI.getTransactions({ limit: 5 }),
        ]);
        setWallet(walletRes.data.data);
        setTransactions(txRes.data.data.transactions);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return (
    <div className="page-shell">
      <div className="page-content">
        <div className="loading-state">Loading...</div>
      </div>
    </div>
  );

  return (
    <div className="page-shell">
      <div className="page-content page-content--wide">
        <div className="dash-greeting">Good day, {user?.name?.split(' ')[0]} 👋</div>

        {/* Balance card */}
        <div className="balance-card">
          <div className="balance-label">Available balance</div>
          <div className="balance-amount">
            ₹{wallet?.balance?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <div className="balance-meta">Wallet ID: {wallet?.walletId?.slice(0, 8)}...</div>
          <div className="balance-actions">
            <Link to="/deposit" className="bal-btn bal-btn--primary">+ Deposit</Link>
            <Link to="/withdraw" className="bal-btn bal-btn--outline">Withdraw</Link>
            <Link to="/transfer" className="bal-btn bal-btn--outline">Transfer</Link>
          </div>
        </div>

        {/* Quick stats */}
        <div className="stats-row">
          {[
            { label: 'Total deposits', type: 'deposit', sign: '+' },
            { label: 'Total withdrawn', type: 'withdraw', sign: '-' },
            { label: 'Transfers sent', type: 'transfer_debit', sign: '-' },
          ].map((s) => {
            const total = transactions
              .filter((t) => t.type === s.type)
              .reduce((sum, t) => sum + t.amount, 0);
            return (
              <div className="stat-card" key={s.type}>
                <div className="stat-label">{s.label}</div>
                <div className="stat-value">₹{total.toLocaleString('en-IN')}</div>
              </div>
            );
          })}
        </div>

        {/* Recent transactions */}
        <div className="card">
          <div className="section-head-row">
            <span className="section-head">Recent transactions</span>
            <Link to="/transactions" className="see-all">See all →</Link>
          </div>
          {transactions.length === 0 ? (
            <div className="empty-state">
              <p>No transactions yet. Make your first deposit!</p>
            </div>
          ) : (
            transactions.map((tx) => <TransactionItem key={tx._id} tx={tx} />)
          )}
        </div>
      </div>
    </div>
  );
}