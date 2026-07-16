import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useMemberStore, generateUniqueMemberNo } from '../../store/useMemberStore';
import { toast } from 'react-toastify';
import { FiUser, FiPhone, FiMail, FiMapPin, FiLock, FiArrowRight } from 'react-icons/fi';

export default function Register() {
  const { addMember } = useMemberStore();
  const navigate = useNavigate();

  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting } 
  } = useForm({
    defaultValues: {
      fullName: '',
      phone: '',
      email: '',
      address: '',
      password: ''
    }
  });

  const onSubmit = async (data) => {
    // Strip non-digits from the phone number
    const cleanedPhone = data.phone.replace(/\D/g, '');
    const members = useMemberStore.getState().members;

    // Auto-generate 8-digit unique member number
    const autoNo = generateUniqueMemberNo(members);
    const today = new Date().toISOString().split('T')[0];

    const newMember = {
      id: Date.now().toString(),
      fullName: data.fullName.trim(),
      phone: cleanedPhone,
      email: data.email.trim(),
      address: data.address.trim(),
      password: data.password, // User typed password
      memberNo: autoNo,
      registryDate: today
    };

    try {
      addMember(newMember);
      toast.success(`Kayıt işleminiz başarıyla tamamlandı! Üye numaranız: ${autoNo}. Lütfen giriş yapın.`, {
        position: 'top-right',
        autoClose: 5000
      });
      navigate('/login');
    } catch (e) {
      toast.error(e.message || 'Kayıt oluşturulurken bir hata meydana geldi.');
    }
  };

  return (
    <div style={styles.container}>
      {/* Background visual abstract graphics */}
      <div style={styles.circle1}></div>
      <div style={styles.circle2}></div>

      {/* Glassmorphism Register Card */}
      <div className="glass-panel" style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>Kayıt Ol</h1>
          <p style={styles.subtitle}>BiblioTech kütüphane sistemine üye kaydı oluşturun.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} style={styles.form} noValidate>
          {/* Ad Soyad */}
          <div style={styles.inputGroup}>
            <label htmlFor="fullName" style={styles.label}>Ad Soyad *</label>
            <div style={styles.inputWrapper}>
              <FiUser style={styles.inputIcon} />
              <input
                id="fullName"
                type="text"
                placeholder="Adınız ve Soyadınız"
                style={{
                  ...styles.input,
                  borderColor: errors.fullName ? 'var(--error)' : 'var(--border-light)'
                }}
                {...register('fullName', { required: 'Ad soyad alanı zorunludur.' })}
              />
            </div>
            {errors.fullName && <span style={styles.errorText}>{errors.fullName.message}</span>}
          </div>

          {/* Telefon */}
          <div style={styles.inputGroup}>
            <label htmlFor="phone" style={styles.label}>Telefon *</label>
            <div style={styles.inputWrapper}>
              <FiPhone style={styles.inputIcon} />
              <input
                id="phone"
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
            </div>
            {errors.phone && <span style={styles.errorText}>{errors.phone.message}</span>}
          </div>

          {/* E-posta */}
          <div style={styles.inputGroup}>
            <label htmlFor="email" style={styles.label}>E-posta Adresi *</label>
            <div style={styles.inputWrapper}>
              <FiMail style={styles.inputIcon} />
              <input
                id="email"
                type="email"
                placeholder="name@example.com"
                style={{
                  ...styles.input,
                  borderColor: errors.email ? 'var(--error)' : 'var(--border-light)'
                }}
                {...register('email', { 
                  required: 'E-posta alanı zorunludur.',
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                    message: 'Geçersiz e-posta formatı.'
                  }
                })}
              />
            </div>
            {errors.email && <span style={styles.errorText}>{errors.email.message}</span>}
          </div>

          {/* Adres */}
          <div style={styles.inputGroup}>
            <label htmlFor="address" style={styles.label}>Adres</label>
            <div style={styles.inputWrapper}>
              <FiMapPin style={styles.inputIcon} />
              <input
                id="address"
                type="text"
                placeholder="Ev veya iş adresiniz"
                style={styles.input}
                {...register('address')}
              />
            </div>
          </div>

          {/* Şifre */}
          <div style={styles.inputGroup}>
            <label htmlFor="password" style={styles.label}>Şifre *</label>
            <div style={styles.inputWrapper}>
              <FiLock style={styles.inputIcon} />
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                style={{
                  ...styles.input,
                  borderColor: errors.password ? 'var(--error)' : 'var(--border-light)'
                }}
                {...register('password', { 
                  required: 'Şifre alanı zorunludur.',
                  minLength: { value: 6, message: 'Şifre en az 6 karakterden oluşmalıdır.' }
                })}
              />
            </div>
            {errors.password && <span style={styles.errorText}>{errors.password.message}</span>}
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={isSubmitting} 
            style={styles.submitBtn}
          >
            <span>{isSubmitting ? 'Kaydediliyor...' : 'Kayıt Ol'}</span>
            {!isSubmitting && <FiArrowRight style={styles.arrowIcon} />}
          </button>
        </form>

        <div style={styles.footerLinkWrapper}>
          <span style={styles.footerText}>Zaten üye misiniz? </span>
          <Link to="/login" style={styles.footerLink}>Giriş Yapın</Link>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    width: '100vw',
    position: 'relative',
    background: 'radial-gradient(circle at 10% 20%, rgba(99, 102, 241, 0.08) 0%, transparent 40%), radial-gradient(circle at 90% 80%, rgba(139, 92, 246, 0.08) 0%, transparent 40%), var(--bg-app)',
    overflow: 'hidden',
  },
  circle1: {
    position: 'absolute',
    width: '300px',
    height: '300px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, var(--primary), var(--accent))',
    filter: 'blur(80px)',
    top: '10%',
    left: '10%',
    opacity: 0.12,
    zIndex: 1,
  },
  circle2: {
    position: 'absolute',
    width: '280px',
    height: '280px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, var(--accent), var(--primary))',
    filter: 'blur(70px)',
    bottom: '10%',
    right: '10%',
    opacity: 0.1,
    zIndex: 1,
  },
  card: {
    width: '100%',
    maxWidth: '460px',
    padding: '2.5rem',
    zIndex: 2,
    boxSizing: 'border-box',
    margin: '1.5rem',
    border: '1px solid var(--glass-border)',
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    marginBottom: '2rem',
  },
  title: {
    fontSize: '1.75rem',
    fontWeight: '700',
    color: 'var(--text-main)',
    letterSpacing: '-0.5px',
    marginBottom: '0.35rem',
  },
  subtitle: {
    fontSize: '0.9rem',
    color: 'var(--text-muted)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.15rem',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
  },
  label: {
    fontSize: '0.85rem',
    fontWeight: '600',
    color: 'var(--text-main)',
    paddingLeft: '2px',
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
    pointerEvents: 'none',
  },
  input: {
    paddingLeft: '2.5rem',
    width: '100%',
  },
  errorText: {
    fontSize: '0.8rem',
    color: 'var(--error)',
    paddingLeft: '2px',
    marginTop: '2px',
  },
  submitBtn: {
    width: '100%',
    padding: '0.85rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    fontSize: '1rem',
    fontWeight: '600',
    marginTop: '0.5rem',
  },
  arrowIcon: {
    fontSize: '1.1rem',
  },
  footerLinkWrapper: {
    textAlign: 'center',
    marginTop: '1.5rem',
    fontSize: '0.9rem',
  },
  footerText: {
    color: 'var(--text-muted)',
  },
  footerLink: {
    fontWeight: '600',
    color: 'var(--primary)',
    textDecoration: 'none',
  },
};
