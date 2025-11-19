import { render, screen, fireEvent, act } from '@testing-library/react';
import { CreatePostModal } from '@/components/create-post-modal';
import { ToastProvider } from '@/components/toast-provider';

const onSave = vi.fn();
const onClose = vi.fn();

let mockUser: any = {
  id: 'teacher-42',
  name: 'Тестовый Учитель',
  type: 'teacher',
};

vi.mock('@/lib/auth-store', () => ({
  useAuthStore: () => ({ user: mockUser }),
}));

const students = [
  { id: 'student-1', name: 'Студент 1' },
  { id: 'student-2', name: 'Студент 2' },
];

const lessons = [
  { id: 'lesson-1', name: 'Урок 1', type: 'lesson' as const },
];

function renderModal() {
  return render(
    <ToastProvider>
      <CreatePostModal
        students={students}
        lessons={lessons}
        onClose={onClose}
        onSave={onSave}
      />
    </ToastProvider>
  );
}

describe('CreatePostModal', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    onSave.mockReset();
    onClose.mockReset();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('saves a new post using the logged-in user data', async () => {
    renderModal();

    fireEvent.change(screen.getByLabelText(/Заголовок/i), {
      target: { value: 'Новое достижение' },
    });
    fireEvent.click(screen.getByLabelText(/Студент 1/i));
    fireEvent.click(screen.getByLabelText(/Урок 1/i));
    fireEvent.click(screen.getByRole('button', { name: /Создать пост/i }));

    await act(async () => {
      vi.runAllTimers();
    });

    expect(onSave).toHaveBeenCalled();
    const post = onSave.mock.calls[0][0];
    expect(post.authorName).toBe('Тестовый Учитель');
    expect(post.authorId).toBe('teacher-42');
  });

  it('shows an error when no user is available', () => {
    mockUser = null;
    renderModal();

    fireEvent.click(screen.getByRole('button', { name: /Создать пост/i }));

    expect(
      screen.getByText(/Не удалось определить автора/i)
    ).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();

    mockUser = {
      id: 'teacher-42',
      name: 'Тестовый Учитель',
      type: 'teacher',
    };
  });
});

