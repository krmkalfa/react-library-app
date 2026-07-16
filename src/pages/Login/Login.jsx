import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { FiLock, FiUser, FiArrowRight } from 'react-icons/fi';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting } 
  } = useForm({
    defaultValues: {
      username: '',
      password: ''
    }
  });

  const onSubmit = async (data) => {
    // Artificial slight delay for micro-animation loading effect
    await new Promise((resolve) => setTimeout(resolve, 800));

    const success = login(data.username, data.password);

    if (success) {
      toast.success(`Giriş başarılı, tekrar hoş geldiniz ${data.username}!`, {
        position: 'top-right',
        autoClose: 3000,
      });
      navigate('/dashboard');
    } else {
      toast.error('Geçersiz kullanıcı adı veya şifre. Lütfen tekrar deneyin.', {
        position: 'top-right',
        autoClose: 4000,
      });
    }
  };

  return (
    <div style={styles.container}>
      {/* Dynamic abstract gradient background shapes */}
      <div style={styles.circle1}></div>
      <div style={styles.circle2}></div>

      {/* Glassmorphic Login Card */}
      <div className="glass-panel" style={styles.card}>
        <div style={styles.header}>
          <div style={styles.iconCircle}>
            <FiLock style={styles.iconLock} />
          </div>
          <h1 style={styles.title}>Giriş Yap</h1>
          <p style={styles.subtitle}>Kütüphane sisteminizi yönetmek veya üye paneline erişmek için oturum açın</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} style={styles.form} noValidate>
          {/* Username Field */}
          <div style={styles.inputGroup}>
            <label htmlFor="username" style={styles.label}>Kullanıcı Adı veya E-posta *</label>
            <div style={styles.inputWrapper}>
              <FiUser style={styles.inputIcon} />
              <input
                id="username"
                type="text"
                placeholder="E-posta veya kullanıcı adı girin"
                style={{
                  ...styles.input,
                  borderColor: errors.username ? 'var(--error)' : 'var(--border-light)'
                }}
                {...register('username', { 
                  required: 'Kullanıcı adı veya e-posta alanı zorunludur.',
                  minLength: { value: 3, message: 'En az 3 karakter olmalıdır.' }
                })}
              />
            </div>
            {errors.username && (
              <span style={styles.errorText}>{errors.username.message}</span>
            )}
          </div>

          {/* Password Field */}
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
                  minLength: { value: 5, message: 'En az 5 karakter olmalıdır.' }
                })}
              />
            </div>
            {errors.password && (
              <span style={styles.errorText}>{errors.password.message}</span>
            )}
          </div>

          {/* Helper Tips */}
          <div style={styles.infoBox}>
            <span style={styles.infoLabel}>Demo Yönetici:</span>
            <span style={styles.infoText}>admin / admin123</span>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={isSubmitting} 
            style={styles.submitBtn}
          >
            <span>{isSubmitting ? 'Doğrulanıyor...' : 'Giriş Yap'}</span>
            {!isSubmitting && <FiArrowRight style={styles.arrowIcon} />}
          </button>
        </form>

        {/* Redirect text to Register page below submit button */}
        <div style={styles.footerLinkWrapper}>
          <span style={styles.footerText}>Henüz üye değil misiniz? </span>
          <Link to="/register" style={styles.footerLink}>Hemen Kayıt Olun</Link>
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
    top: '15%',
    left: '15%',
    opacity: 0.15,
    zIndex: 1,
  },
  circle2: {
    position: 'absolute',
    width: '280px',
    height: '280px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, var(--accent), var(--primary))',
    filter: 'blur(70px)',
    bottom: '20%',
    right: '15%',
    opacity: 0.12,
    zIndex: 1,
  },
  card: {
    width: '100%',
    maxWidth: '440px',
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
  iconCircle: {
    width: '56px',
    height: '56px',
    borderRadius: '16px',
    background: 'var(--primary-glow)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1rem',
    border: '1px solid rgba(99, 102, 241, 0.2)',
  },
  iconLock: {
    fontSize: '1.4rem',
    color: 'var(--primary)',
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
    gap: '1.25rem',
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
  infoBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    background: 'rgba(99, 102, 241, 0.05)',
    border: '1px dashed rgba(99, 102, 241, 0.25)',
    padding: '0.6rem 0.8rem',
    borderRadius: '8px',
    marginTop: '0.2rem',
    fontSize: '0.85rem',
  },
  infoLabel: {
    fontWeight: '600',
    color: 'var(--primary)',
  },
  infoText: {
    color: 'var(--text-muted)',
    fontFamily: 'monospace',
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
    transition: 'transform var(--transition-fast)',
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
