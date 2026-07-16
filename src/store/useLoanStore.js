import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useBookStore } from './useBookStore.js';

export const useLoanStore = create(
  persist(
    (set, get) => ({
      // State representing the historical and active record of book loans
      loans: [],

      /**
       * Creates a new loan record for a member borrowing a book.
       * Verifies book existence and stock levels before proceeding.
       * Decrements the book stock on successful loan creation.
       * @param {Object} loanData - Contains bookId, memberId, and other loan details.
       * @throws {Error} If the book doesn't exist or is out of stock.
       */
      createLoan: (loanData) => {
        const bookStore = useBookStore.getState();
        const book = bookStore.books.find((b) => String(b.id) === String(loanData.bookId));

        if (!book) {
          throw new Error('The requested book could not be found in the catalog.');
        }

        const stockCount = Number(book.stock) || 0;
        if (stockCount <= 0) {
          throw new Error(`The book "${book.title}" is currently out of stock.`);
        }

        // Generate today's date formatted as YYYY-MM-DD
        const today = new Date().toISOString().split('T')[0];

        // Create the new loan record
        const newLoan = {
          id: Date.now().toString(),
          bookId: loanData.bookId,
          memberId: loanData.memberId,
          loanDate: today,
          status: 'active',
          returnDate: null,
          ...loanData, // Capture any additional metadata passed in
        };

        // Decrement stock in the book store
        bookStore.decrementStock(loanData.bookId);

        // Add the loan to the state
        set((state) => ({
          loans: [...state.loans, newLoan],
        }));
      },

      /**
       * Processes the return of a borrowed book.
       * Updates the return date and status of the loan.
       * Increments the book stock in the catalog.
       * @param {string|number} loanId - The ID of the loan record to close.
       * @throws {Error} If the loan record does not exist or is already returned.
       */
      returnBook: (loanId) => {
        const { loans } = get();
        const loanIndex = loans.findIndex((l) => String(l.id) === String(loanId));

        if (loanIndex === -1) {
          throw new Error('Loan record not found.');
        }

        const loan = loans[loanIndex];
        if (loan.status === 'returned') {
          throw new Error('This book has already been marked as returned.');
        }

        // Generate today's date formatted as YYYY-MM-DD
        const today = new Date().toISOString().split('T')[0];

        // Increment the book stock in the book store
        useBookStore.getState().incrementStock(loan.bookId);

        // Update the specific loan record in the state
        set((state) => ({
          loans: state.loans.map((l) => {
            if (String(l.id) === String(loanId)) {
              return {
                ...l,
                returnDate: today,
                status: 'returned',
              };
            }
            return l;
          }),
        }));
      },
    }),
    {
      name: 'library_loans', // Key used for LocalStorage persistence
    }
  )
);
