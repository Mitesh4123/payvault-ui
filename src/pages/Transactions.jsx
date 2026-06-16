import { useState, useEffect } from 'react';
import { walletAPI } from '../api';
import TransactionItem from '../components/TransactionItem';
import './Transactions.css';

const TYPES = [
  { value: '', label: 'All' },
  { value: 'deposit', label: 'Deposits' },
  { value: 'withdraw', label: 'Withdrawals' },
  { value: 'transfer_debit', label: 'Sent' },
  { value: 'transfer_credit', label: 'Received' },
];

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    setLoading(true);
    walletAPI.getTransactions({ type, page, limit: 10 })
      .then((r) => {
        setTransactions(r.data.data.transactions);
        setPagination(r.data.data.pagination);
      })
      .finally(() => setLoading(false));
  }, [type, page]);

  const handleTypeChange = (t) => {
    setType(t);
    setPage(1);
  };

  return (
    <div className="page-shell">
      <div className="page-content page-content--wide">
        <div className="page-title">Transaction history</div>
        <p className="page-subtitle">All your wallet activity in one place</p>

        {/* Filter tabs */}
        <div className="filter-tabs">
          {TYPES.map((t) => (
            <button
              key={t.value}
              className={`filter-tab ${type === t.value ? 'filter-tab--active' : ''}`}
              onClick={() => handleTypeChange(t.value)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="card">
          {loading ? (
            <div className="empty-state"><p>Loading...</p></div>
          ) : transactions.length === 0 ? (
            <div className="empty-state">
              <p>No transactions found.</p>
            </div>
          ) : (
            transactions.map((tx) => <TransactionItem key={tx._id} tx={tx} />)
          )}
        </div>

        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <div className="pagination">
            <button className="btn btn-outline btn-sm"
              disabled={page === 1} onClick={() => setPage(page - 1)}>
              ← Prev
            </button>
            <span className="page-info">Page {page} of {pagination.pages}</span>
            <button className="btn btn-outline btn-sm"
              disabled={page === pagination.pages} onClick={() => setPage(page + 1)}>
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}