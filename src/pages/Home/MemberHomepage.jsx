import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useLoanStore } from "../../store/useLoanStore";
import { useBookStore } from "../../store/useBookStore";
import { useCategoryStore } from "../../store/useCategoryStore";
import {
  FiBookOpen,
  FiBookmark,
  FiSearch,
  FiStar,
  FiTrendingUp,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

export default function MemberHomepage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { loans } = useLoanStore();
  const { books } = useBookStore();
  const { categories } = useCategoryStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [popularIndex, setPopularIndex] = useState(0);
  const [personalizedIndex, setPersonalizedIndex] = useState(0);

  // 1. Kullanıcı İstatistikleri
  const userLoans = useMemo(
    () => loans.filter((l) => String(l.memberId) === String(user?.memberId)),
    [loans, user?.memberId],
  );
  const totalBorrowed = userLoans.length;
  const readBooks = userLoans.filter((l) => l.status === "returned").length;

  // 2. Kişiselleştirilmiş Öneriler için Favori Kategorileri Bulma
  const personalizedBooks = useMemo(() => {
    if (userLoans.length === 0) return [];

    const categoryCounts = {};
    const readBookIds = new Set(userLoans.map((l) => String(l.bookId)));

    userLoans.forEach((loan) => {
      const book = books.find((b) => String(b.id) === String(loan.bookId));
      if (book && book.categoryIds) {
        book.categoryIds.forEach((cId) => {
          categoryCounts[cId] = (categoryCounts[cId] || 0) + 1;
        });
      }
    });

    const sortedCategories = Object.entries(categoryCounts).sort(
      (a, b) => b[1] - a[1],
    );
    if (sortedCategories.length === 0) return [];

    const topCategoryIds = sortedCategories
      .slice(0, 3)
      .map((entry) => entry[0]);

    // O kategorilerdeki diğer popüler kitapları getir (Kullanıcının okumadığı, ama başkalarının çok okuduğu)
    const loanCounts = {};
    loans.forEach((l) => {
      loanCounts[l.bookId] = (loanCounts[l.bookId] || 0) + 1;
    });

    const recommended = books
      .filter((b) => !b.isDeleted)
      .filter((b) => !readBookIds.has(String(b.id))) // Kullanıcının okumadıkları
      .filter((b) =>
        b.categoryIds?.some((cid) => topCategoryIds.includes(String(cid))),
      ) // Tercih ettiği kategoriler
      .sort((a, b) => (loanCounts[b.id] || 0) - (loanCounts[a.id] || 0)) // Diğer kullanıcıların en çok okudukları
      .slice(0, 7);

    return recommended;
  }, [loans, books, userLoans]);

  // 3. Genel Popüler Kitaplar
  const popularBooks = useMemo(() => {
    const loanCounts = {};
    loans.forEach((loan) => {
      loanCounts[loan.bookId] = (loanCounts[loan.bookId] || 0) + 1;
    });

    const sortedBooks = [...books]
      .filter((b) => !b.isDeleted)
      .sort((a, b) =>
        (loanCounts[b.id] || 0) > (loanCounts[a.id] || 0) ? -1 : 1,
      )
      .slice(0, 7);

    return sortedBooks;
  }, [loans, books]);

  // 4. Arama / Filtreleme
  const filteredBooks = useMemo(() => {
    if (!searchTerm.trim()) return [];

    const term = searchTerm.toLowerCase();
    return books
      .filter((b) => {
        if (b.isDeleted) return false;

        const titleMatch = b.title.toLowerCase().includes(term);
        const authorMatch = b.author.toLowerCase().includes(term);
        const categoryMatch = b.categoryIds?.some((cId) => {
          const cat = categories.find((c) => String(c.id) === String(cId));
          return cat && cat.name.toLowerCase().includes(term);
        });

        return titleMatch || authorMatch || categoryMatch;
      })
      .slice(0, 4);
  }, [books, categories, searchTerm]);

  // Kitap kartı render fonksiyonu (Normal Grid İçin)
  const renderBookCard = (book) => (
    <div
      key={book.id}
      style={styles.bookCard}
      onClick={() => navigate("/books")}
    >
      <div style={styles.bookIconWrapper}>
        <FiBookOpen style={styles.bookIcon} />
      </div>
      <div style={styles.bookInfo}>
        <h4 style={styles.bookTitle}>{book.title}</h4>
        <p style={styles.bookAuthor}>{book.author}</p>
      </div>
    </div>
  );

  // Helper to render a highly premium minimal dynamic cover card
  const renderBookCover = (book) => {
    const colors = [
      'linear-gradient(135deg, #4f46e5, #3b82f6)', // Indigo-Blue
      'linear-gradient(135deg, #10b981, #059669)', // Emerald-Green
      'linear-gradient(135deg, #f59e0b, #d97706)', // Amber-Orange
      'linear-gradient(135deg, #ec4899, #be185d)', // Pink-Rose
      'linear-gradient(135deg, #8b5cf6, #7c3aed)', // Violet-Purple
      'linear-gradient(135deg, #ef4444, #dc2626)'  // Red
    ];
    const index = Math.abs(book.title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % colors.length;
    const background = colors[index];

    return (
      <div style={{
        ...styles.customBookCover,
        background: background
      }}>
        <div style={styles.customBookCoverTitle}>{book.title}</div>
        <div style={styles.customBookCoverAuthor}>{book.author}</div>
        <div style={styles.customBookCoverBadge}>BiblioTech</div>
      </div>
    );
  };

  // Carousel için özel büyük kitap kartı render fonksiyonu
  const renderCarouselBookCard = (book) => (
    <div
      key={book.id}
      style={styles.carouselBookCard}
      onClick={() => navigate("/books")}
    >
      <h3 style={styles.carouselBookTitle}>{book.title}</h3>
      <p style={styles.carouselBookAuthor}>{book.author}</p>
      <div style={styles.publisherBadge}>
        {book.publisher || "Bilgi Yayınevi"}
      </div>
    </div>
  );

  return (
    <div style={styles.container}>
      <style>
        {`
            .carousel-container-hover {
              position: relative;
              overflow: hidden;
            }
            .carousel-btn {
              position: absolute;
              top: 50%;
              margin-top: -30px;
              width: 80px;
              height: 80px;
              background: transparent !important;
              color: var(--text-muted) !important;
              border: none;
              display: flex;
              align-items: center;
              justify-content: center;
              z-index: 20;
              opacity: 0;
              cursor: pointer;
              transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
            }
            .carousel-btn-left {
              left: -10px;
              transform: translateX(-20px) scale(0.8);
            }
            .carousel-btn-right {
              right: -10px;
              transform: translateX(20px) scale(0.8);
            }
            .carousel-container-hover:hover .carousel-btn-left:not(:disabled) {
              opacity: 1;
              transform: translateX(10px) scale(1);
            }
            .carousel-container-hover:hover .carousel-btn-right:not(:disabled) {
              opacity: 1;
              transform: translateX(-10px) scale(1);
            }
            .carousel-btn:hover:not(:disabled) {
              color: var(--primary) !important;
              transform: scale(1.2) !important;
            }
            .carousel-btn:active:not(:disabled) {
              transform: scale(0.9) !important;
            }
          `}
      </style>
      {/* 1. Karşılama ve İstatistik Paneli */}
      <section style={styles.headerSection}>
        <div style={styles.welcomeText}>
          <h1 style={styles.greeting}>Merhaba, {user.username}! 👋</h1>
          <p style={styles.greetingSub}>
            Kütüphanene hoş geldin, işte okuma serüvenin.
          </p>
        </div>

        <div style={styles.statsRow}>
          <div style={styles.statCard}>
            <div
              style={{
                ...styles.statIconBox,
                background: "rgba(59, 130, 246, 0.1)",
                color: "#3b82f6",
              }}
            >
              <FiBookmark style={styles.statIconSize} />
            </div>
            <div style={styles.statDetails}>
              <p style={styles.statLabel}>Alınan Toplam Kitap</p>
              <h2 style={styles.statValue}>{totalBorrowed}</h2>
            </div>
          </div>

          <div style={styles.statCard}>
            <div
              style={{
                ...styles.statIconBox,
                background: "rgba(16, 185, 129, 0.1)",
                color: "#10b981",
              }}
            >
              <FiCheckCircleIcon style={styles.statIconSize} />
            </div>
            <div style={styles.statDetails}>
              <p style={styles.statLabel}>Okunan Kitaplar (İade Edilen)</p>
              <h2 style={styles.statValue}>{readBooks}</h2>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Kişiselleştirilmiş Öneriler */}
      {personalizedBooks.length > 0 && (
        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <FiStar style={styles.sectionIcon} />
            <h2 style={styles.sectionTitle}>
              Sizin Okuma Zevkinize Benzeyen Seçimler
            </h2>
          </div>
          <p style={styles.sectionDesc}>
            Okumayı sevdiğiniz kategorilerde, kütüphanemizdeki diğer
            kullanıcıların en çok okuduğu ve sizin henüz keşfetmediğiniz popüler
            eserler.
          </p>

          <div
            className="carousel-container-hover"
            style={styles.carouselContainer}
          >
            <button
              className="carousel-btn carousel-btn-left"
              style={{
                opacity: personalizedIndex === 0 ? 0.3 : 0,
              }}
              onClick={() =>
                personalizedIndex > 0 &&
                setPersonalizedIndex(personalizedIndex - 1)
              }
              disabled={personalizedIndex === 0}
            >
              <FiChevronLeft style={styles.carouselIcon} />
            </button>

            <div style={styles.carouselViewport}>
              <div
                style={{
                  ...styles.carouselTrack,
                  transform: `translateX(-${personalizedIndex * (100 / 3)}%)`,
                }}
              >
                {personalizedBooks.map((book) => (
                  <div key={book.id} style={styles.carouselItem}>
                    {renderCarouselBookCard(book)}
                  </div>
                ))}
              </div>
            </div>

            <button
              className="carousel-btn carousel-btn-right"
              style={{
                opacity:
                  personalizedIndex >= personalizedBooks.length - 3 ? 0.3 : 0,
              }}
              onClick={() =>
                personalizedIndex < personalizedBooks.length - 3 &&
                setPersonalizedIndex(personalizedIndex + 1)
              }
              disabled={personalizedIndex >= personalizedBooks.length - 3}
            >
              <FiChevronRight style={styles.carouselIcon} />
            </button>
          </div>
        </section>
      )}

      {/* 3. Genel Popüler Kitaplar */}
      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <FiTrendingUp style={styles.sectionIcon} />
          <h2 style={styles.sectionTitle}>Kütüphanemizin En Gözdeleri</h2>
        </div>
        <p style={styles.sectionDesc}>
          Sistemde genel olarak en çok tercih edilen ve ödünç alınan kitaplar.
        </p>

        <div
          className="carousel-container-hover"
          style={styles.carouselContainer}
        >
          <button
            className="carousel-btn carousel-btn-left"
            style={{
              opacity: popularIndex === 0 ? 0.3 : 0,
            }}
            onClick={() =>
              popularIndex > 0 && setPopularIndex(popularIndex - 1)
            }
            disabled={popularIndex === 0}
          >
            <FiChevronLeft style={styles.carouselIcon} />
          </button>

          <div style={styles.carouselViewport}>
            <div
              style={{
                ...styles.carouselTrack,
                transform: `translateX(-${popularIndex * (100 / 3)}%)`,
              }}
            >
              {popularBooks.map((book) => (
                <div key={book.id} style={styles.carouselItem}>
                  {renderCarouselBookCard(book)}
                </div>
              ))}
            </div>
          </div>

          <button
            className="carousel-btn carousel-btn-right"
            style={{
              opacity: popularIndex >= popularBooks.length - 3 ? 0.3 : 0,
            }}
            onClick={() =>
              popularIndex < popularBooks.length - 3 &&
              setPopularIndex(popularIndex + 1)
            }
            disabled={popularIndex >= popularBooks.length - 3}
          >
            <FiChevronRight style={styles.carouselIcon} />
          </button>
        </div>
      </section>

      {/* 4. Keşif ve Filtreleme Bölümü */}
      <section style={{ ...styles.section, ...styles.searchSection }}>
        <h2 style={styles.searchTitle}>Farklı Bir Kategori mi Arıyorsunuz?</h2>
        <p style={styles.searchDesc}>
          Kategori adını (örn. Bilim Kurgu, Edebiyat) veya anahtar kelime
          yazarak anında kitap önerisi alın.
        </p>

        <div style={styles.searchBox}>
          <FiSearch style={styles.searchIcon} />
          <input
            type="text"
            placeholder="Kategori veya kelime girin..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        {searchTerm && (
          <div style={styles.searchResults}>
            {filteredBooks.length > 0 ? (
              <div style={styles.booksGrid}>
                {filteredBooks.map(renderBookCard)}
              </div>
            ) : (
              <p style={styles.noResult}>Bu aramaya uygun kitap bulunamadı.</p>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

// Custom icon
const FiCheckCircleIcon = (props) => (
  <svg
    stroke="currentColor"
    fill="none"
    strokeWidth="2"
    viewBox="0 0 24 24"
    strokeLinecap="round"
    strokeLinejoin="round"
    height="1em"
    width="1em"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

const styles = {
  container: {
    padding: "2rem",
    maxWidth: "95%",
    margin: "0 auto",
    fontFamily: "var(--font-sans)",
  },
  headerSection: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    gap: "5rem",
    background:
      "linear-gradient(135deg, rgba(31, 28, 92, 1), rgba(49, 23, 94, 1))" /* Brand's dark indigo/violet */,
    padding: "6rem 5rem",
    minHeight:
      "calc(100vh - 120px)" /* Fills the screen so carousels are below the fold */,
    borderRadius: "32px",
    border: "1px solid rgba(255, 255, 255, 0.05)",
    marginBottom: "4rem",
    boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
  },
  welcomeText: {
    marginBottom: "0.5rem",
  },
  greeting: {
    fontSize: "3rem",
    fontWeight: "800",
    color: "#ffffff",
    margin: "0 0 0.5rem 0",
  },
  greetingSub: {
    fontSize: "1.2rem",
    color: "rgba(255, 255, 255, 0.6)",
    margin: 0,
  },
  statsRow: {
    display: "flex",
    gap: "2rem",
    flexWrap: "wrap",
  },
  statCard: {
    flex: "1 1 200px" /* reduced flex basis */,
    display: "flex",
    alignItems: "center",
    gap: "1rem" /* reduced from 1.5rem */,
    background: "rgba(255, 255, 255, 0.05)",
    padding: "1.75rem" /* reduced from 2.5rem */,
    borderRadius: "16px" /* reduced from 24px */,
    border: "1px solid rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(10px)",
  },
  statIconBox: {
    width: "50px" /* reduced from 70px */,
    height: "50px",
    borderRadius: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  statIconSize: {
    fontSize: "1.4rem" /* reduced from 2rem */,
  },
  statDetails: {
    display: "flex",
    flexDirection: "column",
  },
  statLabel: {
    fontSize: "0.8rem" /* reduced from 1rem */,
    color: "rgba(255, 255, 255, 0.5)",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    margin: "0 0 0.5rem 0",
    fontWeight: "600",
  },
  statValue: {
    fontSize: "2.1rem" /* reduced from 3rem */,
    fontWeight: "800",
    color: "#ffffff",
    margin: 0,
    lineHeight: 1,
  },
  section: {
    marginBottom: "3rem",
  },
  sectionHeader: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    marginBottom: "0.5rem",
  },
  sectionIcon: {
    fontSize: "1.5rem",
    color: "var(--primary)",
  },
  sectionTitle: {
    fontSize: "1.5rem",
    fontWeight: "700",
    color: "var(--text-main)",
    margin: 0,
  },
  sectionDesc: {
    color: "var(--text-muted)",
    marginBottom: "1.5rem",
    fontSize: "0.95rem",
  },
  booksGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "1.5rem",
  },
  bookCard: {
    background: "var(--bg-sidebar)",
    border: "1px solid var(--border-light)",
    borderRadius: "16px",
    padding: "1.5rem",
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    cursor: "pointer",
    transition:
      "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
  },
  bookIconWrapper: {
    width: "48px",
    height: "48px",
    borderRadius: "12px",
    background: "var(--primary-glow)",
    color: "var(--primary)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  bookIcon: {
    fontSize: "1.25rem",
  },
  bookInfo: {
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  bookTitle: {
    margin: "0 0 0.25rem 0",
    fontSize: "1rem",
    fontWeight: "600",
    color: "var(--text-main)",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  bookAuthor: {
    margin: 0,
    fontSize: "0.85rem",
    color: "var(--text-muted)",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  searchSection: {
    background: "linear-gradient(135deg, var(--bg-sidebar), var(--bg-main))",
    padding: "3rem",
    borderRadius: "24px",
    border: "1px solid var(--border-light)",
    textAlign: "center",
  },
  searchTitle: {
    fontSize: "1.75rem",
    fontWeight: "700",
    color: "var(--text-main)",
    marginBottom: "0.75rem",
    margin: 0,
  },
  searchDesc: {
    color: "var(--text-muted)",
    marginBottom: "2rem",
  },
  searchBox: {
    position: "relative",
    maxWidth: "600px",
    margin: "0 auto",
  },
  searchIcon: {
    position: "absolute",
    left: "1.5rem",
    top: "50%",
    transform: "translateY(-50%)",
    color: "var(--text-muted)",
    fontSize: "1.25rem",
  },
  searchInput: {
    width: "100%",
    padding: "1.25rem 1.25rem 1.25rem 3.5rem",
    fontSize: "1.1rem",
    borderRadius: "50px",
    border: "2px solid var(--border-light)",
    background: "var(--bg-main)",
    color: "var(--text-main)",
    outline: "none",
    transition: "border-color 0.3s ease",
  },
  searchResults: {
    marginTop: "2rem",
    textAlign: "left",
  },
  noResult: {
    textAlign: "center",
    color: "var(--text-muted)",
    padding: "2rem",
    background: "var(--bg-main)",
    borderRadius: "16px",
    border: "1px dashed var(--border-light)",
  },
  carouselContainer: {
    display: "flex",
    alignItems: "center",
    background: "var(--bg-sidebar)",
    padding: "1rem 0" /* Further reduced padding for shorter height */,
    borderRadius: "24px",
    border: "1px solid var(--border-light)",
    gap: "0",
    boxShadow: "0 10px 30px rgba(0,0,0,0.02)",
    minHeight: "280px" /* 35% Shorter height */,
    position: "relative",
  },
  carouselBtn: {
    background: "var(--bg-main)",
    border: "1px solid var(--border-light)",
    borderRadius: "50%",
    width: "48px",
    height: "48px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "var(--text-main)",
    flexShrink: 0,
    transition: "all 0.2s ease",
    zIndex: 2,
  },
  carouselIcon: {
    fontSize: "2.5rem",
  },
  carouselViewport: {
    flex: 1,
    overflow: "hidden",
    padding:
      "10px 40px" /* Slightly less horizontal padding since box is wider */,
    height: "100%",
  },
  carouselTrack: {
    display: "flex",
    transition: "transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)",
    height: "100%",
    gap: "8px",
  },
  carouselItem: {
    width: "calc(33.333% - 5.33px)",
    flexShrink: 0,
    padding: "0",
    boxSizing: "border-box",
    display: "flex",
  },
  carouselBookCard: {
    flex: 1,
    background: "var(--bg-sidebar)",
    border: "1px solid var(--border-light)",
    borderRadius: "16px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem",
    cursor: "pointer",
    transition: "all var(--transition-fast) ease",
    textAlign: "center",
    boxSizing: "border-box",
    minHeight: "180px",
  },
  carouselBookTitle: {
    margin: "0 0 0.5rem 0",
    fontSize: "1.25rem",
    fontWeight: "700",
    color: "var(--text-main)",
    lineHeight: "1.3",
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
  },
  carouselBookAuthor: {
    margin: "0 0 1rem 0",
    fontSize: "0.95rem",
    color: "var(--text-muted)",
    fontWeight: "500",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    width: "100%",
  },
  publisherBadge: {
    background: "rgba(99, 102, 241, 0.1)",
    color: "var(--primary)",
    padding: "0.25rem 0.75rem",
    borderRadius: "20px",
    fontSize: "0.75rem",
    fontWeight: "600",
    display: "inline-block",
    maxWidth: "100%",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
};
