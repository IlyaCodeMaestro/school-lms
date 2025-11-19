import { render, screen } from '@testing-library/react';
import { PostCard } from '@/components/post-card';

let mockUser: any = { id: 'teacher-1', name: 'Тест', type: 'teacher' };

vi.mock('@/lib/auth-store', () => ({
  useAuthStore: () => ({ user: mockUser }),
}));

const basePost = {
  id: 'post-1',
  title: 'Заголовок',
  description: 'Описание',
  imageUrl: '',
  authorId: 'teacher-1',
  authorName: 'Автор',
  authorType: 'teacher' as const,
  createdAt: new Date(),
  tags: {
    students: ['student-1'],
    teachers: [],
    learningElements: ['lesson-1'],
  },
};

const studentNames = { 'student-1': 'Студент' };
const teacherNames = {};
const lessonNames = { 'lesson-1': 'Урок' };

describe('PostCard', () => {
  it('shows action buttons for own posts', () => {
    render(
      <PostCard
        post={basePost}
        onUpdate={vi.fn()}
        onDelete={vi.fn()}
        studentNames={studentNames}
        teacherNames={teacherNames}
        lessonNames={lessonNames}
      />
    );

    expect(screen.getByText('Редактировать')).toBeInTheDocument();
    expect(screen.getByText('Удалить')).toBeInTheDocument();
  });

  it('hides action buttons for other authors', () => {
    mockUser = { id: 'teacher-99', name: 'Другой', type: 'teacher' };

    render(
      <PostCard
        post={basePost}
        onUpdate={vi.fn()}
        onDelete={vi.fn()}
        studentNames={studentNames}
        teacherNames={teacherNames}
        lessonNames={lessonNames}
      />
    );

    expect(screen.queryByText('Редактировать')).not.toBeInTheDocument();
    expect(screen.queryByText('Удалить')).not.toBeInTheDocument();

    mockUser = { id: 'teacher-1', name: 'Тест', type: 'teacher' };
  });
});

