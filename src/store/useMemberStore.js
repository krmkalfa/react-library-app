import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useMemberStore = create(
  persist(
    (set) => ({
      // State representing the list of library members
      members: [],

      /**
       * Adds a new member to the library system.
       * @param {Object} member - The member object to add.
       */
      addMember: (member) => set((state) => ({
        members: [...state.members, member],
      })),

      /**
       * Updates details of an existing member by their ID.
       * @param {string|number} id - The ID of the member to update.
       * @param {Object} updatedMember - The new member details.
       */
      updateMember: (id, updatedMember) => set((state) => ({
        members: state.members.map((m) => (m.id === id ? { ...m, ...updatedMember } : m)),
      })),

      /**
       * Deletes a member from the system by their ID.
       * @param {string|number} id - The ID of the member to delete.
       */
      deleteMember: (id) => set((state) => ({
        members: state.members.filter((m) => m.id !== id),
      })),
    }),
    {
      name: 'library_members', // Key used for LocalStorage persistence
    }
  )
);
