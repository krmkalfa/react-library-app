import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMemberStore, generateUniqueMemberNo } from '../../store/useMemberStore';
import { toast } from 'react-toastify';
import { 
  FiPlus, 
  FiSearch, 
  FiEdit2, 
  FiTrash2, 
  FiX, 
  FiUsers, 
  FiUser
} from 'react-icons/fi';

export default function Members() {
  const { members, addMember, updateMember, deleteMember } = useMemberStore();
  
  // Search state
  const [searchTerm, setSearchTerm] = useState('');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [currentMemberId, setCurrentMemberId] = useState(null);

  // react-hook-form initialization
  const { 
    register, 
    handleSubmit, 
    reset,
    formState: { errors } 
  } = useForm({
    defaultValues: {
      fullName: '',
      memberNo: '',
      phone: '',
      email: ''
    }
  });

  // Filter members based on search
  const filteredMembers = members.filter((member) => {
    const searchString = searchTerm.toLowerCase();
    return (
      member.fullName.toLowerCase().includes(searchString) ||
      member.memberNo.toLowerCase().includes(searchString) ||
      (member.email && member.email.toLowerCase().includes(searchString)) ||
      (member.phone && member.phone.includes(searchTerm))
    );
  });

  const openAddModal = () => {
    // Generate a unique 8-digit random member number
    const autoNo = generateUniqueMemberNo(members);
    reset({
      fullName: '',
      memberNo: autoNo,
      phone: '',
      email: ''
    });
    setModalMode('add');
    setIsModalOpen(true);
  };

  const openEditModal = (member) => {
    reset({
      fullName: member.fullName,
      memberNo: member.memberNo,
      phone: member.phone || '',
      email: member.email || ''
    });
    setModalMode('edit');
    setCurrentMemberId(member.id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentMemberId(null);
  };

  const onSubmitForm = (data) => {
    // Strip non-digits from the phone number
    const cleanedPhone = data.phone.replace(/\D/g, '');

    try {
      if (modalMode === 'add') {
        const today = new Date().toISOString().split('T')[0];
        addMember({
          id: Date.now().toString(),
          fullName: data.fullName.trim(),
          memberNo: data.memberNo.trim(),
          phone: cleanedPhone,
          email: data.email.trim(),
          registryDate: today
        });
        toast.success('Üye başarıyla eklendi!');
      } else {
        updateMember(currentMemberId, {
          fullName: data.fullName.trim(),
          memberNo: data.memberNo.trim(),
          phone: cleanedPhone,
          email: data.email.trim()
        });
        toast.success('Üye bilgileri başarıyla güncellendi!');
      }
      closeModal();
    } catch (e) {
      toast.error(e.message || 'Üye kaydedilirken bir hata meydana geldi.');
    }
  };

  const handleDelete = (id, name) => {
    const confirmDelete = window.confirm(`"${name}" adlı üyeyi silmek istediğinize emin misiniz?`);
    if (!confirmDelete) return;

    deleteMember(id);
    toast.success('Üye başarıyla silindi!');
  };

  return (
    <div className="page-container" style={styles.container}>
      {/* Header Section */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Üye Yönetimi</h1>
          <p style={styles.subtitle}>Kütüphane üyelerini kaydedin, düzenleyin ve kayıtlarını yönetin.</p>
        </div>
        <button onClick={openAddModal} className="btn" style={styles.addButton}>
          <FiPlus style={styles.btnIcon} />
          <span>Üye Ekle</span>
        </button>
      </div>

      {/* Control Actions Bar */}
      <div className="card" style={styles.actionBar}>
        <div style={styles.searchWrapper}>
          <FiSearch style={styles.searchIcon} />
          <input
            type="text"
            placeholder="Ad soyad, Üye No, e-posta veya telefon ile ara..."
            style={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Members Grid / Table */}
      {filteredMembers.length > 0 ? (
        <div className="card" style={styles.tableCard}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeaderRow}>
                <th style={styles.th}>Ad Soyad</th>
                <th style={styles.th}>Üye No</th>
                <th style={styles.th}>Telefon</th>
                <th style={styles.th}>E-posta</th>
                <th style={styles.th}>Kayıt Tarihi</th>
                <th style={{ ...styles.th, textAlign: 'right' }}>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((member) => (
                <tr key={member.id} style={styles.tableRow}>
                  <td style={styles.td}>
                    <div style={styles.memberNameGroup}>
                      <div style={styles.memberIconCircle}>
                        <FiUser style={styles.memberIcon} />
                      </div>
                      <span style={styles.memberName}>{member.fullName}</span>
                    </div>
                  </td>
                  <td style={styles.td}>
                    <span style={styles.memberNoBadge}>{member.memberNo}</span>
                  </td>
                  <td style={styles.td}>{member.phone}</td>
                  <td style={styles.td}>{member.email}</td>
                  <td style={styles.td}>{member.registryDate || '-'}</td>
                  <td style={{ ...styles.td, textAlign: 'right' }}>
                    <div style={styles.actionButtons}>
                      <button
                        onClick={() => openEditModal(member)}
                        style={styles.editButton}
                        title="Düzenle"
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        onClick={() => handleDelete(member.id, member.fullName)}
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
            <FiUsers style={styles.emptyIcon} />
          </div>
          <h3 style={styles.emptyTitle}>Kayıt Bulunamadı</h3>
          <p style={styles.emptySubtitle}>Aramanızla eşleşen veya kayıtlı hiçbir üye bulunamadı.</p>
        </div>
      )}

      {/* Add / Edit Form Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={styles.modalContent}>
            {/* Modal Header */}
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>
                {modalMode === 'add' ? 'Yeni Üye Kaydı' : 'Üye Bilgilerini Düzenle'}
              </h2>
              <button onClick={closeModal} style={styles.closeBtn}>
                <FiX />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit(onSubmitForm)} style={styles.form}>
              {/* Full Name */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Ad Soyad *</label>
                <input
                  type="text"
                  placeholder="Üyenin adını ve soyadını giriniz"
                  style={{
                    ...styles.input,
                    borderColor: errors.fullName ? 'var(--error)' : 'var(--border-light)'
                  }}
                  {...register('fullName', { required: 'Ad soyad alanı zorunludur.' })}
                />
                {errors.fullName && <span style={styles.errorText}>{errors.fullName.message}</span>}
              </div>

              {/* Member Number */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Üye Numarası *</label>
                <input
                  type="text"
                  placeholder="MEM-XXXX"
                  style={{
                    ...styles.input,
                    borderColor: errors.memberNo ? 'var(--error)' : 'var(--border-light)'
                  }}
                  {...register('memberNo', { required: 'Üye numarası zorunludur.' })}
                />
                {errors.memberNo && <span style={styles.errorText}>{errors.memberNo.message}</span>}
              </div>

              {/* Phone Field */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Telefon *</label>
                <input
                  type="tel"
                  placeholder="05XXXXXXXXX"
                  style={{
                    ...styles.input,
                    borderColor: errors.phone ? 'var(--error)' : 'var(--border-light)'
                  }}
                  {...register('phone', { 
                    required: 'Telefon numarası zorunludur.',
                    validate: (val) => {
                      const stripped = val.replace(/\D/g, '');
                      return (stripped.length === 11 && stripped.startsWith('05')) || 'Telefon numarası "05" ile başlamalı ve 11 haneli olmalıdır.';
                    }
                  })}
                />
                {errors.phone && <span style={styles.errorText}>{errors.phone.message}</span>}
              </div>

              {/* Email Field */}
              <div style={styles.formGroup}>
                <label style={styles.label}>E-posta *</label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  style={{
                    ...styles.input,
                    borderColor: errors.email ? 'var(--error)' : 'var(--border-light)'
                  }}
                  {...register('email', { 
                    required: 'E-posta adresi zorunludur.',
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                      message: 'Geçersiz e-posta formatı.'
                    }
                  })}
                />
                {errors.email && <span style={styles.errorText}>{errors.email.message}</span>}
              </div>

              {/* Modal Footer actions */}
              <div style={styles.modalFooter}>
                <button type="button" onClick={closeModal} style={styles.cancelBtn}>
                  Vazgeç
                </button>
                <button type="submit" style={styles.saveBtn}>
                  {modalMode === 'add' ? 'Kayıt Ekle' : 'Güncelle'}
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
  memberNameGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  memberIconCircle: {
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    background: 'var(--primary-glow)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  memberIcon: {
    color: 'var(--primary)',
    fontSize: '1.1rem',
  },
  memberName: {
    fontWeight: '600',
    color: 'var(--text-main)',
  },
  memberNoBadge: {
    background: 'var(--slate-100)',
    color: 'var(--slate-700)',
    padding: '0.25rem 0.5rem',
    borderRadius: '6px',
    fontSize: '0.85rem',
    fontWeight: '600',
    fontFamily: 'monospace',
    border: '1px solid var(--border-light)',
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
};
