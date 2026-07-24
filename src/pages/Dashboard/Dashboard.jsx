import React from 'react';
import { useBookStore } from '../../store/useBookStore';
import { useMemberStore } from '../../store/useMemberStore';
import { useCategoryStore } from '../../store/useCategoryStore';
import { useLoanStore } from '../../store/useLoanStore';
import { useAuth } from '../../context/AuthContext';
import { 
  FiBook, 
  FiUsers, 
  FiLayers, 
  FiTrendingUp, 
  FiClock, 
  FiAlertTriangle, 
  FiCalendar 
} from 'react-icons/fi';

export default function Dashboard() {
  const { books } = useBookStore();
  const { members } = useMemberStore();
  const { categories } = useCategoryStore();
  const { loans } = useLoanStore();
  const { user } = useAuth();

  const isAdmin = user && user.role === 'admin';

  // Find today's date formatted to calculate overdue status
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Calculations
  const totalBooksCount = books.length;
  const totalMembersCount = members.length;
  const totalCategoriesCount = categories.length;

  const totalStockCount = books.reduce((acc, book) => acc + (Number(book.stock) || 0), 0);
  
  const activeLoans = loans.filter((l) => l.status === 'active');
  const activeLoansCount = activeLoans.length;

  const overdueLoans = loans.filter((l) => {
    if (l.status !== 'active' || l.returnDate !== null) return false;
    const dueDate = new Date(l.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate.getTime() < today.getTime();
  });
  const overdueLoansCount = overdueLoans.length;

  // Last 5 loans (reversed)
  const last5Loans = [...loans].slice(-5).reverse();
  
  // Last 5 registered members (reversed)
  const last5Members = [...members].slice(-5).reverse();

  // Helper title resolvers for lists
  const getBookTitle = (bookId, loan) => {
    const book = books.find((b) => String(b.id) === String(bookId));
    return book ? book.title : (loan?.bookTitle || 'Bilinmeyen Kitap');
  };

  const getMemberName = (memberId, loan) => {
    const member = members.find((m) => String(m.id) === String(memberId));
    return member ? member.fullName : (loan?.memberName || 'Bilinmeyen Üye');
  };

  const statCards = [
    {
      title: 'Toplam Kitap',
      value: totalBooksCount,
      icon: FiBook,
      gradient: 'linear-gradient(135deg, #6366f1, #4f46e5)',
    },
    {
      title: 'Toplam Üye',
      value: totalMembersCount,
      icon: FiUsers,
      gradient: 'linear-gradient(135deg, #ec4899, #db2777)',
    },
    {
      title: 'Toplam Kategori',
      value: totalCategoriesCount,
      icon: FiLayers,
      gradient: 'linear-gradient(135deg, #14b8a6, #0d9488)',
    },
    {
      title: 'Kütüphane Toplam Stok',
      value: totalStockCount,
      icon: FiTrendingUp,
      gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
    },
    {
      title: 'Ödünç Verilenler',
      value: activeLoansCount,
      icon: FiClock,
      gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
    },
    {
      title: 'Gecikmedeki Kitaplar',
      value: overdueLoansCount,
      icon: FiAlertTriangle,
      gradient: 'linear-gradient(135deg, #ef4444, #dc2626)',
    },
  ];

  return (
    <div className="page-container" style={styles.container}>
      {/* Header section */}
      <div style={styles.header}>
        <h1 style={styles.title}>Dashboard</h1>
        <p style={styles.subtitle}>Kütüphane yönetim sisteminizin anlık durumuna göz atın.</p>
      </div>

      {/* KPI Cards Grid */}
      <div style={styles.statsGrid}>
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} style={{ ...styles.card, background: card.gradient }}>
              <div style={styles.cardHeader}>
                <span style={styles.cardTitle}>{card.title}</span>
                <div style={styles.cardIconWrapper}>
                  <Icon style={styles.cardIcon} />
                </div>
              </div>
              <span style={styles.cardValue}>{card.value}</span>
            </div>
          );
        })}
      </div>

      {/* Lists Section (Visible only to Admin role) */}
      {isAdmin && (
        <div style={styles.listsGrid}>
          {/* Son Ödünç Verilenler */}
          <div className="card" style={styles.listCard}>
            <div style={styles.listHeader}>
              <FiClock style={styles.listHeaderIcon} />
              <h2 style={styles.listTitle}>Son Ödünç İşlemleri (Son 5)</h2>
            </div>
            {last5Loans.length > 0 ? (
              <table style={styles.table}>
                <thead>
                  <tr style={styles.tableHeaderRow}>
                    <th style={styles.th}>Kitap</th>
                    <th style={styles.th}>Üye</th>
                    <th style={styles.th}>Tarih</th>
                    <th style={styles.th}>Durum</th>
                  </tr>
                </thead>
                <tbody>
                  {last5Loans.map((loan) => (
                    <tr key={loan.id} style={styles.tableRow}>
                      <td style={styles.td}>{getBookTitle(loan.bookId, loan)}</td>
                      <td style={styles.td}>{getMemberName(loan.memberId, loan)}</td>
                      <td style={styles.td}>{loan.loanDate}</td>
                      <td style={styles.td}>
                        {loan.status === 'active' ? (
                          <span style={styles.badgeActive}>Ödünçte</span>
                        ) : (
                          <span style={styles.badgeReturned}>İade Edildi</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={styles.emptyList}>
                <p>Henüz hiçbir ödünç işlemi kaydedilmemiş.</p>
              </div>
            )}
          </div>

          {/* Son Kaydolan Üyeler */}
          <div className="card" style={styles.listCard}>
            <div style={styles.listHeader}>
              <FiUsers style={styles.listHeaderIcon} />
              <h2 style={styles.listTitle}>Son Kaydolan Üyeler (Son 5)</h2>
            </div>
            {last5Members.length > 0 ? (
              <table style={styles.table}>
                <thead>
                  <tr style={styles.tableHeaderRow}>
                    <th style={styles.th}>Üye</th>
                    <th style={styles.th}>Üye No</th>
                    <th style={styles.th}>Kayıt Tarihi</th>
                  </tr>
                </thead>
                <tbody>
                  {last5Members.map((member) => (
                    <tr key={member.id} style={styles.tableRow}>
                      <td style={styles.td}>{member.fullName}</td>
                      <td style={styles.td}>
                        <span style={styles.monoBadge}>{member.memberNo}</span>
                      </td>
                      <td style={styles.td}>{member.registryDate || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={styles.emptyList}>
                <p>Henüz kayıtlı üye bulunmamaktadır.</p>
              </div>
            )}
          </div>
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
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2.5rem',
  },
  card: {
    padding: '1.5rem',
    borderRadius: '16px',
    color: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    minHeight: '130px',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.05)',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: '0.9rem',
    fontWeight: '600',
    opacity: 0.85,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  cardIconWrapper: {
    width: '38px',
    height: '38px',
    borderRadius: '10px',
    background: 'rgba(255, 255, 255, 0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardIcon: {
    fontSize: '1.15rem',
  },
  cardValue: {
    fontSize: '2.25rem',
    fontWeight: '700',
  },
  listsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))',
    gap: '1.5rem',
  },
  listCard: {
    padding: '1.5rem',
  },
  listHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '1.25rem',
    paddingBottom: '0.75rem',
    borderBottom: '1px solid var(--border-light)',
  },
  listHeaderIcon: {
    fontSize: '1.25rem',
    color: 'var(--primary)',
  },
  listTitle: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: 'var(--text-main)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
  },
  tableHeaderRow: {
    borderBottom: '1px solid var(--border-light)',
  },
  th: {
    padding: '0.75rem 1rem',
    fontSize: '0.8rem',
    fontWeight: '700',
    textTransform: 'uppercase',
    color: 'var(--text-muted)',
    letterSpacing: '0.5px',
  },
  tableRow: {
    borderBottom: '1px solid var(--border-light)',
  },
  td: {
    padding: '0.85rem 1rem',
    verticalAlign: 'middle',
    fontSize: '0.9rem',
    color: 'var(--text-main)',
  },
  badgeActive: {
    background: 'rgba(99, 102, 241, 0.12)',
    color: 'var(--primary)',
    padding: '0.2rem 0.5rem',
    borderRadius: '4px',
    fontSize: '0.75rem',
    fontWeight: '600',
  },
  badgeReturned: {
    background: 'rgba(16, 185, 129, 0.12)',
    color: 'var(--success)',
    padding: '0.2rem 0.5rem',
    borderRadius: '4px',
    fontSize: '0.75rem',
    fontWeight: '600',
  },
  monoBadge: {
    fontFamily: 'monospace',
    fontWeight: '600',
    color: 'var(--text-muted)',
  },
  emptyList: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
    color: 'var(--text-muted)',
    fontSize: '0.9rem',
  },
};
// Add responsive rules for list grid on mobile
if (typeof window !== 'undefined' && window.innerWidth < 1024) {
  styles.listsGrid.gridTemplateColumns = '1fr';
}
