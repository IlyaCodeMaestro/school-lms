'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FilterState, Student, Teacher, LearningElement } from '@/lib/types';
import { useToast } from '@/components/toast-provider';
import { mockPosts } from '@/lib/mock-data';

interface FilterSidebarProps {
  students: Student[];
  teachers: Teacher[];
  lessons: LearningElement[];
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onApplyFilters: () => void;
  onResetFilters: () => void;
}

export function FilterSidebar({
  students,
  teachers,
  lessons,
  filters,
  onFilterChange,
  onApplyFilters,
  onResetFilters,
}: FilterSidebarProps) {
  const { addToast } = useToast();
  const [expanded, setExpanded] = useState({
    students: false,
    teachers: false,
    lessons: false,
  });

  const handleExpand = (section: 'students' | 'teachers' | 'lessons') => {
    setExpanded({
      students: section === 'students' ? !expanded.students : false,
      teachers: section === 'teachers' ? !expanded.teachers : false,
      lessons: section === 'lessons' ? !expanded.lessons : false,
    });
  };

  const handleStudentToggle = (studentId: string) => {
    const updated = filters.selectedStudents.includes(studentId)
      ? filters.selectedStudents.filter((id) => id !== studentId)
      : [...filters.selectedStudents, studentId];
    onFilterChange({ ...filters, selectedStudents: updated });
  };

  const handleTeacherToggle = (teacherId: string) => {
    const updated = filters.selectedTeachers.includes(teacherId)
      ? filters.selectedTeachers.filter((id) => id !== teacherId)
      : [...filters.selectedTeachers, teacherId];
    onFilterChange({ ...filters, selectedTeachers: updated });
  };

  const handleLessonToggle = (lessonId: string) => {
    const updated = filters.selectedLessons.includes(lessonId)
      ? filters.selectedLessons.filter((id) => id !== lessonId)
      : [...filters.selectedLessons, lessonId];
    onFilterChange({ ...filters, selectedLessons: updated });
  };

  const hasActiveFilters = 
    filters.selectedStudents.length > 0 || 
    filters.selectedTeachers.length > 0 || 
    filters.selectedLessons.length > 0 || 
    filters.showOnlyMyPosts;

  const handleApplyClick = () => {
    if (hasActiveFilters) {
      addToast('Фильтры успешно применены', 'success');
    }
    onApplyFilters();
  };

  const handleResetClick = () => {
    addToast('Фильтры сброшены', 'info');
    onResetFilters();
  };

  const filteredPosts = mockPosts.filter((post) => {
    const matchesStudents =
      filters.selectedStudents.length > 0 &&
      filters.selectedStudents.some((id) => post.tags.students.includes(id));

    const matchesTeachers =
      filters.selectedTeachers.length > 0 &&
      filters.selectedTeachers.some((id) => post.tags.teachers.includes(id));

    const matchesLessons =
      filters.selectedLessons.length > 0 &&
      filters.selectedLessons.some((id) => post.tags.learningElements.includes(id));

    return matchesStudents || matchesTeachers || matchesLessons;
  });

  return (
    <div className="space-y-4 bg-card p-4 rounded-xl border border-border">
      {/* My posts filter */}
      <div>
        <label className="flex items-center gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={filters.showOnlyMyPosts}
            onChange={(e) => {
              const newFilters = { ...filters, showOnlyMyPosts: e.target.checked };
              onFilterChange(newFilters);
              setTimeout(() => onApplyFilters(), 0);
            }}
            className="h-4 w-4 rounded border-border cursor-pointer accent-primary"
          />
          <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">Только мои посты</span>
        </label>
      </div>

      <div className="border-t border-border pt-4">
        <button
          onClick={() => handleExpand('students')}
          className="mb-3 flex w-full items-center justify-between font-semibold text-foreground hover:text-primary transition-colors"
        >
          <span>Ученики</span>
          <span className={`text-xs transform transition-transform ${expanded.students ? 'rotate-180' : ''}`}>▼</span>
        </button>
        {expanded.students && (
          <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
            {students.map((student) => (
              <label key={student.id} className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 p-1.5 rounded transition-colors">
                <input
                  type="checkbox"
                  checked={filters.selectedStudents.includes(student.id)}
                  onChange={() => handleStudentToggle(student.id)}
                  className="h-4 w-4 rounded border-border cursor-pointer accent-primary"
                />
                <span className="text-sm text-foreground">{student.name}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-border pt-4">
        <button
          onClick={() => handleExpand('teachers')}
          className="mb-3 flex w-full items-center justify-between font-semibold text-foreground hover:text-primary transition-colors"
        >
          <span>Учителя</span>
          <span className={`text-xs transform transition-transform ${expanded.teachers ? 'rotate-180' : ''}`}>▼</span>
        </button>
        {expanded.teachers && (
          <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
            {teachers.map((teacher) => (
              <label key={teacher.id} className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 p-1.5 rounded transition-colors">
                <input
                  type="checkbox"
                  checked={filters.selectedTeachers.includes(teacher.id)}
                  onChange={() => handleTeacherToggle(teacher.id)}
                  className="h-4 w-4 rounded border-border cursor-pointer accent-primary"
                />
                <span className="text-sm text-foreground">{teacher.name}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-border pt-4">
        <button
          onClick={() => handleExpand('lessons')}
          className="mb-3 flex w-full items-center justify-between font-semibold text-foreground hover:text-primary transition-colors"
        >
          <span>Уроки</span>
          <span className={`text-xs transform transition-transform ${expanded.lessons ? 'rotate-180' : ''}`}>▼</span>
        </button>
        {expanded.lessons && (
          <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
            {lessons.map((lesson) => (
              <label key={lesson.id} className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 p-1.5 rounded transition-colors">
                <input
                  type="checkbox"
                  checked={filters.selectedLessons.includes(lesson.id)}
                  onChange={() => handleLessonToggle(lesson.id)}
                  className="h-4 w-4 rounded border-border cursor-pointer accent-primary"
                />
                <span className="text-sm text-foreground">{lesson.name}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-2 border-t border-border pt-4">
        <Button
          onClick={handleApplyClick}
          size="sm"
          className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg relative overflow-hidden group"
        >
          <span className="relative z-10">Применить</span>
          <span className="absolute inset-0 bg-white opacity-0 group-active:opacity-20 transition-opacity" />
        </Button>
        <Button
          onClick={handleResetClick}
          variant="outline"
          size="sm"
          className="flex-1 rounded-lg relative overflow-hidden group"
        >
          <span className="relative z-10">Сброс</span>
          <span className="absolute inset-0 bg-black opacity-0 dark:bg-white group-active:opacity-10 transition-opacity" />
        </Button>
      </div>

      {hasActiveFilters && (
        <div className="text-xs text-muted-foreground text-center pt-2 border-t border-border">
          Активно {
            [
              filters.selectedStudents.length > 0 && `студентов: ${filters.selectedStudents.length}`,
              filters.selectedTeachers.length > 0 && `учителей: ${filters.selectedTeachers.length}`,
              filters.selectedLessons.length > 0 && `уроков: ${filters.selectedLessons.length}`,
              filters.showOnlyMyPosts && 'только мои посты',
            ].filter(Boolean).join(', ')
          }
        </div>
      )}
    </div>
  );
}
