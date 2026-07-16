import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useBookStore } from './useBookStore.js';

export const useCategoryStore = create(
  persist(
    (set) => ({
      // State representing the list of categories in the library system with mock defaults
      categories: [
        { id: '1', name: 'Yazılım' },
        { id: '2', name: 'Edebiyat' },
        { id: '3', name: 'Tarih' },
        { id: '4', name: 'Bilim Kurgu' }
      ],

      /**
       * Adds a new category to the library catalog.
       * @param {Object} category - The category object to add.
       */
      addCategory: (category) => set((state) => ({
        categories: [...state.categories, category],
      })),

      /**
       * Updates the details of a category by its ID.
       * @param {string|number} id - The ID of the category to update.
       * @param {Object} updatedCategory - The new category details.
       */
      updateCategory: (id, updatedCategory) => set((state) => ({
        categories: state.categories.map((c) => (c.id === id ? { ...c, ...updatedCategory } : c)),
      })),

      /**
       * Deletes a category by its ID.
       * Throws an error if the category is assigned to one or more books.
       * @param {string|number} id - The ID of the category to delete.
       * @throws {Error} If there is a book associated with the category.
       */
      deleteCategory: (id) => {
        // Access the current books state from the useBookStore
        const books = useBookStore.getState().books;
        
        // Check if any book contains this category ID in its categoryIds array
        const hasLinkedBook = books.some((book) => 
          book.categoryIds && book.categoryIds.some((catId) => String(catId) === String(id))
        );
        
        if (hasLinkedBook) {
          throw new Error('Bu kategori silinemez çünkü bu kategoriye ait kayıtlı kitaplar bulunmaktadır.');
        }

        // Proceed to remove the category if no linked books are found
        set((state) => ({
          categories: state.categories.filter((c) => c.id !== id),
        }));
      },
    }),
    {
      name: 'library_categories', // Key used for LocalStorage persistence
    }
  )
);
