"use client";

import { Post } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { EditPostModal } from "./edit-post-modal";
import { useAuthStore } from "@/lib/auth-store";

interface PostCardProps {
  post: Post;
  onUpdate: (post: Post) => void;
  onDelete: (id: string) => void;
  studentNames: Record<string, string>;
  teacherNames: Record<string, string>;
  lessonNames: Record<string, string>;
  onDeleteToast?: () => void;
}

export function PostCard({
  post,
  onUpdate,
  onDelete,
  studentNames,
  teacherNames,
  lessonNames,
  onDeleteToast,
}: PostCardProps) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { user } = useAuthStore();
  const isOwn = user ? post.authorId === user.id : false;

  // Determine author type based on ID prefix
  const authorLabel = post.authorId.startsWith("teacher-")
    ? "Учитель"
    : post.authorId.startsWith("student-")
    ? "Ученик"
    : "Неизвестно";

  const timeAgo = formatDistanceToNow(new Date(post.createdAt), {
    addSuffix: true,
    locale: ru,
  });

  const handleDelete = () => {
    setIsDeleting(true);
    setTimeout(() => {
      onDelete(post.id);
      onDeleteToast?.();
      setIsDeleting(false);
    }, 200);
  };

  const avatarColors = [
    "bg-indigo-100 text-indigo-600",
    "bg-teal-100 text-teal-600",
    "bg-purple-100 text-purple-600",
    "bg-blue-100 text-blue-600",
    "bg-pink-100 text-pink-600",
  ];
  const colorIndex =
    (post.authorId.charCodeAt(0) + post.authorId.length) % avatarColors.length;
  const avatarColor = avatarColors[colorIndex];

  return (
    <>
      <div className="border-b border-border bg-card p-6 transition-all hover:bg-muted/30 hover:shadow-sm animate-in">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            {/* Author and time */}
            <div className="mb-3 flex items-center gap-3">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${avatarColor}`}
              >
                {post.authorName.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground">
                  {post.authorName} ({authorLabel})
                </p>
                <p className="text-xs text-muted-foreground">{timeAgo}</p>
              </div>
            </div>

            {/* Title and description */}
            <h3 className="mb-2 text-base font-semibold text-foreground line-clamp-2">
              {post.title}
            </h3>
            {post.description && (
              <p className="mb-4 text-sm text-foreground/80 line-clamp-3">
                {post.description}
              </p>
            )}

            {/* Image */}
            {post.imageUrl && (
              <div className="mb-4 overflow-hidden rounded-lg bg-muted border border-border">
                <img
                  src={post.imageUrl || "/placeholder.svg"}
                  alt={post.title}
                  className="h-48 w-full object-cover hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
            )}

            {/* Tags */}
            <div className="mb-4 flex flex-wrap gap-2">
              {post.tags.students.map((studentId) => (
                <span
                  key={studentId}
                  className="inline-flex items-center rounded-full bg-indigo-50 dark:bg-indigo-950/30 px-3 py-1 text-xs font-medium text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800"
                >
                  {studentNames[studentId] || "Unknown"}
                </span>
              ))}
              {post.tags.learningElements.map((elementId) => (
                <span
                  key={elementId}
                  className="inline-flex items-center rounded-full bg-purple-50 dark:bg-purple-950/30 px-3 py-1 text-xs font-medium text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-800"
                >
                  {lessonNames[elementId] || "Unknown"}
                </span>
              ))}
            </div>

            {/* Action buttons */}
            {isOwn && (
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowEditModal(true)}
                  className="text-xs h-8 rounded-lg relative overflow-hidden group"
                >
                  <span className="relative z-10">Редактировать</span>
                  <span className="absolute inset-0 bg-white opacity-0 group-active:opacity-20 transition-opacity" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="text-xs h-8 rounded-lg text-destructive hover:bg-destructive/10 relative overflow-hidden group"
                >
                  <span className="relative z-10">
                    {isDeleting ? "Удаление..." : "Удалить"}
                  </span>
                  <span className="absolute inset-0 bg-destructive opacity-0 group-active:opacity-20 transition-opacity" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showEditModal && (
        <EditPostModal
          post={post}
          onClose={() => setShowEditModal(false)}
          onSave={(updatedPost) => {
            onUpdate(updatedPost);
            setShowEditModal(false);
          }}
        />
      )}
    </>
  );
}
