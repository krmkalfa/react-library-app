import React, { useState } from 'react';
import { useLoanStore } from '../../store/useLoanStore';
import { useBookStore } from '../../store/useBookStore';
import { useAuth } from '../../context/AuthContext';
import { FiBookOpen, FiClock, FiCheckCircle } from 'react-icons/fi';

export default function MyBooks() {
  const { loans } = useLoanStore();
  const { books } = useBookStore();
  const { user } = useAuth();

  // Tab control state
  const [activeTab, setActiveTab] = useState('active'); // 'active' or 'history'

  // Retrieve active and past loans for the logged-in member
  const myLoans = loans.filter((l) => String(l.memberId) === String(user?.memberId));
  
  const myActiveLoans = myLoans.filter((l) => l.status === 'active');
  const myPastLoans = myLoans.filter((l) => l.status === 'returned');

  // Book title resolver
  const getBookTitle = (bookId) => {
    const book = books.find((b) => String(b.id) === String(bookId));
    return book ? book.title : 'Bilinmeyen Kitap';
  };

  // Book author resolver
  const getBookAuthor = (bookId) => {
    const book = books.find((b) => String(b.id) === String(bookId));
    return book ? book.author : 'Bilinmeyen Yazar';
  };

  // Calculate remaining days
  const getRemainingDaysInfo = (dueDateStr) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(dueDateStr);
    dueDate.setHours(0, 0, 0, 0);

    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return {
        text: `${Math.abs(diffDays)} gün gecikti`,
        style: styles.lateBadge
      };
    } else if (diffDays === 0) {
      return {
        text: 'Son teslim günü',
        style: styles.todayBadge
      };
    } else {
      return {
        text: `${diffDays} gün kaldı`,
        style: styles.normalBadge
      };
    }
  };

  const activeTabList = activeTab === 'active' ? myActiveLoans : myPastLoans;

  return (
    <div className="page-container" style={styles.container}>
      {/* Header Section */}
      <div style={styles.header}>
        <h1 style={styles.title}>Kitaplarım</h1>
        <p style={styles.subtitle}>Ödünç aldığınız aktif kitapları ve iade geçmişinizi görüntüleyin.</p>
      </div>

      {/* Tabs Actions Switcher */}
      <div style={styles.tabsContainer}>
        <button
          onClick={() => setActiveTab('active')}
          style={{
            ...styles.tabBtn,
            ...(activeTab === 'active' ? styles.activeTabBtn : {})
          }}
        >
          <FiClock style={styles.tabIcon} />
          <span>Ödünç Aldıklarım ({myActiveLoans.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('history')}
          style={{
            ...styles.tabBtn,
            ...(activeTab === 'history' ? styles.activeTabBtn : {})
          }}
        >
          <FiCheckCircle style={styles.tabIcon} />
          <span>Geçmiş İadelerim ({myPastLoans.length})</span>
        </button>
      </div>

      {/* List / Table Content */}
      {activeTabList.length > 0 ? (
        <div className="card" style={styles.tableCard}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeaderRow}>
                <th style={styles.th}>Kitap Adı</th>
                <th style={styles.th}>Yazar</th>
                <th style={styles.th}>Ödünç Alma Tarihi</th>
                {activeTab === 'active' ? (
                  <>
                    <th style={styles.th}>Son Teslim Tarihi</th>
                    <th style={styles.th}>Kalan Süre</th>
                  </>
                ) : (
                  <th style={styles.th}>İade Edilme Tarihi</th>
                )}
              </tr>
            </thead>
            <tbody>
              {activeTabList.map((loan) => (
                <tr key={loan.id} style={styles.tableRow}>
                  <td style={styles.td}>
                    <div style={styles.bookTitleGroup}>
                      <div style={styles.bookIconCircle}>
                        <FiBookOpen style={styles.bookIcon} />
                      </div>
                      <span style={styles.bookTitle}>{getBookTitle(loan.bookId)}</span>
                    </div>
                  </td>
                  <td style={styles.td}>{getBookAuthor(loan.bookId)}</td>
                  <td style={styles.td}>{loan.loanDate}</td>
                  {activeTab === 'active' ? (
                    <>
                      <td style={styles.td}>{loan.dueDate}</td>
                      <td style={styles.td}>
                        <span style={{ ...styles.badge, ...getRemainingDaysInfo(loan.dueDate).style }}>
                          {getRemainingDaysInfo(loan.dueDate).text}
                        </span>
                      </td>
                    </>
                  ) : (
                    <td style={styles.td}>{loan.returnDate}</td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* Empty State */
        <div className="card" style={styles.emptyState}>
          <div style={styles.emptyIconCircle}>
            <FiBookOpen style={styles.emptyIcon} />
          </div>
          <h3 style={styles.emptyTitle}>Kayıt Bulunamadı</h3>
          <p style={styles.emptySubtitle}>
            {activeTab === 'active' 
              ? 'Şu anda elinizde aktif ödünç aldığınız bir kitap bulunmamaktadır.' 
              : 'Henüz sisteme kayıtlı bir iade geçmişiniz bulunmamaktadır.'}
          </p>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  header: {
    marginBottom: '2rem',
  },
  title: {
    fontSize: '2rem',
    fontWeight: '700',
    color: 'var(--text-main)',
    letterSpacing: '-0.5px',
    marginBottom: '0.25rem',
  },
  subtitle: {
    fontSize: '0.95rem',
    color: 'var(--text-muted)',
  },
  tabsContainer: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1.5rem',
    borderBottom: '1px solid var(--border-light)',
    paddingBottom: '0.1px',
  },
  tabBtn: {
    background: 'none',
    border: 'none',
    borderBottom: '2px solid transparent',
    color: 'var(--text-muted)',
    padding: '0.85rem 1.25rem',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.6rem',
    fontSize: '0.95rem',
    fontWeight: '500',
    borderRadius: '0',
    transition: 'all var(--transition-fast)',
    boxShadow: 'none',
  },
  activeTabBtn: {
    borderBottom: '2px solid var(--primary)',
    color: 'var(--primary)',
    fontWeight: '600',
  },
  tabIcon: {
    fontSize: '1.05rem',
  },
  tableCard: {
    padding: '0',
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
    minWidth: '800px',
  },
  tableHeaderRow: {
    borderBottom: '1px solid var(--border-light)',
    background: 'rgba(99, 102, 241, 0.02)',
  },
  th: {
    padding: '1.2rem 1.5rem',
    fontSize: '0.85rem',
    fontWeight: '700',
    textTransform: 'uppercase',
    color: 'var(--text-muted)',
    letterSpacing: '0.5px',
  },
  tableRow: {
    borderBottom: '1px solid var(--border-light)',
    transition: 'background var(--transition-fast)',
  },
  td: {
    padding: '1.2rem 1.5rem',
    verticalAlign: 'middle',
    fontSize: '0.95rem',
  },
  bookTitleGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  bookIconCircle: {
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    background: 'var(--primary-glow)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookIcon: {
    color: 'var(--primary)',
    fontSize: '1.1rem',
  },
  bookTitle: {
    fontWeight: '600',
    color: 'var(--text-main)',
  },
  badge: {
    padding: '0.25rem 0.6rem',
    borderRadius: '6px',
    fontSize: '0.8rem',
    fontWeight: '600',
    display: 'inline-block',
  },
  normalBadge: {
    background: 'rgba(99, 102, 241, 0.1)',
    color: 'var(--primary)',
  },
  todayBadge: {
    background: 'rgba(245, 158, 11, 0.1)',
    color: 'var(--warning)',
  },
  lateBadge: {
    background: 'rgba(239, 110, 110, 0.1)',
    color: 'var(--error)',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4rem 2rem',
    textAlign: 'center',
  },
  emptyIconCircle: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    background: 'var(--slate-100)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1.5rem',
  },
  emptyIcon: {
    color: 'var(--text-muted)',
    fontSize: '1.75rem',
  },
  emptyTitle: {
    fontSize: '1.2rem',
    fontWeight: '700',
    color: 'var(--text-main)',
    marginBottom: '0.5rem',
  },
  emptySubtitle: {
    fontSize: '0.9rem',
    color: 'var(--text-muted)',
    maxWidth: '360px',
  },
};
