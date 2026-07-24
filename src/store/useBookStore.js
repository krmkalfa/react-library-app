import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useLoanStore } from './useLoanStore.js';
import { useStatsStore } from './useStatsStore.js';

export const useBookStore = create(
  persist(
    (set) => ({
      // State representing the collection of books in the library with mock defaults
      books: [
        { 
          id: 'book-1', 
          title: 'Clean Code', 
          author: 'Robert C. Martin', 
          isbn: '9780132350884', 
          categoryIds: ['1', '4'], 
          publishYear: 2008, 
          publisher: 'Prentice Hall',
          shelfNo: 'A-12', 
          stock: 5,
          isDeleted: false
        },
        { 
          id: 'book-2', 
          title: 'Nutuk', 
          author: 'Mustafa Kemal Atatürk', 
          isbn: '9789752439115', 
          categoryIds: ['3'], 
          publishYear: 1927, 
          publisher: 'Atatürk Araştırma Merkezi',
          shelfNo: 'B-04', 
          stock: 3,
          isDeleted: false
        },
        { 
          id: 'book-3', 
          title: 'Simyacı', 
          author: 'Paulo Coelho', 
          isbn: '9789750726439', 
          categoryIds: ['2'], 
          publishYear: 1988, 
          publisher: 'Can Yayınları',
          shelfNo: 'C-08', 
          stock: 4,
          isDeleted: false
        }
      ],

      /**
       * Adds a new book to the library collection.
       * @param {Object} book - The book object to add.
       */
      addBook: (book) => set((state) => {
        const title = book.title.trim().toLowerCase();
        const author = book.author.trim().toLowerCase();
        const publishYear = Number(book.publishYear);

        // Composite key duplicate validation check
        const duplicate = state.books.some(
          (b) =>
            b.title.trim().toLowerCase() === title &&
            b.author.trim().toLowerCase() === author &&
            Number(b.publishYear) === publishYear
        );

        if (duplicate) {
          throw new Error("Bu kitap ismi, yazar ve yayın yılına sahip bir kitap sistemde zaten kayıtlı!");
        }

        useStatsStore.getState().incrementBooks();

        return { books: [...state.books, { ...book, isDeleted: false }] };
      }),

      /**
       * Updates the details of an existing book by its ID.
       * @param {string|number} id - The ID of the book to update.
       * @param {Object} updatedBook - The new book details.
       */
      updateBook: (id, updatedBook) => set((state) => {
        const title = updatedBook.title?.trim().toLowerCase();
        const author = updatedBook.author?.trim().toLowerCase();
        const publishYear = updatedBook.publishYear ? Number(updatedBook.publishYear) : null;

        // Composite key duplicate validation check excluding self
        if (title && author && publishYear) {
          const duplicate = state.books.some(
            (b) =>
              b.id !== id &&
              b.title.trim().toLowerCase() === title &&
              b.author.trim().toLowerCase() === author &&
              Number(b.publishYear) === publishYear
          );

          if (duplicate) {
            throw new Error("Bu kitap ismi, yazar ve yayın yılına sahip bir kitap sistemde zaten kayıtlı!");
          }
        }

        return {
          books: state.books.map((b) => (b.id === id ? { ...b, ...updatedBook } : b)),
        };
      }),

      /**
       * Deletes a book from the library collection by its ID.
       * Uses Soft Delete if the book has active loans, otherwise hard deletes it.
       * @param {string|number} id - The ID of the book to delete.
       */
      deleteBook: (id) => set((state) => {
        const loans = useLoanStore.getState().loans;
        const hasActiveLoans = loans.some(
          (l) => String(l.bookId) === String(id) && l.status === 'active'
        );

        if (hasActiveLoans) {
          // Soft Delete
          return {
            books: state.books.map((b) => (b.id === id ? { ...b, isDeleted: true } : b))
          };
        } else {
          // Hard Delete
          return {
            books: state.books.filter((b) => b.id !== id)
          };
        }
      }),

      /**
       * Decrements the stock of a book by 1 when it is borrowed.
       * @param {string|number} bookId - The ID of the book whose stock to decrement.
       */
      decrementStock: (bookId) => set((state) => ({
        books: state.books.map((b) => {
          if (b.id === bookId) {
            const currentStock = Number(b.stock) || 0;
            return { ...b, stock: Math.max(0, currentStock - 1) };
          }
          return b;
        }),
      })),

      /**
       * Increments the stock of a book by 1 when it is returned.
       * @param {string|number} bookId - The ID of the book whose stock to increment.
       */
      incrementStock: (bookId) => set((state) => ({
        books: state.books.map((b) => {
          if (b.id === bookId) {
            const currentStock = Number(b.stock) || 0;
            return { ...b, stock: currentStock + 1 };
          }
          return b;
        }),
      })),
    }),
    {
      name: 'library_books', // Key used for LocalStorage persistence
    }
  )
);
