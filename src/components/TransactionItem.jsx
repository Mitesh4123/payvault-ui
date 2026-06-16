import './TransactionItem.css';

const typeConfig = {
  deposit: { label: 'Deposit', sign: '+', color: 'var(--success)', badgeClass: 'badge-deposit' },
  withdraw: { label: 'Withdraw', sign: '-', color: 'var(--danger)', badgeClass: 'badge-withdraw' },
  transfer_debit: { label: 'Sent', sign: '-', color: 'var(--danger)', badgeClass: 'badge-withdraw' },
  transfer_credit: { label: 'Received', sign: '+', color: 'var(--success)', badgeClass: 'badge-deposit' },
};

export default function TransactionItem({ tx }) {
  const config = typeConfig[tx.type] || { label: tx.type, sign: '', color: 'var(--gray-800)', badgeClass: '' };
  const date = new Date(tx.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
  const time = new Date(tx.createdAt).toLocaleTimeString('en-IN', {
    hour: '2-digit', minute: '2-digit',
  });

  return (
    <div className="tx-item">
      <div className="tx-icon-wrap">
        <span className="tx-icon">{config.sign === '+' ? '↓' : '↑'}</span>
      </div>
      <div className="tx-info">
        <div className="tx-top">
          <span className="tx-label">{tx.note || config.label}</span>
          <span className="tx-amount" style={{ color: config.color }}>
            {config.sign}₹{tx.amount.toLocaleString('en-IN')}
          </span>
        </div>
        <div className="tx-bottom">
          <span className={`badge ${config.badgeClass}`}>{config.label}</span>
          <span className="tx-date">{date} · {time}</span>
          <span className="tx-balance">Balance: ₹{tx.balanceAfter.toLocaleString('en-IN')}</span>
        </div>
      </div>
    </div>
  );
}