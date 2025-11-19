import { create } from 'zustand';
import { Post, FilterState } from './types';
import { mockPosts } from './mock-data';

interface PostStore {
  posts: Post[];
  filteredPosts: Post[];
  filters: FilterState;
  currentUserId: string | null;
  setFilters: (filters: FilterState) => void;
  setCurrentUserId: (userId: string | null) => void;
  applyFilters: () => void;
  addPost: (post: Post) => void;
  updatePost: (id: string, post: Post) => void;
  deletePost: (id: string) => void;
  resetFilters: () => void;
}

const defaultFilters: FilterState = {
  selectedStudents: [],
  selectedTeachers: [],
  selectedLessons: [],
  showOnlyMyPosts: false,
};

const filterPosts = (posts: Post[], filters: FilterState, currentUserId: string | null) => {
  const { selectedStudents, selectedTeachers, selectedLessons, showOnlyMyPosts } = filters;

  let filtered = [...posts];

  if (showOnlyMyPosts) {
    filtered = filtered.filter((post) => (currentUserId ? post.authorId === currentUserId : false));
  }

  if (selectedStudents.length > 0) {
    filtered = filtered.filter((post) =>
      selectedStudents.some((sid) => post.tags.students.includes(sid))
    );
  }

  if (selectedTeachers.length > 0) {
    filtered = filtered.filter((post) =>
      selectedTeachers.some((tid) => post.tags.teachers.includes(tid))
    );
  }

  if (selectedLessons.length > 0) {
    filtered = filtered.filter((post) =>
      selectedLessons.some((lid) => post.tags.learningElements.includes(lid))
    );
  }

  return filtered;
};

export const usePostStore = create<PostStore>((set, get) => ({
  posts: mockPosts,
  filteredPosts: mockPosts,
  filters: defaultFilters,
  currentUserId: null,

  setFilters: (filters: FilterState) => set({ filters }),

  setCurrentUserId: (userId: string | null) =>
    set((state) => ({
      currentUserId: userId,
      filteredPosts: filterPosts(state.posts, state.filters, userId),
    })),

  applyFilters: () => {
    const { posts, filters, currentUserId } = get();
    set({ filteredPosts: filterPosts(posts, filters, currentUserId) });
  },

  addPost: (post: Post) => {
    set((state) => {
      const newPosts = [post, ...state.posts];
      return {
        posts: newPosts,
        filteredPosts: filterPosts(newPosts, state.filters, state.currentUserId),
      };
    });
  },

  updatePost: (id: string, updatedPost: Post) => {
    set((state) => ({
      posts: state.posts.map((p) => (p.id === id ? updatedPost : p)),
      filteredPosts: state.filteredPosts.map((p) => (p.id === id ? updatedPost : p)),
    }));
  },

  deletePost: (id: string) => {
    set((state) => ({
      posts: state.posts.filter((p) => p.id !== id),
      filteredPosts: state.filteredPosts.filter((p) => p.id !== id),
    }));
  },

  resetFilters: () => {
    set((state) => ({
      filters: defaultFilters,
      filteredPosts: filterPosts(state.posts, defaultFilters, state.currentUserId),
    }));
  },
}));
