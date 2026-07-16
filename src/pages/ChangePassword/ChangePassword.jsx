import React from 'react';
import { useForm } from 'react-hook-form';
import { useMemberStore } from '../../store/useMemberStore';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { FiLock, FiCheck } from 'react-icons/fi';

export default function ChangePassword() {
  const { user } = useAuth();
  const { members, updateMember } = useMemberStore();

  const { 
    register, 
    handleSubmit, 
    reset,
    watch,
    formState: { errors, isSubmitting } 
  } = useForm({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  });

  const newPasswordValue = watch('newPassword');

  const onSubmit = async (data) => {
    // Artificial slight delay for loading micro-animation
    await new Promise((resolve) => setTimeout(resolve, 800));

    const member = members.find((m) => String(m.id) === String(user?.memberId));

    if (!member) {
      toast.error('Kullanıcı kaydı bulunamadı.');
      return;
    }

    // Current password check (fallback to memberNo if no custom password was set yet)
    const expectedCurrentPassword = member.password || member.memberNo;
    if (data.currentPassword !== expectedCurrentPassword) {
      toast.error('Mevcut şifreniz hatalı.');
      return;
    }

    try {
      // Update member password in the store
      updateMember(member.id, { password: data.newPassword });
      
      // Update cached session user password if stored (optional, but keep it clean)
      const cachedAuth = localStorage.getItem('library_auth');
      if (cachedAuth) {
        const parsed = JSON.parse(cachedAuth);
        localStorage.setItem('library_auth', JSON.stringify({ ...parsed, password: data.newPassword }));
      }

      toast.success('Şifreniz başarıyla güncellendi!');
      reset();
    } catch (e) {
      toast.error('Şifre güncellenirken bir hata oluştu.');
    }
  };

  return (
    <div className="page-container" style={styles.container}>
      {/* Header section */}
      <div style={styles.header}>
        <h1 style={styles.title}>Şifre Değiştir</h1>
        <p style={styles.subtitle}>Hesap güvenliğiniz için mevcut şifrenizi güncelleyin.</p>
      </div>

      <div className="card" style={styles.formCard}>
        <form onSubmit={handleSubmit(onSubmit)} style={styles.form} noValidate>
          {/* Current Password */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Mevcut Şifre *</label>
            <div style={styles.inputWrapper}>
              <FiLock style={styles.inputIcon} />
              <input
                type="password"
                placeholder="Mevcut şifrenizi giriniz"
                style={{
                  ...styles.input,
                  borderColor: errors.currentPassword ? 'var(--error)' : 'var(--border-light)'
                }}
                {...register('currentPassword', { required: 'Mevcut şifreniz zorunludur.' })}
              />
            </div>
            {errors.currentPassword && <span style={styles.errorText}>{errors.currentPassword.message}</span>}
          </div>

          {/* New Password */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Yeni Şifre *</label>
            <div style={styles.inputWrapper}>
              <FiLock style={styles.inputIcon} />
              <input
                type="password"
                placeholder="En az 6 karakter giriniz"
                style={{
                  ...styles.input,
                  borderColor: errors.newPassword ? 'var(--error)' : 'var(--border-light)'
                }}
                {...register('newPassword', { 
                  required: 'Yeni şifre alanı zorunludur.',
                  minLength: { value: 6, message: 'Şifre en az 6 karakter olmalıdır.' }
                })}
              />
            </div>
            {errors.newPassword && <span style={styles.errorText}>{errors.newPassword.message}</span>}
          </div>

          {/* Confirm Password */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Yeni Şifre Tekrar *</label>
            <div style={styles.inputWrapper}>
              <FiLock style={styles.inputIcon} />
              <input
                type="password"
                placeholder="Yeni şifrenizi tekrar giriniz"
                style={{
                  ...styles.input,
                  borderColor: errors.confirmPassword ? 'var(--error)' : 'var(--border-light)'
                }}
                {...register('confirmPassword', { 
                  required: 'Şifre tekrarı zorunludur.',
                  validate: (value) => value === newPasswordValue || 'Şifreler uyuşmuyor.'
                })}
              />
            </div>
            {errors.confirmPassword && <span style={styles.errorText}>{errors.confirmPassword.message}</span>}
          </div>

          {/* Action Button */}
          <button 
            type="submit" 
            disabled={isSubmitting} 
            style={styles.submitBtn}
            className="btn"
          >
            <FiCheck style={styles.btnIcon} />
            <span>{isSubmitting ? 'Güncelleniyor...' : 'Şifreyi Güncelle'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '600px',
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
  formCard: {
    padding: '2rem',
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
  inputIcon: {
    position: 'absolute',
    left: '14px',
    color: 'var(--text-muted)',
    fontSize: '1.05rem',
  },
  input: {
    paddingLeft: '2.5rem',
    width: '100%',
  },
  errorText: {
    fontSize: '0.8rem',
    color: 'var(--error)',
    marginTop: '2px',
  },
  submitBtn: {
    width: '100%',
    padding: '0.85rem',
    fontSize: '0.95rem',
    fontWeight: '600',
    gap: '0.5rem',
    marginTop: '0.5rem',
  },
  btnIcon: {
    fontSize: '1.1rem',
  },
};
