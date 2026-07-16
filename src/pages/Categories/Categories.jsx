import React, { useState } from 'react';
import { useCategoryStore } from '../../store/useCategoryStore';
import { toast } from 'react-toastify';
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiX, FiFolder } from 'react-icons/fi';

export default function Categories() {
  const { categories, addCategory, updateCategory, deleteCategory } = useCategoryStore();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [currentCategoryId, setCurrentCategoryId] = useState(null);
  
  // Form states
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [formErrors, setFormErrors] = useState({});

  // Filter categories based on search term
  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.description && c.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const openAddModal = () => {
    setFormData({ name: '', description: '' });
    setFormErrors({});
    setModalMode('add');
    setIsModalOpen(true);
  };

  const openEditModal = (category) => {
    setFormData({ name: category.name, description: category.description || '' });
    setFormErrors({});
    setModalMode('edit');
    setCurrentCategoryId(category.id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentCategoryId(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear validation error when typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = 'Kategori adı zorunludur.';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (modalMode === 'add') {
      const newCategory = {
        id: Date.now().toString(),
        name: formData.name.trim(),
        description: formData.description.trim(),
      };
      addCategory(newCategory);
      toast.success('Kategori başarıyla eklendi!');
    } else {
      updateCategory(currentCategoryId, {
        name: formData.name.trim(),
        description: formData.description.trim(),
      });
      toast.success('Kategori başarıyla güncellendi!');
    }
    closeModal();
  };

  const handleDelete = (id, name) => {
    const confirmDelete = window.confirm(`"${name}" kategorisini silmek istediğinize emin misiniz?`);
    if (!confirmDelete) return;

    try {
      deleteCategory(id);
      toast.success('Kategori başarıyla silindi!');
    } catch (error) {
      // Catch validation rule if category contains linked books
      toast.error('Bu kategoriye ait aktif kitaplar bulunduğundan silinemez!', {
        position: 'top-right',
        autoClose: 4000,
      });
    }
  };

  return (
    <div className="page-container" style={styles.container}>
      {/* Header Section */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Kategori Yönetimi</h1>
          <p style={styles.subtitle}>Kitap kategorilerini ekleyin, güncelleyin ve yönetin.</p>
        </div>
        <button onClick={openAddModal} className="btn" style={styles.addButton}>
          <FiPlus style={styles.btnIcon} />
          <span>Kategori Ekle</span>
        </button>
      </div>

      {/* Control Actions Bar */}
      <div className="card" style={styles.actionBar}>
        <div style={styles.searchWrapper}>
          <FiSearch style={styles.searchIcon} />
          <input
            type="text"
            placeholder="Kategori adı veya açıklama ile ara..."
            style={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Categories Content List / Table */}
      {filteredCategories.length > 0 ? (
        <div className="card" style={styles.tableCard}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeaderRow}>
                <th style={{ ...styles.th, width: '25%' }}>Kategori Adı</th>
                <th style={{ ...styles.th, width: '50%' }}>Açıklama</th>
                <th style={{ ...styles.th, width: '25%', textAlign: 'right' }}>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.map((category) => (
                <tr key={category.id} style={styles.tableRow}>
                  <td style={styles.td}>
                    <div style={styles.categoryNameGroup}>
                      <div style={styles.categoryIconCircle}>
                        <FiFolder style={styles.categoryFolderIcon} />
                      </div>
                      <span style={styles.categoryName}>{category.name}</span>
                    </div>
                  </td>
                  <td style={styles.td}>
                    <span style={styles.descriptionText}>
                      {category.description || '-'}
                    </span>
                  </td>
                  <td style={{ ...styles.td, textAlign: 'right' }}>
                    <div style={styles.actionButtons}>
                      <button
                        onClick={() => openEditModal(category)}
                        style={styles.editButton}
                        title="Düzenle"
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        onClick={() => handleDelete(category.id, category.name)}
                        style={styles.deleteButton}
                        title="Sil"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* Empty State */
        <div className="card" style={styles.emptyState}>
          <div style={styles.emptyIconCircle}>
            <FiFolder style={styles.emptyIcon} />
          </div>
          <h3 style={styles.emptyTitle}>Kayıt Bulunamadı</h3>
          <p style={styles.emptySubtitle}>Aramanızla eşleşen veya kayıtlı hiçbir kategori bulunamadı.</p>
        </div>
      )}

      {/* Modal Dialog Form */}
      {isModalOpen && (
        <div style={styles.modalOverlay}>
          <div className="glass-panel" style={styles.modalContent}>
            {/* Modal Header */}
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>
                {modalMode === 'add' ? 'Yeni Kategori Ekle' : 'Kategoriyi Güncelle'}
              </h2>
              <button onClick={closeModal} style={styles.closeBtn}>
                <FiX />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Kategori Adı *</label>
                <input
                  type="text"
                  name="name"
                  placeholder="örn. Bilim Kurgu, Tarih, Felsefe"
                  value={formData.name}
                  onChange={handleInputChange}
                  style={{
                    ...styles.input,
                    borderColor: formErrors.name ? 'var(--error)' : 'var(--border-light)',
                  }}
                />
                {formErrors.name && (
                  <span style={styles.errorText}>{formErrors.name}</span>
                )}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Açıklama</label>
                <textarea
                  name="description"
                  placeholder="Kategoriye ait kısa bir açıklama giriniz..."
                  rows="4"
                  value={formData.description}
                  onChange={handleInputChange}
                  style={styles.textarea}
                />
              </div>

              <div style={styles.modalFooter}>
                <button type="button" onClick={closeModal} style={styles.cancelBtn}>
                  Vazgeç
                </button>
                <button type="submit" style={styles.saveBtn}>
                  {modalMode === 'add' ? 'Kategori Ekle' : 'Güncelle'}
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
    overflow: 'hidden',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
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
  },
  categoryNameGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  categoryIconCircle: {
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    background: 'var(--primary-glow)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryFolderIcon: {
    color: 'var(--primary)',
    fontSize: '1.1rem',
  },
  categoryName: {
    fontWeight: '600',
    color: 'var(--text-main)',
    fontSize: '0.95rem',
  },
  descriptionText: {
    fontSize: '0.9rem',
    color: 'var(--text-muted)',
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
  // Modal styles
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
    maxWidth: '500px',
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
  textarea: {
    width: '100%',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    border: '1px solid var(--border-light)',
    background: 'var(--bg-input)',
    color: 'var(--text-main)',
    fontContainer: 'inherit',
    outline: 'none',
    resize: 'none',
    transition: 'border-color var(--transition-fast), box-shadow var(--transition-fast)',
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
