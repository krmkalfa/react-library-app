import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useStatsStore = create(
  persist(
    (set) => ({
      totalBooksCreated: 3, // Initialized with 3 mock books
      totalMembersRegistered: 2, // Ahmet Yılmaz and Ayşe Kaya
      totalLoansMade: 2, // loan-1 and loan-2

      incrementBooks: () => set((state) => ({ 
        totalBooksCreated: state.totalBooksCreated + 1 
      })),

      incrementMembers: () => set((state) => ({ 
        totalMembersRegistered: state.totalMembersRegistered + 1 
      })),

      incrementLoans: () => set((state) => ({ 
        totalLoansMade: state.totalLoansMade + 1 
      })),
    }),
    {
      name: 'library_stats', // Key used for LocalStorage persistence
    }
  )
);
