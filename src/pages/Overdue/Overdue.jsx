import React from 'react';
import { useLoanStore } from '../../store/useLoanStore';
import { useBookStore } from '../../store/useBookStore';
import { useMemberStore } from '../../store/useMemberStore';
import { FiAlertTriangle, FiBookOpen } from 'react-icons/fi';

export default function Overdue() {
  const { loans } = useLoanStore();
  const { books } = useBookStore();
  const { members } = useMemberStore();

  // Find today's date formatted to calculate overdue status
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Filter overdue loans
  const overdueLoans = loans.filter((loan) => {
    if (loan.status !== 'active' || loan.returnDate !== null) return false;
    const dueDate = new Date(loan.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate.getTime() < today.getTime();
  });

  // Book title resolver
  const getBookTitle = (bookId, loan) => {
    const book = books.find((b) => String(b.id) === String(bookId));
    return book ? book.title : (loan?.bookTitle || 'Bilinmeyen Kitap');
  };

  // Member resolver
  const getMemberData = (memberId, loan) => {
    const member = members.find((m) => String(m.id) === String(memberId));
    return member ? member : { fullName: loan?.memberName || 'Bilinmeyen Üye', phone: '-', email: '-' };
  };

  // Calculate delay in days
  const getOverdueDays = (dueDateStr) => {
    const dueDate = new Date(dueDateStr);
    dueDate.setHours(0, 0, 0, 0);
    const diffTime = today.getTime() - dueDate.getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="page-container" style={styles.container}>
      {/* Header Section */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Geciken Kitaplar</h1>
          <p style={styles.subtitle}>Teslim tarihi geçmiş ve henüz iade edilmemiş kitapları ve üye iletişim bilgilerini takip edin.</p>
        </div>
      </div>

      {/* Overdue Loans Content */}
      {overdueLoans.length > 0 ? (
        <div className="card" style={styles.tableCard}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeaderRow}>
                <th style={styles.th}>Kitap Adı</th>
                <th style={styles.th}>Üye Adı</th>
                <th style={styles.th}>İletişim Bilgileri</th>
                <th style={styles.th}>Son Teslim Tarihi</th>
                <th style={styles.th}>Gecikme Süresi</th>
              </tr>
            </thead>
            <tbody>
              {overdueLoans.map((loan) => {
                const member = getMemberData(loan.memberId, loan);
                const delayDays = getOverdueDays(loan.dueDate);
                return (
                  <tr key={loan.id} style={styles.tableRow}>
                    <td style={styles.td}>
                      <div style={styles.bookTitleGroup}>
                        <div style={styles.alertIconCircle}>
                          <FiAlertTriangle style={styles.alertIcon} />
                        </div>
                        <span style={styles.bookTitle}>{getBookTitle(loan.bookId, loan)}</span>
                      </div>
                    </td>
                    <td style={styles.td}>{member.fullName}</td>
                    <td style={styles.td}>
                      <div style={styles.contactGroup}>
                        <span style={styles.contactPhone}>{member.phone}</span>
                        <span style={styles.contactEmail}>{member.email}</span>
                      </div>
                    </td>
                    <td style={styles.td}>{loan.dueDate}</td>
                    <td style={styles.td}>
                      <span style={styles.lateBadge}>
                        {delayDays} gün gecikti
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        /* Empty State */
        <div className="card" style={styles.emptyState}>
          <div style={styles.emptyIconCircle}>
            <FiBookOpen style={styles.emptyIcon} />
          </div>
          <h3 style={styles.emptyTitle}>Geciken Kitap Yok</h3>
          <p style={styles.emptySubtitle}>Harika! Kütüphanemizde teslim süresi geçmiş aktif hiçbir ödünç kaydı bulunmamaktadır.</p>
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
    background: 'rgba(239, 68, 68, 0.02)',
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
  alertIconCircle: {
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    background: 'rgba(239, 110, 110, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertIcon: {
    color: 'var(--error)',
    fontSize: '1.1rem',
  },
  bookTitle: {
    fontWeight: '600',
    color: 'var(--text-main)',
  },
  contactGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.2rem',
  },
  contactPhone: {
    fontWeight: '600',
    color: 'var(--text-main)',
    fontSize: '0.9rem',
  },
  contactEmail: {
    color: 'var(--text-muted)',
    fontSize: '0.85rem',
  },
  lateBadge: {
    background: 'rgba(239, 110, 110, 0.15)',
    color: 'var(--error)',
    padding: '0.35rem 0.75rem',
    borderRadius: '8px',
    fontSize: '0.85rem',
    fontWeight: '700',
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
    background: 'rgba(16, 185, 129, 0.08)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1.5rem',
  },
  emptyIcon: {
    color: 'var(--success)',
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
