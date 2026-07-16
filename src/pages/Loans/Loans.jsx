import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLoanStore } from '../../store/useLoanStore';
import { useBookStore } from '../../store/useBookStore';
import { useMemberStore } from '../../store/useMemberStore';
import { toast } from 'react-toastify';
import { 
  FiPlus, 
  FiSearch, 
  FiBookOpen, 
  FiX, 
  FiCalendar, 
  FiUser, 
  FiChevronDown 
} from 'react-icons/fi';

export default function Loans() {
  const { loans, createLoan } = useLoanStore();
  const { books } = useBookStore();
  const { members } = useMemberStore();

  // Search state
  const [searchTerm, setSearchTerm] = useState('');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);

  // react-hook-form initialization
  const { 
    register, 
    handleSubmit, 
    reset,
    formState: { errors } 
  } = useForm({
    defaultValues: {
      bookId: '',
      memberId: '',
      dueDate: ''
    }
  });

  // Filter books in stock for the dropdown
  const availableBooks = books.filter((b) => Number(b.stock) > 0);

  // Filter active loans (status === 'active')
  const activeLoans = loans.filter((l) => l.status === 'active');

  // Book name resolver
  const getBookTitle = (bookId) => {
    const book = books.find((b) => String(b.id) === String(bookId));
    return book ? book.title : 'Bilinmeyen Kitap';
  };

  // Member name resolver
  const getMemberName = (memberId) => {
    const member = members.find((m) => String(m.id) === String(memberId));
    return member ? member.fullName : 'Bilinmeyen Üye';
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
        isLate: true,
        style: styles.lateText
      };
    } else if (diffDays === 0) {
      return {
        text: 'Son gün',
        isLate: false,
        style: styles.todayText
      };
    } else {
      return {
        text: `${diffDays} gün kaldı`,
        isLate: false,
        style: styles.normalText
      };
    }
  };

  // Filter list based on search term
  const filteredLoans = activeLoans.filter((loan) => {
    const searchString = searchTerm.toLowerCase();
    const bookTitle = getBookTitle(loan.bookId).toLowerCase();
    const memberName = getMemberName(loan.memberId).toLowerCase();
    return bookTitle.includes(searchString) || memberName.includes(searchString);
  });

  const openAddModal = () => {
    reset({
      bookId: '',
      memberId: '',
      dueDate: ''
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const onSubmitForm = (data) => {
    try {
      createLoan({
        bookId: data.bookId,
        memberId: data.memberId,
        dueDate: data.dueDate
      });
      toast.success('Kitap başarıyla ödünç verildi!');
      closeModal();
    } catch (error) {
      toast.error(error.message || 'Ödünç verme işlemi başarısız.');
    }
  };

  // Calculate minimum date for the due date input (today)
  const getMinDueDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  return (
    <div className="page-container" style={styles.container}>
      {/* Header Section */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Ödünç Verme İşlemleri</h1>
          <p style={styles.subtitle}>Üyelere kitap ödünç verin ve aktif kayıtları takip edin.</p>
        </div>
        <button onClick={openAddModal} className="btn" style={styles.addButton}>
          <FiPlus style={styles.btnIcon} />
          <span>Kitap Ödünç Ver</span>
        </button>
      </div>

      {/* Control Actions Bar */}
      <div className="card" style={styles.actionBar}>
        <div style={styles.searchWrapper}>
          <FiSearch style={styles.searchIcon} />
          <input
            type="text"
            placeholder="Kitap adı veya üye adı ile ara..."
            style={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Active Loans Table */}
      {filteredLoans.length > 0 ? (
        <div className="card" style={styles.tableCard}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeaderRow}>
                <th style={styles.th}>Kitap Adı</th>
                <th style={styles.th}>Ödünç Alan Üye</th>
                <th style={styles.th}>Ödünç Tarihi</th>
                <th style={styles.th}>Son Teslim Tarihi</th>
                <th style={styles.th}>Kalan Süre</th>
              </tr>
            </thead>
            <tbody>
              {filteredLoans.map((loan) => {
                const remaining = getRemainingDaysInfo(loan.dueDate);
                return (
                  <tr key={loan.id} style={styles.tableRow}>
                    <td style={styles.td}>
                      <div style={styles.bookTitleGroup}>
                        <div style={styles.bookIconCircle}>
                          <FiBookOpen style={styles.bookIcon} />
                        </div>
                        <span style={styles.bookTitle}>{getBookTitle(loan.bookId)}</span>
                      </div>
                    </td>
                    <td style={styles.td}>{getMemberName(loan.memberId)}</td>
                    <td style={styles.td}>{loan.loanDate}</td>
                    <td style={styles.td}>{loan.dueDate}</td>
                    <td style={styles.td}>
                      <span style={{ ...styles.badge, ...remaining.style }}>
                        {remaining.text}
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
          <h3 style={styles.emptyTitle}>Kayıt Bulunamadı</h3>
          <p style={styles.emptySubtitle}>Aramanızla eşleşen veya aktif ödünç verilmiş kitap bulunamadı.</p>
        </div>
      )}

      {/* Add / Borrow Form Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={styles.modalContent}>
            {/* Modal Header */}
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Kitap Ödünç Ver</h2>
              <button onClick={closeModal} style={styles.closeBtn}>
                <FiX />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit(onSubmitForm)} style={styles.form}>
              {/* Book Selection */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Ödünç Verilecek Kitap *</label>
                <div style={styles.selectWrapper}>
                  <select
                    style={{
                      ...styles.select,
                      borderColor: errors.bookId ? 'var(--error)' : 'var(--border-light)'
                    }}
                    {...register('bookId', { required: 'Lütfen bir kitap seçiniz.' })}
                  >
                    <option value="">Kitap Seçin...</option>
                    {availableBooks.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.title} (Mevcut Stok: {b.stock})
                      </option>
                    ))}
                  </select>
                  <FiChevronDown style={styles.selectArrow} />
                </div>
                {errors.bookId && <span style={styles.errorText}>{errors.bookId.message}</span>}
              </div>

              {/* Member Selection */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Ödünç Alacak Üye *</label>
                <div style={styles.selectWrapper}>
                  <select
                    style={{
                      ...styles.select,
                      borderColor: errors.memberId ? 'var(--error)' : 'var(--border-light)'
                    }}
                    {...register('memberId', { required: 'Lütfen bir üye seçiniz.' })}
                  >
                    <option value="">Üye Seçin...</option>
                    {members.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.fullName} ({m.memberNo})
                      </option>
                    ))}
                  </select>
                  <FiChevronDown style={styles.selectArrow} />
                </div>
                {errors.memberId && <span style={styles.errorText}>{errors.memberId.message}</span>}
              </div>

              {/* Due Date */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Son Teslim Tarihi *</label>
                <div style={styles.inputWrapper}>
                  <input
                    type="date"
                    min={getMinDueDate()}
                    style={{
                      ...styles.input,
                      borderColor: errors.dueDate ? 'var(--error)' : 'var(--border-light)'
                    }}
                    {...register('dueDate', { required: 'Son teslim tarihi zorunludur.' })}
                  />
                </div>
                {errors.dueDate && <span style={styles.errorText}>{errors.dueDate.message}</span>}
              </div>

              {/* Modal Footer actions */}
              <div style={styles.modalFooter}>
                <button type="button" onClick={closeModal} style={styles.cancelBtn}>
                  Vazgeç
                </button>
                <button type="submit" style={styles.saveBtn}>
                  Ödünç Ver
                </button>
              </div>
            </form>
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
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  addButton: {
    gap: '0.5rem',
    fontWeight: '600',
  },
  btnIcon: {
    fontSize: '1.1rem',
  },
  actionBar: {
    padding: '1rem',
    marginBottom: '1.5rem',
    display: 'flex',
    alignItems: 'center',
  },
  searchWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    maxWidth: '400px',
  },
  searchIcon: {
    position: 'absolute',
    left: '12px',
    color: 'var(--text-muted)',
    fontSize: '1.05rem',
  },
  searchInput: {
    paddingLeft: '2.5rem',
    width: '100%',
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
  normalText: {
    background: 'rgba(99, 102, 241, 0.1)',
    color: 'var(--primary)',
  },
  todayText: {
    background: 'rgba(245, 158, 11, 0.1)',
    color: 'var(--warning)',
  },
  lateText: {
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
  modalContent: {
    width: '100%',
    maxWidth: '500px',
    padding: '2rem',
    boxSizing: 'border-box',
    margin: '1rem',
    borderRadius: '12px',
  },
  modalHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '1.5rem',
  },
  modalTitle: {
    fontSize: '1.35rem',
    fontWeight: '700',
    color: 'var(--text-main)',
    letterSpacing: '-0.3px',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    padding: '0.25rem',
    borderRadius: '50%',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.25rem',
    boxShadow: 'none',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
  },
  label: {
    fontSize: '0.85rem',
    fontWeight: '600',
    color: 'var(--text-main)',
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  input: {
    width: '100%',
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
  errorText: {
    fontSize: '0.8rem',
    color: 'var(--error)',
    marginTop: '2px',
  },
  modalFooter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: '0.75rem',
    marginTop: '0.5rem',
  },
  cancelBtn: {
    background: 'none',
    border: '1px solid var(--border-light)',
    color: 'var(--text-main)',
    padding: '0.6rem 1.2rem',
    boxShadow: 'none',
  },
  saveBtn: {
    padding: '0.6rem 1.2rem',
  },
};
