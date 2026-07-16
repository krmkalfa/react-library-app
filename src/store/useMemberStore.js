import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Helper to generate a unique 8-digit random member number
export const generateUniqueMemberNo = (members) => {
  let attempts = 0;
  while (attempts < 1000) {
    const candidate = Math.floor(10000000 + Math.random() * 90000000).toString();
    const exists = members.some((m) => m.memberNo === candidate);
    if (!exists) return candidate;
    attempts++;
  }
  return Date.now().toString().slice(-8); // fallback
};

export const useMemberStore = create(
  persist(
    (set) => ({
      // State representing the list of library members
      members: [],

      /**
       * Adds a new member to the library system.
       * @param {Object} member - The member object to add.
       */
      addMember: (member) => set((state) => {
        const incomingEmail = member.email.trim().toLowerCase();
        const incomingPhone = member.phone.replace(/\D/g, '');

        // Validation: system-wide unique email and phone
        const emailExists = state.members.some(
          (m) => m.email.trim().toLowerCase() === incomingEmail
        );
        const phoneExists = state.members.some(
          (m) => m.phone.replace(/\D/g, '') === incomingPhone
        );

        if (emailExists || phoneExists) {
          throw new Error("Bu e-posta adresi veya telefon numarası zaten başka bir üye tarafından kullanılıyor!");
        }

        // Auto-generate 8-digit unique memberNo if not strictly 8 digits
        let finalMemberNo = member.memberNo;
        if (!finalMemberNo || finalMemberNo.includes('MEM') || finalMemberNo.length !== 8) {
          finalMemberNo = generateUniqueMemberNo(state.members);
        }

        const newMember = {
          ...member,
          memberNo: finalMemberNo,
          phone: incomingPhone, // Store cleaned phone number
          password: member.password || finalMemberNo // Default password to memberNo
        };

        return {
          members: [...state.members, newMember]
        };
      }),

      /**
       * Updates details of an existing member by their ID.
       * @param {string|number} id - The ID of the member to update.
       * @param {Object} updatedMember - The new member details.
       */
      updateMember: (id, updatedMember) => set((state) => {
        const incomingEmail = updatedMember.email?.trim().toLowerCase();
        const incomingPhone = updatedMember.phone?.replace(/\D/g, '');

        // Validation: system-wide unique email and phone excluding self
        if (incomingEmail || incomingPhone) {
          const emailExists = state.members.some(
            (m) => m.id !== id && m.email.trim().toLowerCase() === incomingEmail
          );
          const phoneExists = state.members.some(
            (m) => m.id !== id && m.phone.replace(/\D/g, '') === incomingPhone
          );

          if (emailExists || phoneExists) {
            throw new Error("Bu e-posta adresi veya telefon numarası zaten başka bir üye tarafından kullanılıyor!");
          }
        }

        return {
          members: state.members.map((m) => {
            if (m.id === id) {
              const cleanedPhone = updatedMember.phone ? updatedMember.phone.replace(/\D/g, '') : m.phone;
              return {
                ...m,
                ...updatedMember,
                phone: cleanedPhone,
                email: updatedMember.email?.trim() || m.email
              };
            }
            return m;
          })
        };
      }),

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
