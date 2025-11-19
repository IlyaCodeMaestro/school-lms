export interface Student {
  id: string;
  name: string;
}

export interface Teacher {
  id: string;
  name: string;
}

export interface LearningElement {
  id: string;
  name: string;
  type: 'lesson' | 'assignment';
}

export interface Post {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  authorId: string;
  authorName: string;
  authorType: 'teacher' | 'student';
  createdAt: Date;
  tags: {
    students: string[];
    teachers: string[];
    learningElements: string[];
  };
}

export interface User {
  id: string;
  email: string;
  name: string;
  password: string; // Hashed in real app, stored plaintext here for mock
  avatar: string;
  type: 'teacher' | 'student';
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export interface FilterState {
  selectedStudents: string[];
  selectedTeachers: string[];
  selectedLessons: string[];
  showOnlyMyPosts: boolean;
}
