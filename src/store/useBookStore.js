import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
          shelfNo: 'A-12', 
          stock: 5 
        },
        { 
          id: 'book-2', 
          title: 'Nutuk', 
          author: 'Mustafa Kemal Atatürk', 
          isbn: '9789752439115', 
          categoryIds: ['3'], 
          publishYear: 1927, 
          shelfNo: 'B-04', 
          stock: 3 
        },
        { 
          id: 'book-3', 
          title: 'Simyacı', 
          author: 'Paulo Coelho', 
          isbn: '9789750726439', 
          categoryIds: ['2'], 
          publishYear: 1988, 
          shelfNo: 'C-08', 
          stock: 4 
        }
      ],

      /**
       * Adds a new book to the library collection.
       * @param {Object} book - The book object to add.
       */
      addBook: (book) => set((state) => ({
        books: [...state.books, book],
      })),

      /**
       * Updates the details of an existing book by its ID.
       * @param {string|number} id - The ID of the book to update.
       * @param {Object} updatedBook - The new book details.
       */
      updateBook: (id, updatedBook) => set((state) => ({
        books: state.books.map((b) => (b.id === id ? { ...b, ...updatedBook } : b)),
      })),

      /**
       * Deletes a book from the library collection by its ID.
       * @param {string|number} id - The ID of the book to delete.
       */
      deleteBook: (id) => set((state) => ({
        books: state.books.filter((b) => b.id !== id),
      })),

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
