'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Post, Student, LearningElement } from '@/lib/types';
import { useToast } from '@/components/toast-provider';
import { useAuthStore } from '@/lib/auth-store';

interface CreatePostModalProps {
  students: Student[];
  lessons: LearningElement[];
  onClose: () => void;
  onSave: (post: Post) => void;
}

export function CreatePostModal({
  students,
  lessons,
  onClose,
  onSave,
}: CreatePostModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [selectedLessons, setSelectedLessons] = useState<string[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addToast } = useToast();
  const { user } = useAuthStore();

  const handleSubmit = () => {
    const newErrors: string[] = [];

    if (!title.trim()) {
      newErrors.push('Заголовок обязателен');
    }

    if (selectedStudents.length === 0 && selectedLessons.length === 0) {
      newErrors.push('Выберите хотя бы один тег (ученика или урок)');
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    if (!user) {
      setErrors(['Не удалось определить автора. Войдите в систему и попробуйте снова.']);
      return;
    }

    setIsSubmitting(true);

    const newPost: Post = {
      id: `post-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      imageUrl: imageUrl || '/educational-achievement.jpg',
      authorId: user.id,
      authorName: user.name,
      authorType: user.type,
      createdAt: new Date(),
      tags: {
        students: selectedStudents,
        teachers: [],
        learningElements: selectedLessons,
      },
    };

    setTimeout(() => {
      onSave(newPost);
      setTitle('');
      setDescription('');
      setImageUrl('');
      setSelectedStudents([]);
      setSelectedLessons([]);
      setErrors([]);
      setIsSubmitting(false);
    }, 300);
  };

  const handleCancel = () => {
    if (title.trim() || description.trim() || imageUrl.trim() || selectedStudents.length > 0 || selectedLessons.length > 0) {
      // Only show toast if user made changes
      try {
        addToast('Действие отменено', 'info');
      } catch (e) {
        // Toast might not be available
      }
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg rounded-xl bg-card p-6 shadow-xl border border-border animate-in">
        <h2 className="mb-1 text-2xl font-bold text-foreground">Создать пост</h2>
        <p className="mb-6 text-sm text-muted-foreground">Поделитесь достижением ученика</p>

        {errors.length > 0 && (
          <div className="mb-4 rounded-lg bg-red-50 dark:bg-red-950/30 p-4 text-sm text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900">
            {errors.map((err, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span className="mt-0.5">•</span>
                <span>{err}</span>
              </div>
            ))}
          </div>
        )}

        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Заголовок <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.length > 0) setErrors([]);
              }}
              placeholder="Введите название достижения"
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Описание
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Добавьте деталей об этом достижении..."
              rows={3}
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              URL изображения
            </label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg (опционально)"
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Ученики <span className="text-red-500">*</span>
            </label>
            <div className="max-h-32 space-y-2 overflow-y-auto border border-border rounded-lg p-3 bg-muted/30">
              {students.map((student) => (
                <label key={student.id} className="flex items-center gap-3 cursor-pointer hover:bg-muted/50 p-1.5 rounded transition-colors">
                  <input
                    type="checkbox"
                    checked={selectedStudents.includes(student.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedStudents([...selectedStudents, student.id]);
                      } else {
                        setSelectedStudents(
                          selectedStudents.filter((id) => id !== student.id)
                        );
                      }
                      if (errors.length > 0) setErrors([]);
                    }}
                    className="h-4 w-4 rounded border-border cursor-pointer accent-primary"
                  />
                  <span className="text-sm">{student.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Уроки <span className="text-red-500">*</span>
            </label>
            <div className="max-h-32 space-y-2 overflow-y-auto border border-border rounded-lg p-3 bg-muted/30">
              {lessons.map((lesson) => (
                <label key={lesson.id} className="flex items-center gap-3 cursor-pointer hover:bg-muted/50 p-1.5 rounded transition-colors">
                  <input
                    type="checkbox"
                    checked={selectedLessons.includes(lesson.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedLessons([...selectedLessons, lesson.id]);
                      } else {
                        setSelectedLessons(
                          selectedLessons.filter((id) => id !== lesson.id)
                        );
                      }
                      if (errors.length > 0) setErrors([]);
                    }}
                    className="h-4 w-4 rounded border-border cursor-pointer accent-primary"
                  />
                  <span className="text-sm">{lesson.name}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2.5 rounded-lg transition-all relative overflow-hidden group"
          >
            <span className="relative z-10">{isSubmitting ? 'Создание...' : 'Создать пост'}</span>
            <span className="absolute inset-0 bg-white opacity-0 group-active:opacity-20 transition-opacity" />
          </Button>
          <Button 
            onClick={handleCancel}
            variant="outline" 
            className="flex-1 rounded-lg relative overflow-hidden group"
          >
            <span className="relative z-10">Отмена</span>
            <span className="absolute inset-0 bg-black dark:bg-white opacity-0 group-active:opacity-10 transition-opacity" />
          </Button>
        </div>
      </div>
    </div>
  );
}
