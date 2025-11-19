'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Post } from '@/lib/types';

interface EditPostModalProps {
  post: Post;
  onClose: () => void;
  onSave: (post: Post) => void;
}

export function EditPostModal({ post, onClose, onSave }: EditPostModalProps) {
  const [title, setTitle] = useState(post.title);
  const [description, setDescription] = useState(post.description);
  const [imageUrl, setImageUrl] = useState(post.imageUrl);
  const [errors, setErrors] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = () => {
    const newErrors: string[] = [];

    if (!title.trim()) {
      newErrors.push('Заголовок обязателен');
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSaving(true);

    setTimeout(() => {
      onSave({
        ...post,
        title: title.trim(),
        description: description.trim(),
        imageUrl,
      });
      setIsSaving(false);
    }, 200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg rounded-xl bg-card p-6 shadow-xl border border-border animate-in">
        <h2 className="mb-1 text-2xl font-bold text-foreground">Редактировать пост</h2>
        <p className="mb-6 text-sm text-muted-foreground">Измените информацию о достижении</p>

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
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Описание
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none"
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
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
            />
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <Button 
            onClick={handleSubmit} 
            disabled={isSaving}
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2.5 rounded-lg transition-all"
          >
            {isSaving ? 'Сохранение...' : 'Сохранить'}
          </Button>
          <Button 
            onClick={onClose} 
            variant="outline" 
            className="flex-1 rounded-lg"
          >
            Отмена
          </Button>
        </div>
      </div>
    </div>
  );
}
