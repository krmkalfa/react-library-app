import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiBook, FiUsers, FiLayers, FiCheckCircle } from 'react-icons/fi';
import heroImg from '../../assets/hero.png';

export default function Homepage() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.heroOverlay}>
          <div style={styles.heroContent}>
            <h1 style={styles.title}>BiblioTech'e Hoş Geldiniz</h1>
            <p style={styles.subtitle}>Geleceğin Kütüphane Yönetim Sistemi ile tanışın. Kitaplarınızı yönetin, ödünç alın ve bilgi dünyasına adım atın.</p>
            <button style={styles.ctaBtn} onClick={() => navigate('/books')}>
              Kütüphaneyi Keşfet
            </button>
          </div>

          {/* Stats Glassmorphism Box */}
          <div style={styles.statsContainer}>
            <div style={styles.statBox}>
              <FiUsers style={styles.statIcon} />
              <h3 style={styles.statNumber}>1.500+</h3>
              <p style={styles.statLabel}>Aktif Üye</p>
            </div>
            <div style={styles.statDivider} />
            <div style={styles.statBox}>
              <FiLayers style={styles.statIcon} />
              <h3 style={styles.statNumber}>100+</h3>
              <p style={styles.statLabel}>Farklı Kategori</p>
            </div>
            <div style={styles.statDivider} />
            <div style={styles.statBox}>
              <FiBook style={styles.statIcon} />
              <h3 style={styles.statNumber}>10.000+</h3>
              <p style={styles.statLabel}>Zengin Kitap</p>
            </div>
          </div>
        </div>
      </section>

      {/* Info Cards Section */}
      <section style={styles.infoSection}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Neden Biz?</h2>
          <p style={styles.sectionSubtitle}>Sistemin size sunduğu bazı harika özellikler</p>
        </div>
        
        <div style={styles.cardsGrid}>
          <div style={styles.card}>
            <div style={styles.cardIconWrapper}>
              <FiCheckCircle style={styles.cardIcon} />
            </div>
            <h3 style={styles.cardTitle}>Kolay Ödünç Alma</h3>
            <p style={styles.cardText}>İstediğiniz kitabı saniyeler içinde ayırtın ve ödünç alın. Uzun kuyruklara ve evrak işlerine son.</p>
          </div>
          <div style={styles.card}>
            <div style={styles.cardIconWrapper}>
              <FiBook style={styles.cardIcon} />
            </div>
            <h3 style={styles.cardTitle}>Geniş Arşiv</h3>
            <p style={styles.cardText}>Her yaşa ve her ilgi alanına uygun on binlerce kaynak. Sürekli güncellenen kütüphanemizi keşfedin.</p>
          </div>
          <div style={styles.card}>
            <div style={styles.cardIconWrapper}>
              <FiUsers style={styles.cardIcon} />
            </div>
            <h3 style={styles.cardTitle}>Topluluk Odaklı</h3>
            <p style={styles.cardText}>Diğer okuyucularla etkileşime geçin, popüler kitapları görün ve okuma alışkanlığınızı geliştirin.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

const styles = {
  container: {
    width: '100%',
    height: '100%',
    overflowY: 'auto',
    background: 'var(--bg-main)',
  },
  hero: {
    position: 'relative',
    width: '100%',
    minHeight: '85vh',
    backgroundImage: `url(${heroImg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(to bottom right, rgba(15, 23, 42, 0.95), rgba(15, 23, 42, 0.6))',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
  },
  heroContent: {
    textAlign: 'center',
    maxWidth: '800px',
    zIndex: 2,
    marginBottom: '5rem',
  },
  title: {
    fontSize: '4.5rem',
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: '1.5rem',
    lineHeight: '1.1',
    letterSpacing: '-1px',
    textShadow: '0 10px 30px rgba(0,0,0,0.5)',
  },
  subtitle: {
    fontSize: '1.3rem',
    color: '#e2e8f0',
    marginBottom: '3rem',
    lineHeight: '1.6',
    fontWeight: '400',
    textShadow: '0 4px 15px rgba(0,0,0,0.5)',
  },
  ctaBtn: {
    padding: '1.2rem 3rem',
    fontSize: '1.15rem',
    fontWeight: '700',
    background: 'linear-gradient(135deg, var(--primary), var(--accent))',
    color: '#ffffff',
    border: 'none',
    borderRadius: '50px',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 10px 25px var(--primary-glow)',
  },
  statsContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(255, 255, 255, 0.08)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    borderRadius: '24px',
    padding: '2.5rem 5rem',
    gap: '4rem',
    zIndex: 2,
    boxShadow: '0 30px 60px rgba(0,0,0,0.4)',
    flexWrap: 'wrap',
  },
  statBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.75rem',
  },
  statIcon: {
    fontSize: '2.5rem',
    color: '#60a5fa',
    marginBottom: '0.5rem',
    filter: 'drop-shadow(0 0 10px rgba(96, 165, 250, 0.5))',
  },
  statNumber: {
    fontSize: '3rem',
    fontWeight: '800',
    color: '#ffffff',
    margin: 0,
    lineHeight: 1,
  },
  statLabel: {
    fontSize: '1.1rem',
    color: '#cbd5e1',
    fontWeight: '600',
    margin: 0,
    textTransform: 'uppercase',
    letterSpacing: '2px',
  },
  statDivider: {
    width: '1px',
    height: '70px',
    background: 'rgba(255, 255, 255, 0.15)',
  },
  infoSection: {
    padding: '8rem 2rem',
    background: 'var(--bg-main)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  sectionHeader: {
    textAlign: 'center',
    marginBottom: '5rem',
  },
  sectionTitle: {
    fontSize: '2.5rem',
    fontWeight: '800',
    color: 'var(--text-main)',
    marginBottom: '1rem',
  },
  sectionSubtitle: {
    fontSize: '1.1rem',
    color: 'var(--text-muted)',
  },
  cardsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '3rem',
    maxWidth: '1200px',
    width: '100%',
  },
  card: {
    background: 'var(--bg-sidebar)',
    padding: '3rem 2.5rem',
    borderRadius: '30px',
    border: '1px solid var(--border-light)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 15px 35px rgba(0,0,0,0.03)',
  },
  cardIconWrapper: {
    width: '80px',
    height: '80px',
    borderRadius: '24px',
    background: 'var(--primary-glow)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '2rem',
    color: 'var(--primary)',
    transform: 'rotate(-5deg)',
  },
  cardIcon: {
    fontSize: '2.5rem',
  },
  cardTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: 'var(--text-main)',
    marginBottom: '1rem',
  },
  cardText: {
    color: 'var(--text-muted)',
    lineHeight: '1.7',
    fontSize: '1.05rem',
  },
};
