import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useBookStore } from '../../store/useBookStore';
import { useCategoryStore } from '../../store/useCategoryStore';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { 
  FiPlus, 
  FiSearch, 
  FiEdit2, 
  FiTrash2, 
  FiX, 
  FiBook, 
  FiChevronDown
} from 'react-icons/fi';

export default function Books() {
  const { books, addBook, updateBook, deleteBook } = useBookStore();
  const { categories } = useCategoryStore();
  const { user } = useAuth();
  
  const isAdmin = user && user.role === 'admin';

  // Search, filter, and sort states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStockStatus, setSelectedStockStatus] = useState('all'); // 'all', 'instock', 'outstock'
  const [sortBy, setSortBy] = useState('title-az'); // 'title-az', 'year-asc', 'year-desc'

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [currentBookId, setCurrentBookId] = useState(null);

  // react-hook-form initialization
  const { 
    register, 
    handleSubmit, 
    reset, 
    setValue,
    watch,
    formState: { errors } 
  } = useForm({
    defaultValues: {
      title: '',
      author: '',
      isbn: '',
      categoryIds: [],
      publishYear: '',
      shelfBlock: '',
      shelfRow: '',
      stock: 0
    }
  });

  const watchCategoryIds = watch('categoryIds');

  // Manually register multi-select categoryIds for hook validation
  useEffect(() => {
    register('categoryIds', { 
      validate: (val) => (val && val.length > 0) || 'En az bir kategori seçilmelidir.' 
    });
  }, [register]);

  // Filter and sort logic
  const filteredBooks = books.filter((book) => {
    const matchesSearch = 
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (book.isbn && book.isbn.includes(searchTerm));

    // Multi-category evaluation check
    const matchesCategory = 
      selectedCategory === 'all' || 
      (book.categoryIds && book.categoryIds.some((id) => String(id) === String(selectedCategory)));

    const matchesStock = 
      selectedStockStatus === 'all' ||
      (selectedStockStatus === 'instock' && Number(book.stock) > 0) ||
      (selectedStockStatus === 'outstock' && Number(book.stock) === 0);

    return matchesSearch && matchesCategory && matchesStock;
  }).sort((a, b) => {
    if (sortBy === 'title-az') {
      return a.title.localeCompare(b.title);
    }
    if (sortBy === 'year-asc') {
      return (Number(a.publishYear) || 0) - (Number(b.publishYear) || 0);
    }
    if (sortBy === 'year-desc') {
      return (Number(b.publishYear) || 0) - (Number(a.publishYear) || 0);
    }
    return 0;
  });

  // Resolve multiple category names (joined by comma)
  const getCategoryNames = (catIds = []) => {
    if (!catIds || !Array.isArray(catIds)) return 'Kategorisiz';
    const names = catIds
      .map((id) => categories.find((c) => String(c.id) === String(id))?.name)
      .filter(Boolean);
    return names.length > 0 ? names.join(', ') : 'Kategorisiz';
  };

  const openAddModal = () => {
    reset({
      title: '',
      author: '',
      isbn: '',
      categoryIds: [],
      publishYear: '',
      shelfBlock: '',
      shelfRow: '',
      stock: 0
    });
    setModalMode('add');
    setIsModalOpen(true);
  };

  const openEditModal = (book) => {
    // Split shelf string (e.g. A-12) back into block letter and row number
    const [block, row] = (book.shelfNo || '').split('-');
    
    reset({
      title: book.title,
      author: book.author,
      isbn: book.isbn || '',
      categoryIds: book.categoryIds || [],
      publishYear: book.publishYear,
      shelfBlock: block || '',
      shelfRow: row || '',
      stock: Number(book.stock) || 0
    });

    setModalMode('edit');
    setCurrentBookId(book.id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentBookId(null);
  };

  const onSubmitForm = (data) => {
    // Combine shelf block letter and row number (A-12 format)
    const combinedShelfNo = `${data.shelfBlock.toUpperCase()}-${data.shelfRow}`;

    const bookData = {
      title: data.title.trim(),
      author: data.author.trim(),
      isbn: data.isbn.trim(),
      categoryIds: data.categoryIds,
      publishYear: Number(data.publishYear),
      shelfNo: combinedShelfNo,
      stock: Number(data.stock)
    };

    if (modalMode === 'add') {
      addBook({
        id: Date.now().toString(),
        ...bookData
      });
      toast.success('Kitap başarıyla eklendi!');
    } else {
      updateBook(currentBookId, bookData);
      toast.success('Kitap başarıyla güncellendi!');
    }
    closeModal();
  };

  const handleDelete = (id, title) => {
    const confirmDelete = window.confirm(`"${title}" kitabını silmek istediğinize emin misiniz?`);
    if (!confirmDelete) return;

    deleteBook(id);
    toast.success('Kitap başarıyla silindi!');
  };

  return (
    <div className="page-container" style={styles.container}>
      {/* Header Section */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Kitap Yönetimi</h1>
          <p style={styles.subtitle}>Kütüphanedeki tüm kitapları listeleyin, düzenleyin ve yönetin.</p>
        </div>
        {isAdmin && (
          <button onClick={openAddModal} className="btn" style={styles.addButton}>
            <FiPlus style={styles.btnIcon} />
            <span>Kitap Ekle</span>
          </button>
        )}
      </div>

      {/* Advanced Filters Panel */}
      <div className="card" style={styles.filterCard}>
        <div style={styles.filterGrid}>
          {/* Search bar */}
          <div style={styles.filterCol}>
            <label style={styles.filterLabel}>Arama</label>
            <div style={styles.searchWrapper}>
              <FiSearch style={styles.searchIcon} />
              <input
                type="text"
                placeholder="Kitap adı, yazar veya ISBN..."
                style={styles.searchInput}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Category Dropdown Filter */}
          <div style={styles.filterCol}>
            <label style={styles.filterLabel}>Kategori</label>
            <div style={styles.selectWrapper}>
              <select
                style={styles.select}
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">Tüm Kategoriler</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <FiChevronDown style={styles.selectArrow} />
            </div>
          </div>

          {/* Stock Dropdown Filter */}
          <div style={styles.filterCol}>
            <label style={styles.filterLabel}>Stok Durumu</label>
            <div style={styles.selectWrapper}>
              <select
                style={styles.select}
                value={selectedStockStatus}
                onChange={(e) => setSelectedStockStatus(e.target.value)}
              >
                <option value="all">Tümü</option>
                <option value="instock">Stokta Olanlar</option>
                <option value="outstock">Tükenenler</option>
              </select>
              <FiChevronDown style={styles.selectArrow} />
            </div>
          </div>

          {/* Sorting */}
          <div style={styles.filterCol}>
            <label style={styles.filterLabel}>Sırala</label>
            <div style={styles.selectWrapper}>
              <select
                style={styles.select}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="title-az">İsme Göre (A-Z)</option>
                <option value="year-asc">Yayın Yılı (Eskiden Yeniye)</option>
                <option value="year-desc">Yayın Yılı (Yeniden Eskiye)</option>
              </select>
              <FiChevronDown style={styles.selectArrow} />
            </div>
          </div>
        </div>
      </div>

      {/* Books Table Area */}
      {filteredBooks.length > 0 ? (
        <div className="card" style={styles.tableCard}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeaderRow}>
                <th style={styles.th}>Kitap Adı</th>
                <th style={styles.th}>Yazar</th>
                <th style={styles.th}>ISBN</th>
                <th style={styles.th}>Kategoriler</th>
                <th style={styles.th}>Yıl</th>
                <th style={styles.th}>Raf No</th>
                <th style={styles.th}>Stok</th>
                {isAdmin && <th style={{ ...styles.th, textAlign: 'right' }}>İşlemler</th>}
              </tr>
            </thead>
            <tbody>
              {filteredBooks.map((book) => {
                const isOutOfStock = Number(book.stock) <= 0;
                return (
                  <tr key={book.id} style={styles.tableRow}>
                    <td style={styles.td}>
                      <div style={styles.bookTitleGroup}>
                        <div style={styles.bookIconCircle}>
                          <FiBook style={styles.bookIcon} />
                        </div>
                        <span style={styles.bookTitle}>{book.title}</span>
                      </div>
                    </td>
                    <td style={styles.td}>{book.author}</td>
                    <td style={styles.td}>
                      <span style={styles.isbnText}>{book.isbn || '-'}</span>
                    </td>
                    <td style={styles.td}>{getCategoryNames(book.categoryIds)}</td>
                    <td style={styles.td}>{book.publishYear || '-'}</td>
                    <td style={styles.td}>
                      <span style={styles.shelfText}>{book.shelfNo || '-'}</span>
                    </td>
                    <td style={styles.td}>
                      {isOutOfStock ? (
                        <span style={styles.badgeOut}>Tükendi</span>
                      ) : (
                        <span style={styles.badgeIn}>Stokta ({book.stock})</span>
                      )}
                    </td>
                    {isAdmin && (
                      <td style={{ ...styles.td, textAlign: 'right' }}>
                        <div style={styles.actionButtons}>
                          <button
                            onClick={() => openEditModal(book)}
                            style={styles.editButton}
                            title="Düzenle"
                          >
                            <FiEdit2 />
                          </button>
                          <button
                            onClick={() => handleDelete(book.id, book.title)}
                            style={styles.deleteButton}
                            title="Sil"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    )}
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
            <FiBook style={styles.emptyIcon} />
          </div>
          <h3 style={styles.emptyTitle}>Kayıt Bulunamadı</h3>
          <p style={styles.emptySubtitle}>Arama kriterlerinizle eşleşen veya kayıtlı hiçbir kitap bulunamadı.</p>
        </div>
      )}

      {/* Add / Edit Form Modal */}
      {isModalOpen && (
        <div style={styles.modalOverlay}>
          <div className="glass-panel" style={styles.modalContent}>
            {/* Modal Header */}
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>
                {modalMode === 'add' ? 'Yeni Kitap Ekle' : 'Kitap Bilgilerini Düzenle'}
              </h2>
              <button onClick={closeModal} style={styles.closeBtn}>
                <FiX />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit(onSubmitForm)} style={styles.form}>
              <div style={styles.formGrid}>
                {/* Book Title */}
                <div style={styles.formGroupFull}>
                  <label style={styles.label}>Kitap Adı *</label>
                  <input
                    type="text"
                    placeholder="Kitap başlığını giriniz"
                    style={{
                      ...styles.input,
                      borderColor: errors.title ? 'var(--error)' : 'var(--border-light)'
                    }}
                    {...register('title', { required: 'Kitap adı zorunludur.' })}
                  />
                  {errors.title && <span style={styles.errorText}>{errors.title.message}</span>}
                </div>

                {/* Author */}
                <div style={styles.formGroup}>
                  <label style={styles.label}>Yazar *</label>
                  <input
                    type="text"
                    placeholder="Yazar adını giriniz"
                    style={{
                      ...styles.input,
                      borderColor: errors.author ? 'var(--error)' : 'var(--border-light)'
                    }}
                    {...register('author', { required: 'Yazar adı zorunludur.' })}
                  />
                  {errors.author && <span style={styles.errorText}>{errors.author.message}</span>}
                </div>

                {/* ISBN */}
                <div style={styles.formGroup}>
                  <label style={styles.label}>ISBN</label>
                  <input
                    type="text"
                    placeholder="978-..."
                    style={styles.input}
                    {...register('isbn')}
                  />
                </div>

                {/* Multi-Select Category Checkboxes */}
                <div style={styles.formGroupFull}>
                  <label style={styles.label}>Kategoriler *</label>
                  <div style={styles.checkboxGrid}>
                    {categories.map((c) => (
                      <label key={c.id} style={styles.checkboxLabel}>
                        <input
                          type="checkbox"
                          value={c.id}
                          checked={(watchCategoryIds || []).includes(c.id)}
                          onChange={(e) => {
                            const current = watchCategoryIds || [];
                            const next = e.target.checked 
                              ? [...current, c.id]
                              : current.filter(id => id !== c.id);
                            setValue('categoryIds', next, { shouldValidate: true });
                          }}
                        />
                        <span style={styles.checkboxText}>{c.name}</span>
                      </label>
                    ))}
                  </div>
                  {errors.categoryIds && <span style={styles.errorText}>{errors.categoryIds.message}</span>}
                </div>

                {/* Publish Year */}
                <div style={styles.formGroup}>
                  <label style={styles.label}>Yayın Yılı *</label>
                  <input
                    type="number"
                    placeholder="örn. 2021"
                    style={{
                      ...styles.input,
                      borderColor: errors.publishYear ? 'var(--error)' : 'var(--border-light)'
                    }}
                    {...register('publishYear', { 
                      required: 'Yayın yılı zorunludur.',
                      min: { value: 1000, message: 'Geçersiz yıl.' },
                      max: { value: new Date().getFullYear(), message: 'Gelecek bir yıl girilemez.' }
                    })}
                  />
                  {errors.publishYear && <span style={styles.errorText}>{errors.publishYear.message}</span>}
                </div>

                {/* Shelf position block letter and row number */}
                <div style={styles.formGroup}>
                  <label style={styles.label}>Raf Konumu (Blok - Sıra) *</label>
                  <div style={styles.splitRow}>
                    <input
                      type="text"
                      maxLength={1}
                      placeholder="Blok (A)"
                      style={{
                        ...styles.input,
                        ...styles.blockInput,
                        borderColor: errors.shelfBlock ? 'var(--error)' : 'var(--border-light)'
                      }}
                      {...register('shelfBlock', { 
                        required: 'Blok zorunludur.',
                        pattern: { value: /^[A-Z]$/i, message: 'Harf olmalıdır.' }
                      })}
                      onInput={(e) => {
                        e.target.value = e.target.value.toUpperCase();
                        setValue('shelfBlock', e.target.value, { shouldValidate: true });
                      }}
                    />
                    <input
                      type="number"
                      placeholder="Sıra (12)"
                      style={{
                        ...styles.input,
                        ...styles.rowInput,
                        borderColor: errors.shelfRow ? 'var(--error)' : 'var(--border-light)'
                      }}
                      {...register('shelfRow', { 
                        required: 'Sıra zorunludur.',
                        min: { value: 1, message: 'En az 1 olmalıdır.' }
                      })}
                    />
                  </div>
                  {(errors.shelfBlock || errors.shelfRow) && (
                    <span style={styles.errorText}>
                      {errors.shelfBlock?.message || errors.shelfRow?.message}
                    </span>
                  )}
                </div>

                {/* Stock */}
                <div style={styles.formGroupFull}>
                  <label style={styles.label}>Stok Adedi *</label>
                  <input
                    type="number"
                    style={{
                      ...styles.input,
                      borderColor: errors.stock ? 'var(--error)' : 'var(--border-light)'
                    }}
                    {...register('stock', { 
                      required: 'Stok zorunludur.',
                      min: { value: 0, message: 'Stok adedi negatif olamaz.' }
                    })}
                  />
                  {errors.stock && <span style={styles.errorText}>{errors.stock.message}</span>}
                </div>
              </div>

              {/* Modal Actions */}
              <div style={styles.modalFooter}>
                <button type="button" onClick={closeModal} className="btn" style={styles.cancelBtn}>
                  İptal
                </button>
                <button type="submit" className="btn btn-primary" style={styles.saveBtn}>
                  Kaydet
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
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.25rem',
    fontWeight: '600',
  },
  btnIcon: {
    fontSize: '1.1rem',
  },
  filterCard: {
    padding: '1.5rem',
    marginBottom: '1.5rem',
  },
  filterGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '1rem',
  },
  filterCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
  },
  filterLabel: {
    fontSize: '0.8rem',
    fontWeight: '700',
    textTransform: 'uppercase',
    color: 'var(--text-muted)',
    letterSpacing: '0.5px',
  },
  searchWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  searchIcon: {
    position: 'absolute',
    left: '14px',
    color: 'var(--text-muted)',
    fontSize: '1.05rem',
  },
  searchInput: {
    paddingLeft: '2.5rem',
    width: '100%',
  },
  selectWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  select: {
    width: '100%',
    paddingRight: '2.5rem',
  },
  selectArrow: {
    position: 'absolute',
    right: '14px',
    color: 'var(--text-muted)',
    pointerEvents: 'none',
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
    minWidth: '950px',
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
    color: 'var(--text-main)',
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
  isbnText: {
    fontFamily: 'monospace',
    color: 'var(--text-muted)',
  },
  shelfText: {
    fontWeight: '500',
    color: 'var(--text-main)',
  },
  badgeIn: {
    background: 'rgba(16, 185, 129, 0.1)',
    color: 'var(--success)',
    padding: '0.25rem 0.6rem',
    borderRadius: '6px',
    fontSize: '0.8rem',
    fontWeight: '600',
    display: 'inline-block',
  },
  badgeOut: {
    background: 'rgba(239, 110, 110, 0.1)',
    color: 'var(--error)',
    padding: '0.25rem 0.6rem',
    borderRadius: '6px',
    fontSize: '0.8rem',
    fontWeight: '600',
    display: 'inline-block',
  },
  actionButtons: {
    display: 'inline-flex',
    gap: '0.5rem',
  },
  editButton: {
    background: 'none',
    border: '1px solid var(--border-light)',
    borderRadius: '8px',
    color: 'var(--primary)',
    padding: '0.5rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: 'none',
    transition: 'all var(--transition-fast)',
  },
  deleteButton: {
    background: 'none',
    border: '1px solid var(--border-light)',
    borderRadius: '8px',
    color: 'var(--error)',
    padding: '0.5rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: 'none',
    transition: 'all var(--transition-fast)',
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
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    background: 'rgba(0, 0, 0, 0.4)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  modalContent: {
    width: '100%',
    maxWidth: '600px',
    padding: '2rem',
    boxSizing: 'border-box',
    margin: '1rem',
    border: '1px solid var(--glass-border)',
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
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
  },
  formGroupFull: {
    gridColumn: 'span 2',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
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
  input: {
    width: '100%',
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
  checkboxGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
    gap: '0.75rem',
    maxHeight: '120px',
    overflowY: 'auto',
    padding: '0.75rem',
    border: '1px solid var(--border-light)',
    borderRadius: '8px',
    backgroundColor: 'var(--bg-input)',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    cursor: 'pointer',
    fontSize: '0.85rem',
    color: 'var(--text-main)',
  },
  checkboxText: {
    userSelect: 'none',
  },
  splitRow: {
    display: 'flex',
    gap: '0.5rem',
  },
  blockInput: {
    width: '35%',
    textAlign: 'center',
  },
  rowInput: {
    width: '65%',
  },
};
// Add responsive rules if width is small dynamically
if (typeof window !== 'undefined' && window.innerWidth < 768) {
  styles.filterGrid.gridTemplateColumns = '1fr';
}
