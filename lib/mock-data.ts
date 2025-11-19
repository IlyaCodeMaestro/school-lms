import { Post, Student, Teacher, LearningElement } from './types';

export const CURRENT_GROUP = {
  id: 'group-7b',
  name: 'Группа 7Б',
};

const studentNames = [
  'Алия Самигулова', 'Армхан Темирбаев', 'Диана Жарқынова', 'Ерқен Мамбеков',
  'Асель Жарқынова', 'Бекзат Жылқайдаров', 'Гульмира Ибраимова', 'Данияр Оспанов',
  'Есенғали Кенжебаев', 'Айдос Сатыбалдин', 'Лаура Ергалиева', 'Маржан Сейтова',
  'Нарман Оспанов', 'Раушан Жарқынова', 'Сара Ермекова', 'Темур Нурбаев',
  'Улан Сарсенбин', 'Фарид Мухамеджан', 'Халима Омарова', 'Чигара Балова',
  'Шахзода Назарова', 'Юлия Волкова', 'Зульфия Искакова', 'Адлет Молдабаев',
  'Ботакоз Ахметова', 'Венера Садыкова', 'Гиниятулла Аширов', 'Дарья Петровна',
  'Елена Федорова', 'Жанна Козлова', 'Зарина Хасенова', 'Икбал Саттарова',
  'Клара Шайхиева', 'Лилия Карпова', 'Майра Абдуллина', 'Наталья Громова',
  'Оксана Лебедева', 'Полина Сиротина', 'Рузана Енбаева', 'Сергей Иванов',
  'Таймас Кулманов', 'Умбет Аманов', 'Фатима Абдрахманова', 'Халед Сафин',
  'Шермухамед Жаксыбаев', 'Юнус Утегалиев', 'Ясмина Хайдарова',
];

const teacherNames = [
  'Айгүл Нурписова', 'Аймура Даулетова', 'Алмас Камалов', 'Болат Адилов',
  'Венера Аскарова', 'Гаухар Смагулова', 'Давид Орлов',
];

const learningElements = [
  { id: 'le-1', name: 'Экосистемы', type: 'lesson' as const },
  { id: 'le-2', name: 'Биология', type: 'lesson' as const },
  { id: 'le-3', name: 'Геометрия', type: 'lesson' as const },
  { id: 'le-4', name: 'Простые механизмы', type: 'lesson' as const },
  { id: 'le-5', name: 'Физика', type: 'lesson' as const },
  { id: 'le-6', name: 'Химия', type: 'lesson' as const },
  { id: 'le-7', name: 'История', type: 'lesson' as const },
  { id: 'le-8', name: 'Литература', type: 'lesson' as const },
  { id: 'le-9', name: 'Английский язык', type: 'lesson' as const },
  { id: 'le-10', name: 'Информатика', type: 'lesson' as const },
  { id: 'le-11', name: 'Музыка', type: 'lesson' as const },
  { id: 'le-12', name: 'Физкультура', type: 'lesson' as const },
  { id: 'le-13', name: 'Изобразительное искусство', type: 'lesson' as const },
  { id: 'le-14', name: 'Технология', type: 'lesson' as const },
  { id: 'le-15', name: 'Казахский язык', type: 'lesson' as const },
  { id: 'le-16', name: 'География', type: 'lesson' as const },
  { id: 'le-17', name: 'Обществознание', type: 'lesson' as const },
  { id: 'le-18', name: 'Биологический проект', type: 'assignment' as const },
  { id: 'le-19', name: 'Презентация проекта', type: 'assignment' as const },
  { id: 'le-20', name: 'Командный проект', type: 'assignment' as const },
];

export const students: Student[] = studentNames.map((name, idx) => ({
  id: `student-${idx + 1}`,
  name,
}));

export const teachers: Teacher[] = teacherNames.map((name, idx) => ({
  id: `teacher-${idx + 1}`,
  name,
}));

export const learningElementsData: LearningElement[] = learningElements;

const images = [
  '/students-presenting-project-in-classroom.jpg',
  '/group-of-students-working-together-on-biology-proj.jpg',
  '/student-explaining-math-on-whiteboard.jpg',
  '/scientific-experiment-in-chemistry-lab.jpg',
  '/students-building-physics-project-prototype.jpg',
  '/historical-documentary-presentation.jpg',
  '/literature-discussion-group.jpg',
  '/english-language-performance.jpg',
  '/computer-programming-class.jpg',
  '/orchestra-students-performing.jpg',
];

function generateMockPosts(): Post[] {
  const posts: Post[] = [];
  const postTitles = [
    'Успешно завершена презентация по биологии',
    'Проект по физике готов к защите',
    'Отличная работа в командном проекте',
    'Внимательное решение заданий по геометрии',
    'Творческий подход к истории',
    'Прекрасное понимание литературного произведения',
    'Успех в контрольной работе',
    'Отличная подготовка к экзамену',
    'Решение сложной задачи по химии',
    'Творческий проект по искусству',
  ];

  const descriptions = [
    'Ученик продемонстрировал глубокое понимание темы и уверенно ответил на все вопросы',
    'Группа работала слаженно и выполнила проект в срок с высоким качеством',
    'Инновативный подход к решению проблемы впечатлил всех',
    'Отличная подготовка и уверенная защита проекта',
    'Ученик активно участвовал и помогал одноклассникам',
    'Показан значительный прогресс в учении',
    'Творческий и оригинальный результат',
    'Внимательное изучение материала привело к отличному результату',
    'Взаимопомощь в команде привела к успеху',
    'Примечательное улучшение по сравнению с предыдущей работой',
  ];

  for (let i = 0; i < 95; i++) {
    const isTeacherPost = i % 2 === 0; // Alternate between teacher and student posts
    const author = isTeacherPost
      ? teachers[i % teachers.length] // Ensure strict selection from teachers
      : students[i % students.length]; // Ensure strict selection from students

    const numStudentTags = Math.floor(Math.random() * 3) + 1;
    const selectedStudents: string[] = [];
    for (let j = 0; j < numStudentTags; j++) {
      const randStudent = students[Math.floor(Math.random() * students.length)];
      if (!selectedStudents.includes(randStudent.id)) {
        selectedStudents.push(randStudent.id);
      }
    }

    const numTeacherTags = Math.random() > 0.6 ? 1 : 0;
    const selectedTeachers: string[] = [];
    if (numTeacherTags > 0) {
      const randTeacher = teachers[Math.floor(Math.random() * teachers.length)];
      if (!selectedTeachers.includes(randTeacher.id)) {
        selectedTeachers.push(randTeacher.id);
      }
    }

    const numLessonTags = Math.floor(Math.random() * 2) + 1;
    const selectedLessons: string[] = [];
    for (let j = 0; j < numLessonTags; j++) {
      const randLesson = learningElementsData[Math.floor(Math.random() * learningElementsData.length)];
      if (!selectedLessons.includes(randLesson.id)) {
        selectedLessons.push(randLesson.id);
      }
    }

    posts.push({
      id: `post-${i + 1}`,
      title: postTitles[Math.floor(Math.random() * postTitles.length)],
      description: descriptions[Math.floor(Math.random() * descriptions.length)],
      imageUrl: images[i % images.length],
      authorId: author.id,
      authorName: author.name,
      authorType: isTeacherPost ? 'teacher' : 'student',
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      tags: {
        students: selectedStudents,
        teachers: selectedTeachers,
        learningElements: selectedLessons,
      },
    });
  }

  return posts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export const mockPosts = generateMockPosts();
