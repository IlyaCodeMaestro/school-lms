"use client";

import { useEffect, useRef, useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { NavigationTabs } from "@/components/navigation-tabs";
import { FilterSidebar } from "@/components/filter-sidebar";
import { PostCard } from "@/components/post-card";
import { CreatePostModal } from "@/components/create-post-modal";
import { Button } from "@/components/ui/button";
import { usePostStore } from "@/lib/store";
import { useAuthStore } from "@/lib/auth-store";
import { useToast } from "@/components/toast-provider";
import {
  students,
  teachers,
  learningElementsData,
  CURRENT_GROUP,
} from "@/lib/mock-data";

export default function PortfolioPage() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const {
    posts,
    filteredPosts,
    filters,
    setFilters,
    setCurrentUserId,
    applyFilters,
    addPost,
    updatePost,
    deletePost,
  } = usePostStore();
  const { addToast } = useToast();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [displayedPosts, setDisplayedPosts] = useState<typeof filteredPosts>(
    []
  );
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const observerTarget = useRef<HTMLDivElement>(null);

  const postsPerPage = 15;

  // Create lookup maps
  const studentMap = useMemo(
    () => Object.fromEntries(students.map((s) => [s.id, s.name])),
    []
  );
  const teacherMap = useMemo(
    () => Object.fromEntries(teachers.map((t) => [t.id, t.name])),
    []
  );
  const lessonMap = useMemo(
    () => Object.fromEntries(learningElementsData.map((l) => [l.id, l.name])),
    []
  );

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    setCurrentUserId(user?.id ?? null);
  }, [setCurrentUserId, user?.id]);

  // Load more posts
  const loadMore = useCallback(() => {
    if (isLoading || !hasMorePosts) return;

    setIsLoading(true);
    setTimeout(() => {
      const start = page * postsPerPage;
      const end = start + postsPerPage;
      const newPosts = filteredPosts.slice(start, end);

      if (newPosts.length === 0) {
        setHasMorePosts(false);
      } else {
        setDisplayedPosts((prev) => [...prev, ...newPosts]);
        setPage((p) => p + 1);
      }

      setIsLoading(false);
    }, 300);
  }, [page, filteredPosts, isLoading, hasMorePosts, postsPerPage]);

  // Intersection observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          !isLoading &&
          hasMorePosts &&
          displayedPosts.length < filteredPosts.length
        ) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [
    loadMore,
    isLoading,
    hasMorePosts,
    displayedPosts.length,
    filteredPosts.length,
  ]);

  useEffect(() => {
    const initial = filteredPosts.slice(0, postsPerPage);
    setDisplayedPosts(initial);
    setPage(initial.length > 0 ? 1 : 0);
    setHasMorePosts(filteredPosts.length > initial.length);
  }, [filteredPosts, postsPerPage]);

  const handleApplyFilters = () => {
    applyFilters();
    setDisplayedPosts([]);
    setPage(0);
    setHasMorePosts(true);
  };

  const handleCreatePost = (newPost: any) => {
    addPost(newPost);
    setShowCreateModal(false);
    addToast("Пост успешно создан!", "success");
  };

  const handleResetFilters = () => {
    setFilters({
      selectedStudents: [],
      selectedTeachers: [],
      selectedLessons: [],
      showOnlyMyPosts: false,
    });
    applyFilters();
    setDisplayedPosts([]);
    setPage(0);
    setHasMorePosts(true);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <NavigationTabs />

      {/* Group header */}
      <div className="border-b border-border bg-card px-4 md:px-6 py-4 md:py-6">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-linear-to-br from-primary to-accent text-lg font-bold text-primary-foreground shrink-0">
              7Б
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground truncate">
                {CURRENT_GROUP.name}
              </h1>
              <p className="text-xs md:text-sm text-muted-foreground mt-1">
                Портфолио учебных достижений
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl gap-4 md:gap-6 px-4 md:px-6 py-4 md:py-6 flex-col md:flex-row">
        {/* Sidebar - hidden on mobile, shown as modal */}
        <aside className="hidden md:block w-80 shrink-0">
          <div className="sticky top-24 space-y-4">
            <Button
              onClick={() => setShowCreateModal(true)}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all relative overflow-hidden group"
            >
              <span className="relative z-10">+ Создать пост</span>
              <span className="absolute inset-0 bg-white opacity-0 group-active:opacity-20 transition-opacity" />
            </Button>
            <FilterSidebar
              students={students}
              teachers={teachers}
              lessons={learningElementsData}
              filters={filters}
              onFilterChange={setFilters}
              onApplyFilters={handleApplyFilters}
              onResetFilters={handleResetFilters}
            />
          </div>
        </aside>

        {/* Mobile filter button and create post */}
        <div className="md:hidden flex gap-2">
          <Button
            onClick={() => setShowCreateModal(true)}
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 rounded-lg shadow-lg relative overflow-hidden group"
          >
            <span className="relative z-10">+ Создать</span>
            <span className="absolute inset-0 bg-white opacity-0 group-active:opacity-20 transition-opacity" />
          </Button>
          <Button
            onClick={() => setShowFilters(!showFilters)}
            variant="outline"
            className="shrink-0 px-4 rounded-lg relative overflow-hidden group"
          >
            <span className="relative z-10">⚙️</span>
            <span className="absolute inset-0 bg-black opacity-0 dark:bg-white group-active:opacity-10 transition-opacity" />
          </Button>
        </div>

        {/* Mobile filter modal */}
        {showFilters && (
          <>
            <div
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 md:hidden"
              onClick={() => setShowFilters(false)}
            />
            <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-40 md:hidden animate-in max-h-[80vh] overflow-y-auto rounded-t-2xl">
              <div className="p-4">
                <button
                  onClick={() => setShowFilters(false)}
                  className="mb-4 text-sm font-semibold text-muted-foreground hover:text-foreground"
                >
                  ✕ Закрыть
                </button>
                <FilterSidebar
                  students={students}
                  teachers={teachers}
                  lessons={learningElementsData}
                  filters={filters}
                  onFilterChange={setFilters}
                  onApplyFilters={() => {
                    handleApplyFilters();
                    setShowFilters(false);
                  }}
                  onResetFilters={() => {
                    handleResetFilters();
                    setShowFilters(false);
                  }}
                />
              </div>
            </div>
          </>
        )}

        {/* Feed */}
        <main className="flex-1 min-w-0">
          {displayedPosts.length === 0 && !isLoading ? (
            <div className="rounded-xl border border-dashed border-border bg-muted/30 p-8 md:p-12 text-center">
              <div className="mb-4 text-3xl md:text-4xl">📋</div>
              <p className="text-foreground font-semibold mb-2">Нет постов</p>
              <p className="text-muted-foreground text-sm mb-6">
                {filters.selectedStudents.length > 0 ||
                filters.selectedTeachers.length > 0 ||
                filters.selectedLessons.length > 0 ||
                filters.showOnlyMyPosts
                  ? "Попробуйте изменить или сбросить фильтры"
                  : "Создайте первый пост о достижении ученика"}
              </p>
              <Button
                onClick={() => setShowCreateModal(true)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg"
              >
                Создать пост
              </Button>
            </div>
          ) : (
            <div className="rounded-xl border border-border overflow-hidden bg-card shadow-sm">
              {displayedPosts.map((post, idx) => (
                <div
                  key={post.id}
                  className={idx > 0 ? "border-t border-border" : ""}
                >
                  <PostCard
                    post={post}
                    onUpdate={(updatedPost) =>
                      updatePost(updatedPost.id, updatedPost)
                    }
                    onDelete={deletePost}
                    studentNames={studentMap}
                    teacherNames={teacherMap}
                    lessonNames={lessonMap}
                    onDeleteToast={() => addToast("Пост удален", "success")}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Loading and infinite scroll target */}
          {displayedPosts.length > 0 && (
            <div ref={observerTarget} className="py-8 text-center">
              {isLoading ? (
                <div className="flex justify-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-primary animate-pulse-soft"></div>
                  <div
                    className="h-2.5 w-2.5 rounded-full bg-primary animate-pulse-soft"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="h-2.5 w-2.5 rounded-full bg-primary animate-pulse-soft"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                </div>
              ) : !hasMorePosts ? (
                <p className="text-sm text-muted-foreground">
                  ✓ Все посты загружены
                </p>
              ) : null}
            </div>
          )}
        </main>
      </div>

      {/* Create post modal */}
      {showCreateModal && (
        <CreatePostModal
          students={students}
          lessons={learningElementsData}
          onClose={() => setShowCreateModal(false)}
          onSave={handleCreatePost}
        />
      )}
    </div>
  );
}
