import { render, screen, fireEvent, act } from '@testing-library/react';
import LoginPage from '@/app/login/page';
import { ToastProvider } from '@/components/toast-provider';

const mockPush = vi.fn();
const loginMock = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

vi.mock('@/lib/auth-store', () => ({
  useAuthStore: () => ({ login: loginMock }),
}));

function renderWithProviders() {
  return render(
    <ToastProvider>
      <LoginPage />
    </ToastProvider>
  );
}

describe('LoginPage', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockPush.mockReset();
    loginMock.mockReset();
    localStorage.clear();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('prefills credentials when Remember Me was used', () => {
    localStorage.setItem(
      'rememberedCredentials',
      JSON.stringify({ email: 'saved@test.com', password: 'Secret1' })
    );

    renderWithProviders();

    expect(screen.getByLabelText('Email')).toHaveValue('saved@test.com');
    expect(screen.getByLabelText('Пароль')).toHaveValue('Secret1');
    expect(screen.getByLabelText('Запомнить меня')).toBeChecked();
  });

  it('stores credentials after successful login when Remember Me is checked', async () => {
    loginMock.mockReturnValue(true);
    renderWithProviders();

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'user@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Пароль'), {
      target: { value: 'Secret1' },
    });
    fireEvent.click(screen.getByLabelText('Запомнить меня'));
    fireEvent.click(screen.getByRole('button', { name: /Войти/i }));

    await act(async () => {
      vi.runAllTimers();
    });

    expect(loginMock).toHaveBeenCalledWith('user@example.com', 'Secret1');
    const stored = localStorage.getItem('rememberedCredentials');
    expect(stored).toContain('user@example.com');
  });

  it('shows validation error for invalid email', async () => {
    renderWithProviders();

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'invalid-email' },
    });
    fireEvent.change(screen.getByLabelText('Пароль'), {
      target: { value: 'Secret1' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Войти/i }));

    await act(async () => {
      vi.runAllTimers();
    });

    expect(screen.getByText('Введите корректный email')).toBeInTheDocument();
    expect(loginMock).not.toHaveBeenCalled();
  });
});

