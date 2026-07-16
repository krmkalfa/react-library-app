import React, { useState } from 'react';
import { useLoanStore } from '../../store/useLoanStore';
import { useBookStore } from '../../store/useBookStore';
import { useMemberStore } from '../../store/useMemberStore';
import { toast } from 'react-toastify';
import { FiRotateCcw, FiUser, FiChevronDown, FiBookOpen } from 'react-icons/fi';

export default function Returns() {
  const { loans, returnBook } = useLoanStore();
  const { books } = useBookStore();
  const { members } = useMemberStore();

  // Selected member state
  const [selectedMemberId, setSelectedMemberId] = useState('');

  // Get active loans for the selected member
  const memberActiveLoans = loans.filter(
    (l) => String(l.memberId) === String(selectedMemberId) && l.status === 'active'
  );

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

  const handleReturn = (loanId, bookTitle) => {
    const confirmReturn = window.confirm(`"${bookTitle}" kitabını iade almak istediğinize emin misiniz?`);
    if (!confirmReturn) return;

    try {
      returnBook(loanId);
      toast.success(`"${bookTitle}" kitabı başarıyla iade alındı, stok güncellendi.`);
    } catch (error) {
      toast.error(error.message || 'İade işlemi gerçekleştirilemedi.');
    }
  };

  return (
    <div className="page-container" style={styles.container}>
      {/* Header Section */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>İade İşlemleri</h1>
          <p style={styles.subtitle}>Üyelerin elindeki kitapları teslim alın ve stok durumlarını güncelleyin.</p>
        </div>
      </div>

      {/* Member Selection Panel */}
      <div className="card" style={styles.selectorCard}>
        <div style={styles.filterCol}>
          <label style={styles.filterLabel}>İşlem Yapılacak Üye</label>
          <div style={styles.selectWrapper}>
            <select
              style={styles.select}
              value={selectedMemberId}
              onChange={(e) => setSelectedMemberId(e.target.value)}
            >
              <option value="">Lütfen Bir Üye Seçin...</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.fullName} ({m.memberNo})
                </option>
              ))}
            </select>
            <FiChevronDown style={styles.selectArrow} />
          </div>
        </div>
      </div>

      {/* Returns Content Section */}
      {!selectedMemberId ? (
        /* Prompt State */
        <div className="card" style={styles.promptState}>
          <div style={styles.promptIconCircle}>
            <FiUser style={styles.promptIcon} />
          </div>
          <h3 style={styles.promptTitle}>Üye Seçimi Bekleniyor</h3>
          <p style={styles.promptSubtitle}>İade edilecek kitapları listelemek için lütfen yukarıdaki menüden bir üye seçiniz.</p>
        </div>
      ) : memberActiveLoans.length > 0 ? (
        /* Active Loans Table */
        <div className="card" style={styles.tableCard}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeaderRow}>
                <th style={styles.th}>Kitap Adı</th>
                <th style={styles.th}>Yazar</th>
                <th style={styles.th}>Ödünç Alma Tarihi</th>
                <th style={styles.th}>Son Teslim Tarihi</th>
                <th style={{ ...styles.th, textAlign: 'right' }}>İşlem</th>
              </tr>
            </thead>
            <tbody>
              {memberActiveLoans.map((loan) => {
                const bookTitle = getBookTitle(loan.bookId);
                return (
                  <tr key={loan.id} style={styles.tableRow}>
                    <td style={styles.td}>
                      <div style={styles.bookTitleGroup}>
                        <div style={styles.bookIconCircle}>
                          <FiBookOpen style={styles.bookIcon} />
                        </div>
                        <span style={styles.bookTitle}>{bookTitle}</span>
                      </div>
                    </td>
                    <td style={styles.td}>{getBookAuthor(loan.bookId)}</td>
                    <td style={styles.td}>{loan.loanDate}</td>
                    <td style={styles.td}>{loan.dueDate}</td>
                    <td style={{ ...styles.td, textAlign: 'right' }}>
                      <button
                        onClick={() => handleReturn(loan.id, bookTitle)}
                        style={styles.returnBtn}
                        className="btn"
                      >
                        <FiRotateCcw style={styles.returnBtnIcon} />
                        <span>İade Al</span>
                      </button>
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
          <h3 style={styles.emptyTitle}>Aktif Ödünç Yok</h3>
          <p style={styles.emptySubtitle}>Seçilen üyenin elinde aktif (teslim edilmemiş) hiçbir kitap bulunmamaktadır.</p>
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
  selectorCard: {
    padding: '1.5rem',
    marginBottom: '1.5rem',
  },
  filterCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    maxWidth: '400px',
  },
  filterLabel: {
    fontSize: '0.8rem',
    fontWeight: '600',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  selectWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  },
  select: {
    width: '100%',
    paddingRight: '2.5rem',
    appearance: 'none',
    WebkitAppearance: 'none',
  },
  selectArrow: {
    position: 'absolute',
    right: '12px',
    color: 'var(--text-muted)',
    pointerEvents: 'none',
    fontSize: '1.1rem',
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
  returnBtn: {
    padding: '0.5rem 1rem',
    fontSize: '0.85rem',
    background: 'var(--primary)',
    color: '#ffffff',
    gap: '0.4rem',
  },
  returnBtnIcon: {
    fontSize: '0.95rem',
  },
  promptState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '5rem 2rem',
    textAlign: 'center',
  },
  promptIconCircle: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    background: 'var(--slate-100)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1.5rem',
  },
  promptIcon: {
    color: 'var(--text-muted)',
    fontSize: '1.75rem',
  },
  promptTitle: {
    fontSize: '1.2rem',
    fontWeight: '700',
    color: 'var(--text-main)',
    marginBottom: '0.5rem',
  },
  promptSubtitle: {
    fontSize: '0.9rem',
    color: 'var(--text-muted)',
    maxWidth: '380px',
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
