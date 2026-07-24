import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useBookStore } from './useBookStore.js';
import { useMemberStore } from './useMemberStore.js';
import { useStatsStore } from './useStatsStore.js';
import { toast } from 'react-toastify';

export const useLoanStore = create(
  persist(
    (set, get) => ({
      // State representing the historical and active record of book loans with mock data
      loans: [
        {
          id: 'loan-1',
          bookId: 'book-1',
          bookTitle: 'Clean Code',
          bookAuthor: 'Robert C. Martin',
          bookIsbn: '9780132350884',
          memberId: 'member-1',
          memberName: 'Ahmet Yılmaz',
          loanDate: '2026-07-01',
          dueDate: '2026-08-01',
          returnDate: null,
          status: 'active'
        },
        {
          id: 'loan-2',
          bookId: 'book-3',
          bookTitle: 'Simyacı',
          bookAuthor: 'Paulo Coelho',
          bookIsbn: '9789750726439',
          memberId: 'member-2',
          memberName: 'Ayşe Kaya',
          loanDate: '2026-06-15',
          dueDate: '2026-07-15',
          returnDate: '2026-07-10',
          status: 'returned'
        }
      ],

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

        const memberStore = useMemberStore.getState();
        const member = memberStore.members.find((m) => String(m.id) === String(loanData.memberId));

        if (!member) {
          throw new Error('The requested member could not be found.');
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
          bookTitle: book.title,
          bookAuthor: book.author,
          bookIsbn: book.isbn || '',
          memberName: member.fullName,
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

        useStatsStore.getState().incrementLoans();
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
        const updatedLoans = loans.map((l) => {
          if (String(l.id) === String(loanId)) {
            return {
              ...l,
              returnDate: today,
              status: 'returned',
            };
          }
          return l;
        });

        set({ loans: updatedLoans });

        // Check if returned book is soft-deleted and can now be permanently hard deleted
        const bookStore = useBookStore.getState();
        const book = bookStore.books.find((b) => String(b.id) === String(loan.bookId));
        
        if (book && book.isDeleted) {
          const hasOtherActiveLoans = updatedLoans.some(
            (l) => String(l.bookId) === String(loan.bookId) && l.status === 'active'
          );

          if (!hasOtherActiveLoans) {
            // Hard delete permanently
            bookStore.deleteBook(loan.bookId);
          }
        }
      },

      /**
       * Extends the due date of an active loan.
       * @param {string|number} loanId - The ID of the loan.
       * @param {string} newDueDate - The new due date.
       */
      extendDueDate: (loanId, newDueDate) => {
        set((state) => ({
          loans: state.loans.map((l) =>
            String(l.id) === String(loanId) ? { ...l, dueDate: newDueDate } : l
          ),
        }));
        toast.success("Son teslim tarihi başarıyla uzatıldı!");
      },

      /**
       * Hides a returned loan from the borrowing member's perspective.
       * @param {string|number} loanId - The ID of the loan record.
       */
      deleteLoanHistory: (loanId) => {
        set((state) => ({
          loans: state.loans.map((l) =>
            String(l.id) === String(loanId) ? { ...l, hiddenByMember: true } : l
          ),
        }));
        toast.success("Geçmiş kaydı başarıyla silindi");
      },
    }),
    {
      name: 'library_loans', // Key used for LocalStorage persistence
    }
  )
);
