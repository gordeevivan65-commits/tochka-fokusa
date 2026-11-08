const $ = id => document.getElementById(id);

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  })[char]);
}

function toast(message, type = "") {
  const element = document.createElement("div");
  element.className = "toast " + type;
  element.textContent = message;
  const container = $("toast-container");
  if(container) container.appendChild(element);
  setTimeout(() => element.remove(), 3200);
}

function saveData() { try { localStorage.setItem("tfData", JSON.stringify(data)); } catch (e) {} }
function loadData() { try { return JSON.parse(localStorage.getItem("tfData")); } catch (e) { return null; } }

// ==========================================
// 1. БАЗА ДАННЫХ (РАСПИСАНИЕ)
// ==========================================
const initialData = {
  currentDay: "monday", currentChat: "parents",
  profile: { name: "Учитель", city: "", school: "", subject: "", avatar: "👩‍🏫" },
  schedule: {
    monday: [
      { id: 1, time: "08:30", subject: "Русский язык", className: "5А", room: "204", plan: `<b>Тема:</b> Имя существительное.<br><b>Цель:</b> Повторить категории рода и числа.<br><b>Ход:</b> Орг.момент, опрос, упражнения, итог.<br><b>ДЗ:</b> Упр. 45.`, homeworkFiles: [] },
      { id: 2, time: "09:25", subject: "Литература", className: "5А", room: "204", plan: `<b>Тема:</b> Русские народные сказки.<br><b>Цель:</b> Анализ героев.<br><b>Ход:</b> Чтение, беседа, характеристика.<br><b>ДЗ:</b> Иллюстрация.`, homeworkFiles: [] },
      { id: 3, time: "10:30", subject: "Математика", className: "5А", room: "301", plan: `<b>Тема:</b> Обыкновенные дроби.<br><b>Цель:</b> Сложение дробей.<br><b>Ход:</b> Устный счет, теория, практика.<br><b>ДЗ:</b> № 234.`, homeworkFiles: [] },
      { id: 4, time: "11:30", subject: "История", className: "5А", room: "105", plan: `<b>Тема:</b> Первобытные люди.<br><b>Цель:</b> Быт и занятия.<br><b>Ход:</b> Видео, лекция, карта.<br><b>ДЗ:</b> Пар. 2.`, homeworkFiles: [] },
      { id: 5, time: "12:30", subject: "Английский язык", className: "5А", room: "310", plan: `<b>Тема:</b> Present Simple.<br><b>Цель:</b> Утвердительные предложения.<br><b>Ход:</b> Фонетика, правило, упражнения.<br><b>ДЗ:</b> Стр. 42.`, homeworkFiles: [] },
      { id: 6, time: "13:30", subject: "Биология", className: "5А", room: "203", plan: `<b>Тема:</b> Царства живой природы.<br><b>Цель:</b> Классификация.<br><b>Ход:</b> Лекция, работа с гербарием.<br><b>ДЗ:</b> Таблица.`, homeworkFiles: [] }
    ],
    tuesday: [
      { id: 7, time: "08:30", subject: "Алгебра", className: "7Б", room: "301", plan: `<b>Тема:</b> Линейные уравнения.<br><b>Цель:</b> Научиться решать.<br><b>Ход:</b> Повторение, новые правила, задачи.<br><b>ДЗ:</b> № 120.`, homeworkFiles: [] },
      { id: 8, time: "09:25", subject: "Геометрия", className: "7Б", room: "301", plan: `<b>Тема:</b> Признаки равенства треугольников.<br><b>Цель:</b> Доказательство теорем.<br><b>Ход:</b> Теория, чертежи, решение.<br><b>ДЗ:</b> № 145.`, homeworkFiles: [] },
      { id: 9, time: "10:30", subject: "Физика", className: "7Б", room: "401", plan: `<b>Тема:</b> Сила трения.<br><b>Цель:</b> Изучить виды трения.<br><b>Ход:</b> Опыт, теория, решение задач.<br><b>ДЗ:</b> § 15.`, homeworkFiles: [] },
      { id: 10, time: "11:30", subject: "Химия", className: "8А", room: "402", plan: `<b>Тема:</b> Периодическая таблица.<br><b>Цель:</b> Строение атома.<br><b>Ход:</b> Лекция, работа с таблицей.<br><b>ДЗ:</b> Выучить элементы.`, homeworkFiles: [] },
      { id: 11, time: "12:30", subject: "География", className: "8А", room: "106", plan: `<b>Тема:</b> Климатические пояса.<br><b>Цель:</b> Работа с картой.<br><b>Ход:</b> Атлас, лекция, тест.<br><b>ДЗ:</b> Контурная карта.`, homeworkFiles: [] },
      { id: 12, time: "13:30", subject: "Информатика", className: "9А", room: "108", plan: `<b>Тема:</b> Алгоритмы.<br><b>Цель:</b> Блок-схемы.<br><b>Ход:</b> Теория, практика за ПК.<br><b>ДЗ:</b> Составить алгоритм.`, homeworkFiles: [] }
    ],
    wednesday: [
      { id: 13, time: "08:30", subject: "Русский язык", className: "9А", room: "204", plan: `<b>Тема:</b> Сложные предложения.<br><b>Цель:</b> Пунктуация.<br><b>Ход:</b> Диктант, разбор, упражнения.<br><b>ДЗ:</b> Упр. 89.`, homeworkFiles: [] },
      { id: 14, time: "09:25", subject: "Литература", className: "9А", room: "204", plan: `<b>Тема:</b> Серебряный век.<br><b>Цель:</b> Течения поэзии.<br><b>Ход:</b> Лекция, чтение стихов, анализ.<br><b>ДЗ:</b> Выучить стих.`, homeworkFiles: [] },
      { id: 15, time: "10:30", subject: "История", className: "10А", room: "105", plan: `<b>Тема:</b> Древняя Русь.<br><b>Цель:</b> Образование государства.<br><b>Ход:</b> Лекция, работа с картой.<br><b>ДЗ:</b> Пар. 12.`, homeworkFiles: [] },
      { id: 16, time: "11:30", subject: "Обществознание", className: "10А", room: "105", plan: `<b>Тема:</b> Человек и общество.<br><b>Цель:</b> Сферы жизни.<br><b>Ход:</b> Дискуссия, кейсы.<br><b>ДЗ:</b> Эссе.`, homeworkFiles: [] },
      { id: 17, time: "12:30", subject: "Физкультура", className: "5А", room: "Спортзал", plan: `<b>Тема:</b> Баскетбол.<br><b>Цель:</b> Ведение мяча.<br><b>Ход:</b> Разминка, упражнения, игра.<br><b>ДЗ:</b> Нет.`, homeworkFiles: [] },
      { id: 18, time: "13:30", subject: "Музыка", className: "5А", room: "205", plan: `<b>Тема:</b> Народная музыка.<br><b>Цель:</b> Слушание.<br><b>Ход:</b> Аудио, анализ, вокал.<br><b>ДЗ:</b> Рисунок.`, homeworkFiles: [] }
    ],
    thursday: [
      { id: 19, time: "08:30", subject: "Английский язык", className: "11А", room: "310", plan: `<b>Тема:</b> Conditionals.<br><b>Цель:</b> Условные предложения.<br><b>Ход:</b> Правило, упражнения, аудирование.<br><b>ДЗ:</b> Unit 5.`, homeworkFiles: [] },
      { id: 20, time: "09:25", subject: "Астрономия", className: "11А", room: "401", plan: `<b>Тема:</b> Солнечная система.<br><b>Цель:</b> Планеты.<br><b>Ход:</b> Видео, доклады, тест.<br><b>ДЗ:</b> Доклад.`, homeworkFiles: [] },
      { id: 21, time: "10:30", subject: "Технология", className: "6Б", room: "Мастерская", plan: `<b>Тема:</b> Работа с деревом.<br><b>Цель:</b> Выпиливание.<br><b>Ход:</b> ТБ, практика, уборка.<br><b>ДЗ:</b> Нет.`, homeworkFiles: [] },
      { id: 22, time: "11:30", subject: "ИЗО", className: "6Б", room: "209", plan: `<b>Тема:</b> Пейзаж.<br><b>Цель:</b> Рисование с натуры.<br><b>Ход:</b> Показ, рисование, выставка.<br><b>ДЗ:</b> Завершить.`, homeworkFiles: [] },
      { id: 23, time: "12:30", subject: "ОБЖ", className: "8Б", room: "112", plan: `<b>Тема:</b> Безопасность на воде.<br><b>Цель:</b> Правила поведения.<br><b>Ход:</b> Видео, обсуждение, тест.<br><b>ДЗ:</b> Памятка.`, homeworkFiles: [] },
      { id: 24, time: "13:30", subject: "Химия", className: "9Б", room: "402", plan: `<b>Тема:</b> Химические реакции.<br><b>Цель:</b> Типы реакций.<br><b>Ход:</b> Опыты, уравнения.<br><b>ДЗ:</b> Задачи.`, homeworkFiles: [] }
    ],
    friday: [
      { id: 25, time: "08:30", subject: "Русский язык", className: "7Б", room: "204", plan: `<b>Тема:</b> Деепричастия.<br><b>Цель:</b> Морфологические признаки.<br><b>Ход:</b> Повторение, теория, упражнения.<br><b>ДЗ:</b> Упр. 112.`, homeworkFiles: [] },
      { id: 26, time: "09:25", subject: "Литература", className: "7Б", room: "204", plan: `<b>Тема:</b> Анализ стихотворения.<br><b>Цель:</b> Средства выразительности.<br><b>Ход:</b> Чтение, анализ, вывод.<br><b>ДЗ:</b> Наизусть.`, homeworkFiles: [] },
      { id: 27, time: "10:30", subject: "Математика", className: "6А", room: "301", plan: `<b>Тема:</b> Пропорции.<br><b>Цель:</b> Решение задач.<br><b>Ход:</b> Устный счет, теория, практика.<br><b>ДЗ:</b> № 450.`, homeworkFiles: [] },
      { id: 28, time: "11:30", subject: "История", className: "6А", room: "105", plan: `<b>Тема:</b> Средние века.<br><b>Цель:</b> Рыцарство.<br><b>Ход:</b> Лекция, фильм, обсуждение.<br><b>ДЗ:</b> Пар. 8.`, homeworkFiles: [] },
      { id: 29, time: "12:30", subject: "Биология", className: "6А", room: "203", plan: `<b>Тема:</b> Растительная клетка.<br><b>Цель:</b> Органоиды.<br><b>Ход:</b> Лабораторная, зарисовка.<br><b>ДЗ:</b> § 5.`, homeworkFiles: [] },
      { id: 30, time: "13:30", subject: "География", className: "7А", room: "106", plan: `<b>Тема:</b> Природные зоны.<br><b>Цель:</b> Изучить разнообразие.<br><b>Ход:</b> Карта, доклады.<br><b>ДЗ:</b> Таблица.`, homeworkFiles: [] }
    ]
  },
  tasks: [],
  messages: { parents: [], colleagues: [], class: [] },
  chatSettings: { dnd: false, start: "20:00", end: "08:00", autoReply: true },
  report: { grades: {} }
};

function mergeData(saved) {
  if (!saved) return structuredClone(initialData);
  const result = structuredClone(initialData);
  return {
    ...result, ...saved,
    profile: { ...result.profile, ...(saved.profile || {}) },
    schedule: { ...result.schedule, ...(saved.schedule || {}) },
    messages: { ...result.messages, ...(saved.messages || {}) },
    chatSettings: { ...result.chatSettings, ...(saved.chatSettings || {}) },
    report: { ...result.report, ...(saved.report || {}) },
    tasks: Array.isArray(saved.tasks) ? saved.tasks : []
  };
}

let data = mergeData(loadData());
let activeLessonId = null;
let currentMaterial = null;
let slideIndex = 0;
let flashIndex = 0;
let flashBack = false;
let testAnswers = {};

/* =====================================================
   ВСПЛЫВАЮЩЕЕ ОКНО НАПОМИНАНИЯ (БЕЗ ЗВУКА, С КАРТИНКОЙ)
   ===================================================== */
function injectReminderStyles() {
  const style = document.createElement('style');
  style.innerHTML = `
    #reminderOverlay {
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(10, 5, 20, 0.85); backdrop-filter: blur(5px);
      z-index: 9999; display: none; align-items: center; justify-content: center;
    }
    #reminderOverlay.active { display: flex; }
    .reminder-box {
      background: var(--bg-card); border: 3px solid var(--primary);
      border-radius: 16px; padding: 40px; text-align: center;
      box-shadow: 0 0 50px rgba(180, 74, 255, 0.6); max-width: 400px; width: 90%;
      animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    @keyframes popIn { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }
    .reminder-img { font-size: 80px; margin-bottom: 20px; }
    .reminder-box h2 { font-family: 'Press Start 2P', cursive; color: var(--primary); font-size: 18px; margin-bottom: 15px; line-height: 1.4; }
    .reminder-box .task-text { font-size: 20px; font-weight: bold; margin-bottom: 30px; display: block; color: #fff; }
    .reminder-box .btn-row { display: flex; gap: 15px; justify-content: center; }
    .reminder-box button { font-size: 14px; padding: 12px 20px; }
  `;
  document.head.appendChild(style);

  const div = document.createElement('div');
  div.id = 'reminderOverlay';
  div.innerHTML = `
    <div class="reminder-box">
      <div class="reminder-img">⏰📅</div>
      <h2>НАПОМИНАНИЕ</h2>
      <span class="task-text" id="reminderTaskText"></span>
      <div class="btn-row">
        <button class="btn-primary" onclick="completeReminderTask()">✅ Выполнено</button>
        <button class="btn-secondary" onclick="closeReminder()">Закрыть</button>
      </div>
    </div>
  `;
  document.body.appendChild(div);
}

let activeReminderTaskId = null;

function showReminder(task) {
  activeReminderTaskId = task.id;
  $("reminderTaskText").innerText = task.title;
  $("reminderOverlay").classList.add('active');
}

function closeReminder() {
  $("reminderOverlay").classList.remove('active');
  activeReminderTaskId = null;
}

function completeReminderTask() {
  if (activeReminderTaskId) {
    const task = data.tasks.find(t => t.id === activeReminderTaskId);
    if (task) {
      task.done = true;
      saveData();
      renderTasks();
      toast("Задача выполнена!", "success");
    }
  }
  closeReminder();
}

function checkTaskTimes() {
  const now = new Date();
  const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  
  data.tasks.forEach(task => {
    if (!task.done && !task.notified && task.time === currentTime) {
      task.notified = true;
      saveData(); 
      showReminder(task);
    }
  });
}

/* =====================================================
   МОДАЛЬНЫЕ ОКНА
   ===================================================== */
function openModal() { const el = $("mainModal"); if(el) el.classList.add("open"); document.body.style.overflow = "hidden"; }
function closeModal(id) { if(id) { const el = $(id); if(el) el.style.display = 'none'; return; } const el = $("mainModal"); if(el) el.classList.remove("open"); document.body.style.overflow = ""; }
function modalBackdrop(event) { if (event.target === $("mainModal")) closeModal(); }

/* =====================================================
   НАВИГАЦИЯ
   ===================================================== */
function switchTab(tab, button) {
  document.querySelectorAll(".tab-btn").forEach(item => item.classList.remove("active"));
  document.querySelectorAll(".tab-panel").forEach(item => item.classList.remove("active"));
  const panel = $("tab-" + tab); if(panel) panel.classList.add("active");
  if (button) button.classList.add("active");
  
  if (tab === "reports") renderReport();
  if (tab === "chat") renderChat();
  if (tab === "materials") filterMaterials();
  if (tab === "routine") renderSchedule();
}

/* =====================================================
   РАСПИСАНИЕ
   ===================================================== */
function loadSchedule(day, button) {
  if (!data.schedule[day]) data.schedule[day] = [];
  data.currentDay = day;
  document.querySelectorAll(".day-btn").forEach(item => item.classList.remove("active"));
  if (button) button.classList.add("active");
  saveData();
  renderSchedule();
}

function renderSchedule() {
  const grid = $("scheduleGrid"); if(!grid) return;
  const lessons = data.schedule[data.currentDay] || [];
  grid.innerHTML = lessons.length
    ? lessons.slice().sort((a, b) => a.time.localeCompare(b.time)).map(lesson => `
        <article class="schedule-item" onclick="openLesson(${lesson.id})">
          <div class="s-time">${escapeHTML(lesson.time)}</div>
          <div class="s-info">
            <h4>${escapeHTML(lesson.subject)}</h4>
            <p>${escapeHTML(lesson.className)} · Каб. ${escapeHTML(lesson.room)}</p>
          </div>
          <div class="s-action">Открыть →</div>
        </article>
      `).join("")
    : '<div class="empty-state">На этот день уроков пока нет.</div>';
  renderTasks();
}

function openLessonModal() {
  const body = $("modalBody"); if(!body) return;
  body.innerHTML = `
    <h2>Добавить урок</h2>
    <label>Предмет<input id="lessonSubjectInput" placeholder="Например: Математика" class="auth-input"></label>
    <label>Класс<input id="lessonClassInput" placeholder="Например: 5А" class="auth-input"></label>
    <label>Кабинет<input id="lessonRoomInput" placeholder="204" class="auth-input"></label>
    <label>Время<input id="lessonTimeInput" type="time" value="08:30" class="auth-input"></label>
    <label>Тема и план урока<textarea id="lessonPlanInput" rows="4" class="auth-input"></textarea></label>
    <button class="btn-primary full" onclick="addLesson()" style="width:100%;">Сохранить урок</button>
  `;
  openModal();
}

function addLesson() {
  const subject = $("lessonSubjectInput") ? $("lessonSubjectInput").value.trim() : "";
  const className = $("lessonClassInput") ? $("lessonClassInput").value.trim() : "";
  const room = $("lessonRoomInput") ? $("lessonRoomInput").value.trim() : '---';
  const time = $("lessonTimeInput") ? $("lessonTimeInput").value : "";
  const plan = $("lessonPlanInput") ? $("lessonPlanInput").value.trim() : "";
  
  if (!subject || !className || !time) { toast("Заполните предмет, класс и время", "error"); return; }

  data.schedule[data.currentDay].push({ id: Date.now(), subject, className, room, time, plan: plan || "План не указан.", homeworkFiles: [] });
  saveData(); closeModal(); renderSchedule(); toast("Урок добавлен", "success");
}

function openLesson(id) {
  const lesson = data.schedule[data.currentDay].find(item => item.id === id);
  if (!lesson) return;
  activeLessonId = id;
  const body = $("modalBody"); if(!body) return;
  
  const matching = materials.filter(item => item.subject === lesson.subject);

  const filesHtml = (lesson.homeworkFiles || []).map((f, i) => `
    <div class="hw-file-item">
      <span>📄 ${escapeHTML(f.name)}</span>
      <a href="${f.url}" download="${escapeHTML(f.name)}">Скачать</a>
    </div>
  `).join('');

  body.innerHTML = `
    <span class="eyebrow">ПЛАН УРОКА</span>
    <h2 class="pixel-text">${escapeHTML(lesson.subject)}</h2>
    <p class="modal-subtitle">${escapeHTML(lesson.className)} · Каб. ${escapeHTML(lesson.room)} · ${escapeHTML(lesson.time)}</p>

    <div class="lesson-plan-content">
      ${lesson.plan}
    </div>
    
    <button class="btn-primary" onclick="openEditPlanModal()" style="width:100%; margin-bottom:20px;">✏️ Редактировать план</button>

    <div class="subsection">
      <h3 style="margin-bottom:10px;">📎 Загрузить ДЗ (файл)</h3>
      <div class="hw-upload-box" onclick="document.getElementById('hwFileInput').click()">
        <p>Нажмите, чтобы выбрать файл (или перетащите)</p>
        <input type="file" id="hwFileInput" style="display:none;" onchange="uploadHomework(event)" multiple>
      </div>
      <div class="hw-file-list">
        ${filesHtml || '<p style="font-size:12px; color:var(--text-muted);">Файлы не прикреплены.</p>'}
      </div>
    </div>

    <div class="subsection" style="margin-top:20px;">
      <h3>Материалы по предмету</h3>
      <div id="lessonMaterials">
        ${matching.length ? matching.map(item => `
          <button class="btn-secondary" style="margin:5px;" onclick="closeModal();viewMaterial('${item.id}')">
            ${escapeHTML(item.title)}
          </button>
        `).join("") : '<p>Нет готовых материалов.</p>'}
      </div>
    </div>
  `;
  openModal();
}

function openEditPlanModal() {
  const lesson = data.schedule[data.currentDay].find(item => item.id === activeLessonId);
  const body = $("modalBody"); if(!body || !lesson) return;
  body.innerHTML = `
    <h2>Редактировать план</h2>
    <textarea id="lessonEditPlan" rows="12" class="auth-input" style="width:100%; margin-bottom:15px;">${escapeHTML(lesson.plan)}</textarea>
    <button class="btn-primary full" onclick="saveLessonPlan()" style="width:100%;">Сохранить изменения</button>
  `;
}

function saveLessonPlan() {
  const lesson = data.schedule[data.currentDay].find(item => item.id === activeLessonId);
  if (!lesson) return;
  const input = $("lessonEditPlan"); if(input) lesson.plan = input.value.trim();
  saveData(); closeModal(); renderSchedule(); toast("План сохранён", "success");
}

function uploadHomework(event) {
  const files = event.target.files;
  if (!files.length) return;
  
  const lesson = data.schedule[data.currentDay].find(l => l.id === activeLessonId);
  if (!lesson) return;
  lesson.homeworkFiles = lesson.homeworkFiles || [];

  Array.from(files).forEach(file => {
    const reader = new FileReader();
    reader.onload = (e) => {
      lesson.homeworkFiles.push({ name: file.name, type: file.type, url: e.target.result });
      saveData();
      openLesson(activeLessonId); 
      toast(`Файл "${file.name}" загружен!`, 'success');
    };
    reader.readAsDataURL(file);
  });
}

/* =====================================================
   ЗАДАЧИ
   ===================================================== */
function addTask() {
  const input = $("newTaskInput"); if(!input) return;
  const timeInput = $("newTaskTime");
  const title = input.value.trim();
  const time = timeInput ? timeInput.value : "";
  
  if (!title) { toast("Введите задачу", "error"); return; }
  
  data.tasks.push({ id: Date.now(), title, time, done: false, notified: false });
  input.value = ""; if(timeInput) timeInput.value = "";
  saveData(); renderTasks(); toast("Задача добавлена", "success");
}

function toggleTask(id) {
  const task = data.tasks.find(item => item.id === id);
  if (task) { task.done = !task.done; saveData(); renderTasks(); }
}

function renderTasks() {
  const list = $("taskList"); if(!list) return;
  const total = data.tasks.length;
  const completed = data.tasks.filter(item => item.done).length;
  
  const pText = $("taskProgressText"); if(pText) pText.textContent = `Выполнено ${completed} из ${total} задач`;
  const pBar = $("taskProgressBar"); if(pBar) pBar.style.width = total ? `${completed / total * 100}%` : "0%";
  
  list.innerHTML = data.tasks.map(task => `
    <li class="task-item ${task.done ? "completed" : ""}">
      <input type="checkbox" ${task.done ? "checked" : ""} onchange="toggleTask(${task.id})">
      <span class="task-text" style="flex:1;">${escapeHTML(task.title)}</span>
      ${task.time ? `<span class="task-time-badge">⏰ ${escapeHTML(task.time)}</span>` : ""}
    </li>
  `).join("");
}

/* =====================================================
   БАЗА МАТЕРИАЛОВ
   ===================================================== */
const materials = [
  // --- РУССКИЙ ЯЗЫК ---
  { id: "rus1", subject: "Русский язык", type: "test", title: "Имя существительное", desc: "10 вопросов по основным признакам.", questions: [["Что обозначает существительное?", ["Предмет", "Действие", "Признак"], 0, "Существительное обозначает предмет."], ["На какие вопросы отвечает?", ["Какой? Какая?", "Кто? Что?", "Что делать?"], 1, "Основные вопросы: кто? что?"], ["Какого рода слово «окно»?", ["Мужского", "Женского", "Среднего"], 2, "Окно — среднего рода."], ["Какое слово одушевлённое?", ["Стол", "Ученик", "Книга"], 1, "Ученик обозначает человека."], ["В каком числе слово «тетради»?", ["Единственном", "Множественном", "Оба варианта"], 1, "Тетради — множественное число."], ["Найди существительное.", ["Красивый", "Бежать", "Учебник"], 2, "Учебник обозначает предмет."], ["Какой падеж отвечает на вопрос 'кому?'", ["Именительный", "Дательный", "Винительный"], 1, "Дательный падеж."], ["Что такое склонение?", ["Изменение по падежам", "Изменение по родам", "Изменение по временам"], 0, "Склонение — изменение по падежам."], ["Найди разносклоняемое слово.", ["Путь", "Стол", "Окно"], 0, "Слово 'путь' разносклоняемое."], ["В каком роде слово 'пальто'?", ["Мужском", "Женском", "Среднем"], 2, "Пальто — средний род."]] },
  { id: "rus2", subject: "Русский язык", type: "presentation", title: "Однородные члены", desc: "12 слайдов с правилами.", slides: [["Однородные члены", "Перечисляют предметы, действия и признаки."], ["Определение", "Отвечают на один вопрос, относятся к одному слову."], ["Пример", "В саду росли яблони, груши и сливы."], ["Перечисление", "Без союзов ставится запятая."], ["Одиночный союз И", "Запятая не ставится."], ["Повторяющиеся союзы", "Запятая ставится: И дождь, и ветер."], ["Противительные союзы", "Перед А и НО ставится запятая."], ["Обобщающие слова", "Объединяют однородные члены."], ["Двоеточие", "Обобщающее слово перед членами."], ["Тире", "Обобщающее слово после членов."], ["Практика", "Найдите однородные члены."], ["Итог", "Однородные члены обогащают речь."]] },
  { id: "rus3", subject: "Русский язык", type: "cards", title: "Словарные слова", desc: "10 карточек.", cards: [["Аллея", "Дорога с деревьями."], ["Коллекция", "Собрание предметов."], ["Терраса", "Летняя пристройка."], ["Суббота", "Шестой день недели."], ["Аккуратный", "Соблюдающий порядок."], ["Металл", "Хим. элемент с блеском."], ["Биография", "Описание жизни."], ["Галерея", "Помещение для картин."], ["Диалог", "Разговор двух лиц."], ["Желание", "Стремление к чему-либо."]] },
  
  // --- МАТЕМАТИКА ---
  { id: "math1", subject: "Математика", type: "test", title: "Обыкновенные дроби", desc: "8 вопросов.", questions: [["Что показывает знаменатель?", ["Сколько частей взяли", "На сколько частей разделили", "Количество целых"], 1, "Общее число частей."], ["Что показывает числитель?", ["Сколько частей взяли", "Сколько частей всего", "Название дроби"], 0, "Количество взятых частей."], ["Какая дробь больше?", ["1/3", "1/2", "Они равны"], 1, "Половина больше."], ["Чему равна половина от 10?", ["2", "5", "10"], 1, "10 : 2 = 5."], ["Как сократить 4/8?", ["1/2", "2/8", "4/4"], 0, "Делим на 4."], ["Как сложить 1/5 и 2/5?", ["3/10", "3/5", "2/5"], 1, "Складываем числители."], ["Как вычесть 3/4 - 1/4?", ["2/4", "2/8", "1/2"], 0, "3-1=2."], ["Что такое неправильная дробь?", ["Числитель больше", "Числитель меньше", "Равен нулю"], 0, "Например, 5/4."]] },
  { id: "math2", subject: "Математика", type: "presentation", title: "Геометрия: Треугольники", desc: "10 слайдов.", slides: [["Треугольники", "Фигура из трех отрезков."], ["Виды по углам", "Остроугольный, прямоугольный, тупоугольный."], ["Виды по сторонам", "Разносторонний, равнобедренный, равносторонний."], ["Периметр", "Сумма длин всех сторон."], ["Сумма углов", "Равна 180 градусам."], ["Медиана", "Соединяет вершину с серединой."], ["Биссектриса", "Делит угол пополам."], ["Высота", "Перпендикуляр из вершины."], ["Признаки равенства", "По двум сторонам и углу; по стороне и двум углам; по трем сторонам."], ["Итог", "Основа геометрических задач."]] },
  { id: "math3", subject: "Математика", type: "cards", title: "Формулы сокращенного умножения", desc: "6 карточек.", cards: [["(a+b)²", "a² + 2ab + b²"], ["(a-b)²", "a² - 2ab + b²"], ["a² - b²", "(a-b)(a+b)"], ["(a+b)³", "a³ + 3a²b + 3ab² + b³"], ["(a-b)³", "a³ - 3a²b + 3ab² - b³"], ["a³ + b³", "(a+b)(a² - ab + b²)"]] },
  
  // --- ЛИТЕРАТУРА ---
  { id: "lit1", subject: "Литература", type: "test", title: "Литературные жанры", desc: "6 вопросов.", questions: [["К какому жанру относится «Война и мир»?", ["Роман-эпопея", "Повесть", "Рассказ"], 0, "Роман-эпопея."], ["Что такое эпитет?", ["Образное определение", "Сравнение", "Преувеличение"], 0, "Образное определение."], ["Что такое метафора?", ["Перенос значения", "Сравнение", "Противопоставление"], 0, "Скрытое сравнение."], ["Что такое гипербола?", ["Преувеличение", "Преуменьшение", "Иносказание"], 0, "Преувеличение."], ["Кто написал «Евгения Онегина»?", ["Пушкин", "Лермонтов", "Гоголь"], 0, "А.С. Пушкин."], ["Что такое олицетворение?", ["Наделение неживого качествами живого", "Сравнение", "Повтор"], 0, "Оживление."]] },
  { id: "lit2", subject: "Литература", type: "presentation", title: "Серебряный век", desc: "8 слайдов.", slides: [["Серебряный век", "Период расцвета русской поэзии."], ["Символизм", "Блок, Белый. Мистические образы."], ["Акмеизм", "Гумилев, Ахматова. Ясность образов."], ["Футуризм", "Маяковский, Хлебников. Эпатаж."], ["Новокрестьянская поэзия", "Есенин, Клюев. Связь с деревней."], ["Имажинизм", "Есенин, Мариенгоф. Яркие метафоры."], ["Главные темы", "Революция, любовь, Россия."], ["Итог", "Влияние на мировую культуру."]] },
  { id: "lit3", subject: "Литература", type: "cards", title: "Литературные термины", desc: "10 карточек.", cards: [["Эпитет", "Образное определение."], ["Сравнение", "Сопоставление предметов."], ["Метафора", "Перенос по сходству."], ["Олицетворение", "Неживое как живое."], ["Гипербола", "Художественное преувеличение."], ["Антитеза", "Противопоставление."], ["Аллегория", "Иносказание."], ["Рифма", "Созвучие концов строк."], ["Строфа", "Группа строк."], ["Композиция", "Построение произведения."]] },
  
  // --- ИСТОРИЯ ---
  { id: "hist1", subject: "История", type: "test", title: "Древняя Русь", desc: "6 вопросов.", questions: [["Год крещения Руси?", ["988", "1054", "1147"], 0, "988 год."], ["Кто объединил Новгород и Киев?", ["Олег", "Игорь", "Святослав"], 0, "Олег."], ["Кто ввел христианство?", ["Владимир", "Ярослав", "Олег"], 0, "Владимир."], ["Что такое вече?", ["Народное собрание", "Княжеский суд", "Налог"], 0, "Собрание."], ["Что такое дань?", ["Сбор в пользу князя", "Торговая пошлина", "Вид налога"], 0, "Сбор."], ["Какой путь назывался 'из варяг в греки'?", ["Торговый путь", "Военный поход", "Миграция"], 0, "Торговый путь."]] },
  { id: "hist2", subject: "История", type: "presentation", title: "Древняя Русь", desc: "12 слайдов.", slides: [["Древняя Русь", "Образование государства."], ["Восточные славяне", "Земледелие, скотоводство."], ["Племенные союзы", "Объединение для защиты."], ["Занятия населения", "Ремесло, торговля."], ["Торговые пути", "Путь 'из варяг в греки'."], ["Князь и дружина", "Власть и армия."], ["Олег и Киев", "Объединение."], ["Развитие государства", "Дань, оборона."], ["Крещение Руси", "988 год."], ["Значение государства", "Развитие городов."], ["Культура", "Письменность, зодчество."], ["Вопросы", "Тест по теме."]] },
  { id: "hist3", subject: "История", type: "cards", title: "Термины Руси", desc: "8 карточек.", cards: [["Князь", "Глава власти."], ["Дружина", "Военная опора."], ["Дань", "Сбор с населения."], ["Племенной союз", "Объединение племен."], ["Ремесло", "Ручное производство."], ["Торговый путь", "Маршрут для товаров."], ["Вече", "Народное собрание."], ["Вотчина", "Наследственное владение."]] },
  
  // --- ФИЗИКА ---
  { id: "phys1", subject: "Физика", type: "test", title: "Законы Ньютона", desc: "5 вопросов.", questions: [["Сколько законов у Ньютона?", ["1", "2", "3"], 2, "Три закона."], ["Закон инерции?", ["Первый", "Второй", "Третий"], 0, "Первый закон."], ["Формула второго закона?", ["F = ma", "E = mc²", "P = IV"], 0, "F = ma."], ["Третий закон?", ["Действие равно противодействию", "Тело движется равномерно", "Сила тяжести"], 0, "Противодействие."], ["В чем измеряется сила?", ["Ньютон", "Джоуль", "Ватт"], 0, "В Ньютонах."]] },
  { id: "phys2", subject: "Физика", type: "presentation", title: "Сила трения", desc: "10 слайдов.", slides: [["Сила трения", "Встречается в каждом движении."], ["Что такое трение?", "При соприкосновении тел."], ["Причины трения", "Микроскопические неровности."], ["Трение покоя", "Не дает начать скользить."], ["Трение скольжения", "Тело скользит по поверхности."], ["Трение качения", "Колесо или шар."], ["От чего зависит?", "Сила прижатия, свойства поверхностей."], ["Польза и вред", "Ходить, но нагрев и износ."], ["Способы уменьшения", "Смазка, полировка."], ["Проверка знаний", "Вопросы по теме."]] },
  { id: "phys3", subject: "Физика", type: "cards", title: "Физические величины", desc: "8 карточек.", cards: [["Сила", "Ньютон (Н)"], ["Масса", "Килограмм (кг)"], ["Скорость", "Метр в секунду (м/с)"], ["Время", "Секунда (с)"], ["Работа", "Джоуль (Дж)"], ["Мощность", "Ватт (Вт)"], ["Плотность", "кг/м³"], ["Давление", "Паскаль (Па)"]] },
  
  // --- БИОЛОГИЯ ---
  { id: "bio1", subject: "Биология", type: "test", title: "Строение клетки", desc: "5 вопросов.", questions: [["Что ограничивает клетку?", ["Мембрана", "Ядрышко", "Рибосома"], 0, "Мембрана."], ["Где хранится ДНК?", ["Вакуоль", "Ядро", "Мембрана"], 1, "В ядре."], ["Функция митохондрий?", ["Фотосинтез", "Образование АТФ", "Хранение воды"], 1, "Синтез АТФ."], ["Что заполняет клетку?", ["Цитоплазма", "Клеточная стенка", "Хлорофилл"], 0, "Цитоплазма."], ["Что характерно для растений?", ["Хлоропласт", "Ресничка", "Жгутик"], 0, "Хлоропласт."]] },
  { id: "bio2", subject: "Биология", type: "presentation", title: "Царства природы", desc: "6 слайдов.", slides: [["Царства природы", "Бактерии, грибы, растения, животные."], ["Бактерии", "Одноклеточные, без ядра."], ["Грибы", "Симбиоз, мицелий."], ["Растения", "Фотосинтез, клеточная стенка."], ["Животные", "Гетеротрофы, подвижность."], ["Вирусы", "Неклеточная форма жизни."]] },
  { id: "bio3", subject: "Биология", type: "cards", title: "Органоиды клетки", desc: "8 карточек.", cards: [["Ядро", "Хранит ДНК."], ["Цитоплазма", "Внутренняя среда."], ["Мембрана", "Защитная оболочка."], ["Митохондрии", "Синтез АТФ."], ["Рибосомы", "Синтез белка."], ["Хлоропласты", "Фотосинтез."], ["Вакуоль", "Запас воды."], ["Лизосомы", "Расщепление веществ."]] },
  
  // --- ГЕОГРАФИЯ ---
  { id: "geo1", subject: "География", type: "test", title: "Материки и океаны", desc: "5 вопросов.", questions: [["Сколько материков?", ["4","6","8"], 1, "6 материков."], ["Самый большой океан?", ["Тихий","Атлантический","Индийский"], 0, "Тихий."], ["Самый жаркий материк?", ["Евразия","Африка","Антарктида"], 1, "Африка."], ["Самый маленький океан?", ["Северный Ледовитый","Индийский","Атлантический"], 0, "Северный Ледовитый."], ["Что показывает масштаб?", ["Высоту гор","Степень уменьшения","Температуру"], 1, "Уменьшение расстояний."]] },
  { id: "geo2", subject: "География", type: "presentation", title: "Природные зоны России", desc: "8 слайдов.", slides: [["Природные зоны", "Разнообразие России."], ["Арктические пустыни", "Холод, скудная растительность."], ["Тундра", "Мхи, карликовые деревья."], ["Тайга", "Хвойные леса."], ["Смешанные леса", "Хвойные и лиственные."], ["Степи", "Травы, чернозем."], ["Пустыни", "Песчаные почвы."], ["Субтропики", "Теплое море, пальмы."]] },
  { id: "geo3", subject: "География", type: "cards", title: "Столицы стран", desc: "8 карточек.", cards: [["Россия", "Москва"], ["Франция", "Париж"], ["Германия", "Берлин"], ["Италия", "Рим"], ["Испания", "Мадрид"], ["Великобритания", "Лондон"], ["США", "Вашингтон"], ["Китай", "Пекин"]] },
  
  // --- ХИМИЯ ---
  { id: "chem1", subject: "Химия", type: "test", title: "Строение атома", desc: "5 вопросов.", questions: [["Что в центре атома?", ["Ядро", "Электрон", "Молекула"], 0, "Ядро."], ["Из чего состоит ядро?", ["Протоны и нейтроны", "Электроны", "Атомы"], 0, "Протоны и нейтроны."], ["Заряд протона?", ["Положительный", "Отрицательный", "Нейтральный"], 0, "Положительный."], ["Заряд электрона?", ["Положительный", "Отрицательный", "Нейтральный"], 1, "Отрицательный."], ["Где находятся электроны?", ["На орбиталях", "В ядре", "В молекулах"], 0, "На орбиталях."]] },
  { id: "chem2", subject: "Химия", type: "presentation", title: "Периодическая таблица", desc: "8 слайдов.", slides: [["Периодическая таблица", "Таблица Менделеева."], ["Группы", "Вертикальные столбцы."], ["Периоды", "Горизонтальные строки."], ["Металлы", "Левая и нижняя часть."], ["Неметаллы", "Правая и верхняя часть."], ["Инертные газы", "8-я группа."], ["Порядковый номер", "Число протонов."], ["Массовое число", "Протоны + нейтроны."]] },
  { id: "chem3", subject: "Химия", type: "cards", title: "Химические понятия", desc: "8 карточек.", cards: [["Атом", "Наименьшая частица."], ["Молекула", "Из атомов."], ["Химический элемент", "Вид атомов."], ["Реакция", "Превращение веществ."], ["Смесь", "Несколько веществ."], ["Оксиды", "С кислородом."], ["Кислоты", "С ионами H+."], ["Соли", "Замещение H металлом."]] },
  
  // --- ИНФОРМАТИКА ---
  { id: "inf1", subject: "Информатика", type: "test", title: "Информация и измерение", desc: "5 вопросов.", questions: [["Единица информации?", ["Байт","Бит","Герц"], 1, "Бит."], ["Сколько бит в байте?", ["4","8","16"], 1, "8 бит."], ["Устройство ввода текста?", ["Монитор","Клавиатура","Колонки"], 1, "Клавиатура."], ["Что такое алгоритм?", ["Набор команд","Файл","Устройство"], 0, "Последовательность команд."], ["Расширение текстового файла?", [".txt",".mp3",".png"], 0, "TXT."]] },
  { id: "inf2", subject: "Информатика", type: "presentation", title: "Алгоритмы", desc: "5 слайдов.", slides: [["Алгоритм", "Конечная последовательность команд."], ["Свойства", "Дискретность, детерминированность."], ["Виды", "Линейный, циклический, разветвляющийся."], ["Блок-схемы", "Графическое представление."], ["Пример", "Приготовление чая."]] },
  { id: "inf3", subject: "Информатика", type: "cards", title: "Единицы информации", desc: "6 карточек.", cards: [["1 Бит", "0 или 1"], ["1 Байт", "8 бит"], ["1 Килобайт", "1024 байт"], ["1 Мегабайт", "1024 Кб"], ["1 Гигабайт", "1024 Мб"], ["1 Терабайт", "1024 Гб"]] },
  
  // --- АНГЛИЙСКИЙ ЯЗЫК ---
  { id: "eng1", subject: "Английский язык", type: "test", title: "Времена глаголов", desc: "5 вопросов.", questions: [["Present Simple для he/she/it?", ["Добавляем -s", "Добавляем -ing", "Не меняем"], 0, "Добавляем -s."], ["Past Simple правильных глаголов?", ["-ed", "-ing", "-s"], 0, "-ed."], ["Future Simple?", ["will + глагол", "to be + глагол", "have + глагол"], 0, "will + глагол."], ["Present Continuous?", ["am/is/are + -ing", "do/does", "have/has"], 0, "am/is/are + -ing."], ["Какой вспомогательный глагол в Present Perfect?", ["have/has", "do/does", "will"], 0, "have/has."]] },
  { id: "eng2", subject: "Английский язык", type: "presentation", title: "Present Simple", desc: "6 слайдов.", slides: [["Present Simple", "Простое настоящее время."], ["Утверждение", "I/You/We/They + глагол. He/She/It + глагол+s."], ["Отрицание", "do/does + not + глагол."], ["Вопрос", "Do/Does + подлежащее + глагол?"], ["Маркеры", "always, usually, often, sometimes."], ["Примеры", "I play. He plays. Do you play?"]] },
  { id: "eng3", subject: "Английский язык", type: "cards", title: "Everyday English", desc: "8 карточек.", cards: [["Good morning", "Доброе утро"], ["How are you?", "Как дела?"], ["Thank you", "Спасибо"], ["Could you help me?", "Не могли бы помочь?"], ["See you later", "До встречи"], ["Excuse me", "Извините"], ["What's the time?", "Который час?"], ["I don't understand", "Я не понимаю"]] },
  
  // --- ОБЩЕСТВОЗНАНИЕ ---
  { id: "soc1", subject: "Обществознание", type: "test", title: "Человек и общество", desc: "5 вопросов.", questions: [["Что такое общество?", ["Группа","Форма объединения","Государство"], 1, "Форма совместной деятельности."], ["Духовная сфера?", ["Образование","Промышленность","Транспорт"], 0, "Образование."], ["Социальная норма?", ["Правило поведения","Товар","Явление"], 0, "Правило поведения."], ["Малая группа?", ["Семья","Континент","Экономика"], 0, "Семья."], ["Что такое мораль?", ["Нормы добра и зла","Закон физики","Валюта"], 0, "Нравственные нормы."]] },
  { id: "soc2", subject: "Обществознание", type: "presentation", title: "Сферы общества", desc: "4 слайда.", slides: [["Сферы общества", "Экономическая, политическая, социальная, духовная."], ["Экономическая", "Производство, обмен, распределение."], ["Политическая", "Власть, государство, партии."], ["Духовная", "Наука, религия, искусство, мораль."]] },
  { id: "soc3", subject: "Обществознание", type: "cards", title: "Обществоведческие термины", desc: "6 карточек.", cards: [["Индивид", "Отдельный человек."], ["Личность", "Субъект социальных отношений."], ["Общество", "Объединение людей."], ["Государство", "Политическая организация."], ["Мораль", "Нормы поведения."], ["Право", "Система законов."]] }
];

/* =====================================================
   ОТРИСОВКА МАТЕРИАЛОВ
   ===================================================== */
function typeLabel(type) { return { test: "Тест", presentation: "Презентация", cards: "Карточки" }[type] || "Материал"; }

function filterMaterials() {
  const queryEl = $("searchInput"); const query = queryEl ? queryEl.value.toLowerCase().trim() : "";
  const subjectEl = $("subjectFilter"); const subject = subjectEl ? subjectEl.value : "all";
  const typeEl = $("typeFilter"); const type = typeEl ? typeEl.value : "all";

  const found = materials.filter(item => {
    const matchesSubject = subject === "all" || item.subject === subject;
    const matchesType = type === "all" || item.type === type;
    const searchText = (item.title + " " + item.subject + " " + item.desc).toLowerCase();
    return matchesSubject && matchesType && searchText.includes(query);
  });

  const grid = $("materialsGrid"); if(!grid) return;
  grid.innerHTML = found.length
    ? found.map(item => `
      <article class="material-card">
        <div class="material-icon">${item.type === "test" ? "📝" : item.type === "presentation" ? "📽️" : "🗂️"}</div>
        <span class="tag">${typeLabel(item.type)} · ${escapeHTML(item.subject)}</span>
        <h3>${escapeHTML(item.title)}</h3>
        <p>${escapeHTML(item.desc)}</p>
        <button class="btn-primary" onclick="viewMaterial('${item.id}')">Открыть →</button>
      </article>
    `).join("")
    : '<div class="empty-state">Ничего не найдено.</div>';
}

function viewMaterial(id) {
  currentMaterial = materials.find(item => item.id === id);
  if (!currentMaterial) return;
  slideIndex = 0; flashIndex = 0; flashBack = false; testAnswers = {};
  renderMaterial();
  openModal();
}

function renderMaterial() {
  const item = currentMaterial;
  const body = $("modalBody"); if(!body) return;
  
  if (item.type === "presentation") {
    body.innerHTML = `
      <div class="ppt-wrapper">
        <div class="ppt-sidebar">
          ${item.slides.map((_, i) => `
            <div class="ppt-thumb ${i === slideIndex ? 'active' : ''}" onclick="jumpToSlide(${i})">
              Слайд ${i + 1}
            </div>
          `).join('')}
        </div>
        <div class="ppt-main">
          <div class="ppt-slide" id="pptSlideContent"></div>
          <div class="ppt-controls">
            <button class="btn-outline" onclick="moveSlide(-1)" ${slideIndex === 0 ? 'disabled' : ''}>← Назад</button>
            <span style="color:var(--text-muted); font-size:14px;">${slideIndex + 1} / ${item.slides.length}</span>
            <button class="btn-primary" onclick="moveSlide(1)" ${slideIndex === item.slides.length - 1 ? 'disabled' : ''}>Далее →</button>
            <button class="btn-secondary" onclick="downloadPPT()" style="margin-left:20px;">📥 Скачать .PPTX</button>
          </div>
        </div>
      </div>
    `;
    renderSlide();
  }
  
  else if (item.type === "cards") {
    body.innerHTML = `
      <h2 class="pixel-text" style="text-align:center; margin-bottom:20px;">${escapeHTML(item.title)}</h2>
      <div class="flashcards-container">
        ${item.cards.map(card => `
          <div class="flashcard" onclick="this.classList.toggle('flipped')">
            <div class="flashcard-inner">
              <div class="flashcard-front">${escapeHTML(card[0])}</div>
              <div class="flashcard-back">${escapeHTML(card[1])}</div>
            </div>
          </div>
        `).join('')}
      </div>
      <div style="text-align:center; margin-top:20px;">
        <button class="btn-primary" onclick="downloadCardsPDF()">📥 Скачать карточки (PDF)</button>
      </div>
    `;
  }
  
  else if (item.type === "test") {
    body.innerHTML = `
      <div class="test-wrapper">
        <h2 class="pixel-text" style="text-align:center; margin-bottom:20px;">${escapeHTML(item.title)}</h2>
        <div class="test-progress-bar"><div class="test-progress-fill" id="testProgress" style="width: 0%;"></div></div>
        <div id="testArea"></div>
        <div style="display:flex; justify-content:space-between; margin-top:20px;">
          <button class="btn-secondary" onclick="downloadTestPDF()">📥 Скачать бланк (PDF)</button>
          <button class="btn-primary" onclick="checkTest()">Проверить ответы</button>
        </div>
        <div id="testResult" style="margin-top:20px;"></div>
      </div>
    `;
    renderTest();
  }
}

function jumpToSlide(index) {
  slideIndex = index;
  document.querySelectorAll('.ppt-thumb').forEach((t, i) => t.classList.toggle('active', i === slideIndex));
  renderSlide();
}

function renderSlide() {
  const slide = currentMaterial.slides[slideIndex];
  const content = $("pptSlideContent"); if(!content) return;
  content.innerHTML = `
    <h1>${escapeHTML(slide[0])}</h1>
    <p>${escapeHTML(slide[1])}</p>
  `;
  const btns = document.querySelectorAll('.ppt-controls button');
  if(btns.length >= 2) {
    btns[0].disabled = slideIndex === 0;
    btns[1].disabled = slideIndex === currentMaterial.slides.length - 1;
    const counter = document.querySelector('.ppt-controls span');
    if(counter) counter.innerText = `${slideIndex + 1} / ${currentMaterial.slides.length}`;
  }
}

function moveSlide(dir) {
  slideIndex = Math.max(0, Math.min(currentMaterial.slides.length - 1, slideIndex + dir));
  document.querySelectorAll('.ppt-thumb').forEach((t, i) => t.classList.toggle('active', i === slideIndex));
  renderSlide();
}

function renderTest() {
  const area = $("testArea"); if(!area) return;
  area.innerHTML = currentMaterial.questions.map((q, index) => `
    <div class="test-question-card">
      <h3>${index + 1}. ${escapeHTML(q[0])}</h3>
      ${q[1].map((opt, optIndex) => `
        <button class="test-option ${testAnswers[index] === optIndex ? "selected" : ""}" onclick="chooseAnswer(${index},${optIndex})">
          ${String.fromCharCode(65 + optIndex)}. ${escapeHTML(opt)}
        </button>
      `).join("")}
    </div>
  `).join("");
}

function chooseAnswer(qIndex, optIndex) { 
  testAnswers[qIndex] = optIndex; 
  renderTest();
  const progress = (Object.keys(testAnswers).length / currentMaterial.questions.length) * 100;
  const bar = $("testProgress"); if(bar) bar.style.width = `${progress}%`;
}

function checkTest() {
  const qs = currentMaterial.questions;
  if (Object.keys(testAnswers).length !== qs.length) { toast("Ответьте на все вопросы", "error"); return; }
  
  const questions = document.querySelectorAll('.test-question-card');
  let correct = 0;
  
  qs.forEach((q, i) => {
    const options = questions[i].querySelectorAll('.test-option');
    const chosen = testAnswers[i];
    const correctIdx = q[2];
    
    if (chosen === correctIdx) {
      options[chosen].classList.add('correct');
      correct++;
    } else {
      options[chosen].classList.add('wrong');
      options[correctIdx].classList.add('correct');
    }
  });

  const percent = Math.round(correct / qs.length * 100);
  const res = $("testResult");
  if(res) {
    res.innerHTML = `
      <div class="test-result-screen">
        <h2>${percent}%</h2>
        <p>Правильных ответов: ${correct} из ${qs.length}</p>
        <p>${percent >= 85 ? "Отличный результат!" : percent >= 60 ? "Хорошая работа! Повторите ошибки." : "Повторите тему и попробуйте ещё раз."}</p>
        <button class="btn-primary" onclick="viewMaterial('${currentMaterial.id}')">Пройти заново</button>
      </div>
    `;
  }
  toast(`Тест завершён: ${correct} из ${qs.length}`, "success");
}

/* =====================================================
   СКАЧИВАНИЕ
   ===================================================== */
function downloadPPT() {
    if (!currentMaterial || currentMaterial.type !== 'presentation') return;
    let pptx = new PptxGenJS();
    pptx.layout = 'LAYOUT_16x9'; 
    currentMaterial.slides.forEach(slide => {
        let s = pptx.addSlide();
        s.background = { color: '1C0D36' };
        s.addText(slide[0], { x: 0.5, y: 0.5, w: 9, h: 1.5, fontSize: 36, color: 'B44AFF', bold: true, fontFace: 'Arial' });
        s.addText(slide[1], { x: 0.5, y: 2.0, w: 9, h: 3, fontSize: 20, color: 'F0E6FF', fontFace: 'Arial' });
    });
    pptx.writeFile({ fileName: `${currentMaterial.title}.pptx` });
    toast("Презентация скачана в PPTX!", "success");
}

function downloadCardsPDF() {
    if (!currentMaterial || currentMaterial.type !== 'cards') return;
    let html = `<h2 style="text-align:center; color:#7134aa; font-family:Arial;">${currentMaterial.title}</h2>`;
    currentMaterial.cards.forEach(card => {
        html += `<div style="border: 2px solid #7134aa; border-radius: 10px; padding: 20px; margin-bottom: 20px; page-break-inside: avoid;"><h3 style="color:#7134aa; margin-bottom:10px;">${card[0]}</h3><p style="font-size:16px;">${card[1]}</p></div>`;
    });
    const element = document.createElement('div'); element.innerHTML = html;
    html2pdf().from(element).set({ margin: 10, filename: `${currentMaterial.title}.pdf`, html2canvas: { scale: 2 }, jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' } }).save();
    toast("Карточки скачаны в PDF!", "success");
}

function downloadTestPDF() {
    if (!currentMaterial || currentMaterial.type !== 'test') return;
    let html = `<h2 style="text-align:center; color:#7134aa; font-family:Arial;">${currentMaterial.title}</h2>`;
    html += `<p style="font-family:Arial; margin-bottom:20px;">ФИО: _________________________ Дата: _________</p>`;
    currentMaterial.questions.forEach((q, i) => {
        html += `<div style="margin-bottom: 20px; page-break-inside: avoid; font-family:Arial;"><h4>${i+1}. ${q[0]}</h4><ul style="list-style-type: none; padding-left: 0;">${q[1].map((opt, j) => `<li style="margin-bottom:5px;">${String.fromCharCode(65+j)}) ${opt}</li>`).join('')}</ul></div>`;
    });
    const element = document.createElement('div'); element.innerHTML = html;
    html2pdf().from(element).set({ margin: 10, filename: `${currentMaterial.title}.pdf`, html2canvas: { scale: 2 }, jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' } }).save();
    toast("Тест скачан в PDF!", "success");
}

/* =====================================================
   ЧАТ
   ===================================================== */
function switchChat(id, button) {
  data.currentChat = id;
  document.querySelectorAll(".chat-contact").forEach(item => item.classList.toggle("active", item.dataset.chat === id));
  saveData(); renderChat();
}

function renderChat() {
  const id = data.currentChat;
  const messages = data.messages[id] || [];
  const container = $("chatMessages"); if(!container) return;
  
  container.innerHTML = messages.map(m => `<div class="msg ${escapeHTML(m.kind)}">${escapeHTML(m.text)}<time style="font-size:10px; opacity:0.6; display:block; margin-top:3px;">${escapeHTML(m.time)}</time></div>`).join("");
  container.scrollTop = container.scrollHeight;
  
  const replies = {
    parents: [{ label: '📚 Все в журнале', text: 'Все задания в электронном журнале.' }],
    colleagues: [{ label: '📄 Отчеты', text: 'Сдайте отчеты до четверга.' }],
    class: [{ label: '📝 ДЗ', text: 'Запишите домашнее задание.' }]
  };
  const qr = $("quickReplies");
  if(qr) qr.innerHTML = replies[id].map(r => `<button class="quick-reply-btn" onclick="sendMessage('${r.text}')">${r.label}</button>`).join('');
}

function sendMessage(textFromQuick = null) {
  const input = $("chatInput");
  const text = textFromQuick || (input ? input.value.trim() : "");
  if (!text) return;
  if (data.chatSettings.dnd) { toast("Включен режим 'Не беспокоить'", "error"); return; }
  
  data.messages[data.currentChat].push({ kind: 'sent', text, time: new Date().toLocaleTimeString('ru-RU', {hour:'2-digit', minute:'2-digit'}) });
  if (input && !textFromQuick) input.value = '';
  saveData(); renderChat();
  
  setTimeout(() => {
    let reply = "Спасибо за сообщение!";
    if (data.currentChat === 'parents' && text.includes('домашн')) reply = "А какое именно задание?";
    if (data.currentChat === 'colleagues' && text.includes('отчет')) reply = "Хорошо, я скину вечером.";
    data.messages[data.currentChat].push({ kind: 'received', text: reply, time: new Date().toLocaleTimeString('ru-RU', {hour:'2-digit', minute:'2-digit'}) });
    saveData(); renderChat();
  }, 1500);
}

function saveChatSettings() {
  const dnd = $("dndCheckbox");
  const qs = $("quietStart");
  const qe = $("quietEnd");
  
  data.chatSettings = { 
    dnd: dnd ? dnd.checked : false, 
    start: qs ? qs.value : "20:00", 
    end: qe ? qe.value : "08:00", 
    autoReply: true 
  };
  saveData(); toast("Настройки сохранены", "success");
}

/* =====================================================
   ОТЧЕТЫ: ПОЛНОЦЕННЫЙ КТП И ВЕДОМОСТЬ
   ===================================================== */
const maleFirst = ['Александр', 'Дмитрий', 'Максим', 'Сергей', 'Андрей', 'Алексей', 'Артем', 'Илья', 'Кирилл', 'Михаил', 'Никита', 'Матвей', 'Роман', 'Егор', 'Арсений', 'Иван', 'Денис', 'Евгений', 'Даниил', 'Тимофей'];
const maleLast = ['Иванов', 'Смирнов', 'Кузнецов', 'Попов', 'Васильев', 'Петров', 'Соколов', 'Михайлов', 'Новиков', 'Федоров', 'Морозов', 'Волков', 'Алексеев', 'Лебедев', 'Семенов', 'Егоров', 'Павлов', 'Козлов', 'Степанов', 'Николаев'];
const femaleFirst = ['Анна', 'Мария', 'Елена', 'Ольга', 'Наталья', 'Ирина', 'Татьяна', 'Екатерина', 'София', 'Дарья', 'Алиса', 'Полина', 'Виктория', 'Ксения', 'Валерия', 'Арина', 'Ева', 'Милана', 'Вероника', 'Кристина'];
const femaleLast = ['Иванова', 'Смирнова', 'Кузнецова', 'Попова', 'Васильева', 'Петрова', 'Соколова', 'Михайлова', 'Новикова', 'Федорова', 'Морозова', 'Волкова', 'Алексеева', 'Лебедева', 'Семенова', 'Егорова', 'Павлова', 'Козлова', 'Степанова', 'Николаева'];

function generateStudentsForClass(className, count = 28) {
  let students = [];
  for (let i = 0; i < count; i++) {
    let isMale = Math.random() > 0.5;
    let name = isMale 
      ? `${maleLast[Math.floor(Math.random() * maleLast.length)]} ${maleFirst[Math.floor(Math.random() * maleFirst.length)]}`
      : `${femaleLast[Math.floor(Math.random() * femaleLast.length)]} ${femaleFirst[Math.floor(Math.random() * femaleFirst.length)]}`;
    students.push({ name, marks: ["", "", "", "", "", ""] });
  }
  return students.sort((a, b) => a.name.localeCompare(b.name));
}

// ИСПРАВЛЕННЫЙ И ПОЛНОСТЬЮ ЗАПОЛНЕННЫЙ КТП ДЛЯ ВСЕХ ПРЕДМЕТОВ
function getKTP(className, subject) {
    const topicsMap = {
        "Математика": [
            "Вводный инструктаж. Повторение курса прошлого года.", "Линейные уравнения с одной переменной.", "Решение задач с помощью уравнений.", "Функция. График функции.", "Линейная функция и её график.", "Решение систем линейных уравнений.", "Степень с натуральным показателем.", "Свойства степени с натуральным показателем.", "Одночлены. Действия с одночленами.", "Многочлены. Сложение и вычитание.", "Умножение многочлена на одночлен.", "Умножение многочленов.", "Формулы сокращённого умножения.", "Разложение многочленов на множители.", "Квадратные уравнения. Основные понятия.", "Решение квадратных уравнений.", "Теорема Виета.", "Дробные рациональные уравнения.", "Решение задач с помощью дробных уравнений.", "Итоговое повторение. Подготовка к контрольной."
        ],
        "Алгебра": [
            "Вводный инструктаж. Повторение курса прошлого года.", "Линейные уравнения с одной переменной.", "Решение задач с помощью уравнений.", "Функция. График функции.", "Линейная функция и её график.", "Решение систем линейных уравнений.", "Степень с натуральным показателем.", "Свойства степени с натуральным показателем.", "Одночлены. Действия с одночленами.", "Многочлены. Сложение и вычитание.", "Умножение многочлена на одночлен.", "Умножение многочленов.", "Формулы сокращённого умножения.", "Разложение многочленов на множители.", "Квадратные уравнения. Основные понятия.", "Решение квадратных уравнений.", "Теорема Виета.", "Дробные рациональные уравнения.", "Решение задач с помощью дробных уравнений.", "Итоговое повторение. Подготовка к контрольной."
        ],
        "Геометрия": [
            "Вводный инструктаж. Начальные геометрические сведения.", "Прямая и отрезок. Луч и угол.", "Сравнение отрезков и углов.", "Измерение отрезков и углов.", "Смежные и вертикальные углы.", "Перпендикулярные прямые.", "Треугольники. Первый признак равенства.", "Второй признак равенства треугольников.", "Третий признак равенства треугольников.", "Окружность. Построения циркулем.", "Параллельные прямые. Признаки параллельности.", "Аксиомы геометрии.", "Сумма углов треугольника.", "Соотношения между сторонами и углами.", "Прямоугольные треугольники.", "Решение задач на прямоугольные треугольники.", "Построение циркулем и линейкой.", "Обобщение темы 'Треугольники'.", "Подготовка к контрольной работе.", "Итоговое повторение курса."
        ],
        "Русский язык": [
            "Русский язык как развивающееся явление.", "Повторение изученного в предыдущих классах.", "Причастие как часть речи.", "Склонение причастий и правописание гласных.", "Причастный оборот. Знаки препинания.", "Действительные и страдательные причастия.", "Краткие и полные страдательные причастия.", "Деепричастие как часть речи.", "Деепричастный оборот. Знаки препинания.", "Правописание НЕ с причастиями и деепричастиями.", "Наречие как часть речи.", "Смысловые группы наречий.", "Степени сравнения наречий.", "Правописание наречий. Слитное и раздельное написание.", "Служебные части речи. Предлог.", "Союз как часть речи.", "Частица как часть речи.", "Междометие. Звукоподражательные слова.", "Комплексный анализ текста.", "Итоговый диктант и его анализ."
        ],
        "Литература": [
            "Введение. Литература как искусство слова.", "Устное народное творчество. Былины.", "Древнерусская литература. 'Повесть временных лет'.", "Басни И.А. Крылова.", "А.С. Пушкин. Лирика.", "А.С. Пушкин. 'Капитанская дочка'.", "М.Ю. Лермонтов. 'Мцыри'.", "Н.В. Гоголь. 'Ревизор'.", "И.С. Тургенев. 'Ася'.", "Н.А. Некрасов. Лирика.", "М.Е. Салтыков-Щедрин. Сказки.", "А.П. Чехов. Рассказы.", "Поэзия Серебряного века.", "Проза 20 века. М. Горький.", "Проза 20 века. М. Булгаков.", "Поэзия Великой Отечественной войны.", "Зарубежная литература. Шекспир.", "Зарубежная литература. Мольер.", "Повторение пройденного материала.", "Итоговый урок. Рекомендации на лето."
        ],
        "История": [
            "Введение в историю Древнего мира.", "Первобытные собиратели и охотники.", "Возникновение искусства и религиозных верований.", "Возникновение земледелия и скотоводства.", "Древний Египет. Государство на берегах Нила.", "Жизнь в Древнем Египте.", "Фараоны и вельможи. Труд земледельцев.", "Древнее Двуречье. Законы Хаммурапи.", "Финикийские мореплаватели.", "Древнееврейское царство.", "Ассирийская держава. Военное искусство.", "Персидская держава 'Царя царей'.", "Древняя Индия. Индийские касты.", "Древний Китай. Учение Конфуция.", "Древняя Греция. Крит и Микены.", "Поэмы Гомера 'Илиада' и 'Одиссея'.", "Религия древних греков. Олимпийские игры.", "Древний Рим. Возникновение Республики.", "Пунические войны. Гибель Карфагена.", "Итоговое тестирование по курсу."
        ],
        "Обществознание": [
            "Введение. Человек и его деятельность.", "Потребности человека. Способности.", "Личность. Социализация индивида.", "Общество как форма жизнедеятельности.", "Сферы общественной жизни.", "Социальные нормы и отклоняющееся поведение.", "Семья и семейные отношения.", "Экономика и её роль в жизни общества.", "Деньги. Функции денег.", "Рынок и рыночные отношения.", "Труд и трудовые отношения.", "Государство. Политические режимы.", "Право и его роль в жизни общества.", "Конституция РФ. Основы строя.", "Права и свободы человека и гражданина.", "Права ребенка.", "Правонарушения и юридическая ответственность.", "Правоохранительные органы.", "Международное гуманитарное право.", "Итоговое обобщение знаний."
        ],
        "География": [
            "Введение в географию. Методы познания.", "Великие географические открытия.", "Земля как планета. Строение Земли.", "Литосфера и рельеф Земли.", "Горные породы и минералы.", "Атмосфера. Температура воздуха.", "Атмосферное давление и ветер.", "Влажность воздуха. Осадки.", "Погода и климат.", "Гидросфера. Мировой океан.", "Воды суши. Реки и озера.", "Биосфера. Разнообразие растительного и животного мира.", "Природные зоны мира.", "Взаимодействие природы и общества.", "Население Земли. Расы и народы.", "Политическая карта мира. Страны.", "Хозяйственная деятельность людей.", "Глобальные проблемы человечества.", "Итоговое повторение по курсу.", "Резервный урок."
        ],
        "Биология": [
            "Биология как наука. Методы исследования.", "Клеточное строение организмов.", "Химический состав клетки.", "Ткани растений и животных.", "Органы и системы органов.", "Царство Растения. Водоросли.", "Мхи. Папоротники.", "Голосеменные растения.", "Покрытосеменные. Строение цветка.", "Фотосинтез. Дыхание растений.", "Царство Животные. Простейшие.", "Кишечнополостные.", "Черви. Моллюски.", "Членистоногие (Ракообразные, Паукообразные).", "Насекомые.", "Рыбы. Земноводные.", "Пресмыкающиеся. Птицы.", "Млекопитающие.", "Царство Грибы. Лишайники.", "Итоговое обобщение. Летние задания."
        ],
        "Химия": [
            "Предмет химии. Вещества и их свойства.", "Атомы и молекулы. Химические элементы.", "Простые и сложные вещества.", "Валентность химических элементов.", "Химические формулы. Относительная атомная масса.", "Моль — единица количества вещества.", "Закон сохранения массы веществ.", "Химические уравнения.", "Типы химических реакций.", "Кислород. Получение и свойства.", "Водород. Получение и свойства.", "Вода. Растворы.", "Основания. Получение и свойства.", "Кислоты. Получение и свойства.", "Соли. Получение и свойства.", "Оксиды. Получение и свойства.", "Генетическая связь между классами веществ.", "Практическая работа 'Решение экспериментальных задач'.", "Обобщение знаний по неорганической химии.", "Итоговая контрольная работа."
        ],
        "Физика": [
            "Введение. Методы познания природы.", "Механическое движение. Равномерное и неравномерное.", "Скорость. Единицы скорости.", "Инерция. Взаимодействие тел.", "Масса тела. Плотность вещества.", "Сила. Явление тяготения. Сила тяжести.", "Сила упругости. Закон Гука.", "Вес тела. Невесомость.", "Сила трения. Виды трения.", "Демонстрация опытов по механике.", "Давление. Способы уменьшения и увеличения.", "Давление в жидкости и газе. Закон Паскаля.", "Атмосферное давление.", "Архимедова сила.", "Плавание тел. Лабораторная работа.", "Работа и мощность. Энергия.", "Кинетическая и потенциальная энергия.", "Простые механизмы. Рычаг.", "Решение задач по теме 'Работа и мощность'.", "Итоговое обобщение за курс."
        ],
        "Информатика": [
            "Информация. Виды и свойства информации.", "Измерение информации. Единицы измерения.", "Двоичная система счисления.", "Устройство персонального компьютера.", "Программное обеспечение ПК.", "Файлы и файловые структуры.", "Текстовые редакторы. Создание документов.", "Компьютерная графика.", "Электронные таблицы. Ввод данных.", "Электронные таблицы. Формулы и диаграммы.", "Мультимедийные презентации.", "Алгоритмы. Свойства алгоритмов.", "Исполнители алгоритмов.", "Блок-схемы. Основные конструкции.", "Программирование. Введение.", "Программирование циклов и условий.", "Базы данных. Основы.", "Компьютерные сети. Интернет.", "Безопасность в сети Интернет.", "Итоговое обобщение и тестирование."
        ],
        "Английский язык": [
            "Вводный урок. Повторение алфавита и правил чтения.", "Школа. Классно-урочная лексика.", "Present Simple. Утвердительные предложения.", "Present Simple. Вопросительные и отрицательные.", "Моя семья. Притяжательные местоимения.", "Мой дом. Оборот 'there is / there are'.", "Еда и напитки. Исчисляемые существительные.", "Past Simple. Правильные глаголы.", "Past Simple. Неправильные глаголы.", "Практика чтения. Адаптированный текст.", "Мой рабочий день. Предлоги времени.", "Свободное время. Хобби.", "Future Simple. Планы на будущее.", "Погода и времена года.", "Праздники в России и Великобритании.", "Множественное число существительных.", "Степени сравнения прилагательных.", "Аудирование. Прослушивание диалогов.", "Письмо. Написание личного письма.", "Итоговое повторение и тест."
        ]
    };

    let topics = topicsMap[subject] || [
        "Вводное занятие. Инструктаж по ТБ.", "Повторение ранее изученного материала.", "Основные понятия и определения темы.", "Изучение новой темы: теоретическая часть.", "Изучение новой темы: практические примеры.", "Закрепление пройденного. Решение задач.", "Самостоятельная работа по теме.", "Лабораторная/Практическая работа.", "Обобщение и систематизация знаний.", "Контрольная работа по теме.", "Анализ типичных ошибок.", "Новый раздел. Постановка проблемы.", "Изучение сложных аспектов темы.", "Работа с источниками информации.", "Проектная деятельность.", "Подготовка к итоговой работе.", "Защита проекта/Доклады.", "Итоговая контрольная работа.", "Коррекция знаний.", "Резервный урок. Подведение итогов за четверть."
    ];

    let fullKTP = [];
    let currentDate = new Date(2024, 8, 1); // 1 сентября 2024

    for(let i=0; i<20; i++) {
        currentDate.setDate(currentDate.getDate() + (i === 0 ? 0 : 2)); 
        let dateStr = `${String(currentDate.getDate()).padStart(2, '0')}.${String(currentDate.getMonth() + 1).padStart(2, '0')}`;

        fullKTP.push({
            num: i + 1,
            date: dateStr,
            topic: topics[i] || `Занятие ${i+1}`,
            hours: 1,
            results: i < 10 ? "Понимать суть явления, уметь приводить примеры." : "Владеть материалом, применять на практике.",
            activity: i % 3 === 0 ? "Лекция с элементами беседы." : (i % 3 === 1 ? "Практическая работа, решение задач." : "Самостоятельная работа."),
            control: i === 9 || i === 17 ? "Контрольная работа" : (i % 2 === 0 ? "Устный опрос" : "Проверочная работа")
        });
    }
    return fullKTP;
}

function reportKey() { 
  const c = $("reportClass"); 
  const s = $("reportSubject"); 
  return (c ? c.value : "") + "|" + (s ? s.value : ""); 
}

function ensureReport() {
  const key = reportKey();
  if (!data.report.grades[key]) {
    const count = 25 + Math.floor(Math.random() * 9); 
    const cVal = $("reportClass") ? $("reportClass").value : "Класс";
    data.report.grades[key] = generateStudentsForClass(cVal, count);
  }
  return key;
}

function renderReport() {
  const key = ensureReport();
  const type = $("reportType") ? $("reportType").value : "ktp";
  if (type === "ktp") renderKTP();
  else renderGradebook(key);
  saveData();
}

function renderKTP() {
  const className = $("reportClass") ? $("reportClass").value : "Класс";
  const subject = $("reportSubject") ? $("reportSubject").value : "Предмет";
  const ktpData = getKTP(className, subject);
  const hours = ktpData.reduce((sum, row) => sum + Number(row.hours || 0), 0);
  
  const summary = $("reportSummary");
  if(summary) summary.innerHTML = `
    <div class="stat-card"><small>Количество занятий</small><strong>${ktpData.length}</strong></div>
    <div class="stat-card"><small>Всего часов</small><strong>${hours}</strong></div>
    <div class="stat-card"><small>Класс и предмет</small><strong>${escapeHTML(className)} · ${escapeHTML(subject)}</strong></div>
  `;
  
  const tableCont = $("reportTableContainer");
  if(tableCont) tableCont.innerHTML = `
    <table class="ktp-table">
      <thead>
        <tr><th>№</th><th>Дата</th><th>Тема урока</th><th>Часы</th><th>Планируемые результаты</th><th>Деятельность</th><th>Контроль</th></tr>
      </thead>
      <tbody>
        ${ktpData.map(row => `
          <tr>
            <td><b>${row.num}</b></td>
            <td>${escapeHTML(row.date)}</td>
            <td>${escapeHTML(row.topic)}</td>
            <td>${row.hours}</td>
            <td>${escapeHTML(row.results)}</td>
            <td>${escapeHTML(row.activity)}</td>
            <td>${escapeHTML(row.control)}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
  const editor = $("reportEditor"); if(editor) editor.innerHTML = ''; 
}

function renderGradebook(key) {
  const rows = data.report.grades[key];
  let allMarks = [];
  rows.forEach(r => r.marks.forEach(m => { if(m && m !== 'Н') allMarks.push(Number(m)); }));
  let avg = allMarks.length ? (allMarks.reduce((a,b)=>a+b,0) / allMarks.length).toFixed(2) : '—';

  const summary = $("reportSummary");
  if(summary) summary.innerHTML = `
    <div class="stat-card"><small>Учеников в классе</small><strong>${rows.length}</strong></div>
    <div class="stat-card"><small>Средний балл</small><strong>${avg}</strong></div>
  `;

  const tableCont = $("reportTableContainer");
  if(tableCont) tableCont.innerHTML = `
    <table><thead><tr><th>№</th><th>ФИО</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>Ср. балл</th></tr></thead><tbody>
      ${rows.map((r, i) => `
        <tr>
          <td>${i+1}</td><td>${escapeHTML(r.name)}</td>
          ${r.marks.map((m, j) => `<td><select class="grade-select" onchange="updateGrade(${i},${j},this.value)"><option value="" ${m===''?'selected':''}>—</option>${['2','3','4','5','Н'].map(v => `<option value="${v}" ${m===v?'selected':''}>${v}</option>`).join('')}</select></td>`).join('')}
          <td><b>${r.marks.filter(m=>m&&m!=='Н').length ? (r.marks.filter(m=>m&&m!=='Н').reduce((a,b)=>a+Number(b),0)/r.marks.filter(m=>m&&m!=='Н').length).toFixed(2) : '—'}</b></td>
        </tr>
      `).join('')}
    </tbody></table>
  `;
  const editor = $("reportEditor"); if(editor) editor.innerHTML = '<p class="muted">Оценки редактируются в таблице выше.</p>';
}

function updateGrade(studentIndex, markIndex, value) {
  data.report.grades[reportKey()][studentIndex].marks[markIndex] = value;
  saveData(); renderGradebook(reportKey());
}

function exportReportExcel() {
    let dataToExport = [];
    let fileName = "Отчет.xlsx";
    const type = $("reportType") ? $("reportType").value : "ktp";
    if (type === "ktp") {
        dataToExport = getKTP($("reportClass").value, $("reportSubject").value);
        fileName = "КТП.xlsx";
    } else {
        const rows = data.report.grades[reportKey()];
        dataToExport = rows.map((r, i) => ({
            "№": i + 1, "ФИО Ученика": r.name,
            "Оценка 1": r.marks[0], "Оценка 2": r.marks[1], "Оценка 3": r.marks[2],
            "Оценка 4": r.marks[3], "Оценка 5": r.marks[4], "Оценка 6": r.marks[5]
        }));
        fileName = "Ведомость.xlsx";
    }
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Данные");
    XLSX.writeFile(wb, fileName);
    toast("Файл Excel успешно скачан!", "success");
}

function exportReportPDF() {
    const element = $("reportOutputContainer"); if(!element) return;
    const actions = document.querySelector('.report-actions');
    if(actions) actions.style.display = 'none';
    html2pdf().from(element).set({
        margin: 10, filename: 'Отчет.pdf', image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 }, jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
    }).save().then(() => {
        if(actions) actions.style.display = 'flex';
        toast("PDF отчет скачан!", "success");
    });
}

function printReport() {
  const contentEl = $("reportTableContainer"); if(!contentEl) return;
  const content = contentEl.innerHTML;
  const win = window.open('', '_blank');
  const subject = $("reportSubject") ? $("reportSubject").value : "";
  win.document.write(`<html><head><title>Отчет</title><style>body{font-family:Arial; padding:20px;} table{width:100%; border-collapse:collapse;} th,td{border:1px solid #ccc; padding:8px;} th{background:#eee;}</style></head><body><h2>${subject}</h2>${content}</body></html>`);
  win.document.close(); win.print();
}

/* =====================================================
   АВТОРИЗАЦИЯ И ПРОФИЛЬ
   ===================================================== */
function openAuthModal(type) { const el = $("authModal"); if(el) el.style.display = 'block'; switchAuthTab(type); }
function switchAuthTab(type) {
  const lf = $("loginForm"); if(lf) lf.style.display = type === 'login' ? 'block' : 'none';
  const rf = $("registerForm"); if(rf) rf.style.display = type === 'register' ? 'block' : 'none';
  document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
  const btn = $(type === 'login' ? 'tabLoginBtn' : 'tabRegisterBtn'); if(btn) btn.classList.add('active');
}
function handleAuth(event, type) {
  event.preventDefault();
  let name = type === 'login' ? $("loginName").value : $("registerName").value;
  data.profile.name = name || "Учитель";
  saveData(); renderProfile();
  const aArea = $("authArea"); if(aArea) aArea.style.display = 'none';
  const pArea = $("profileArea"); if(pArea) pArea.style.display = 'flex';
  closeModal('authModal'); event.target.reset(); toast("Добро пожаловать!", "success");
}
function logout() { 
  const aArea = $("authArea"); if(aArea) aArea.style.display = 'flex'; 
  const pArea = $("profileArea"); if(pArea) pArea.style.display = 'none'; 
  toast("Вы вышли", "info"); 
}
function renderProfile() {
  if($("userNameDisplay")) $("userNameDisplay").textContent = data.profile.name;
  if($("headerAvatar")) $("headerAvatar").textContent = data.profile.avatar;
  if($("profileAvatar")) $("profileAvatar").textContent = data.profile.avatar;
  if($("editProfileName")) $("editProfileName").value = data.profile.name;
  if($("editProfileCity")) $("editProfileCity").value = data.profile.city || '';
  if($("editProfileSchool")) $("editProfileSchool").value = data.profile.school || '';
  if($("editProfileSubject")) $("editProfileSubject").value = data.profile.subject || '';
}
function saveProfile() {
  data.profile.name = $("editProfileName") ? $("editProfileName").value.trim() : "Учитель";
  data.profile.city = $("editProfileCity") ? $("editProfileCity").value.trim() : "";
  data.profile.school = $("editProfileSchool") ? $("editProfileSchool").value.trim() : "";
  data.profile.subject = $("editProfileSubject") ? $("editProfileSubject").value.trim() : "";
  saveData(); renderProfile(); toast("Профиль сохранён", "success");
}
function changeAvatar(avatar) { data.profile.avatar = avatar; saveData(); renderProfile(); toast("Аватар изменён", "success"); }

/* =====================================================
   ЗАПУСК
   ===================================================== */
function initApp() {
  injectReminderStyles(); // Добавляем стили для напоминаний
  
  renderProfile();
  renderSchedule();
  renderTasks();
  filterMaterials();
  renderChat();
  renderReport();

  if($("dndCheckbox")) $("dndCheckbox").checked = data.chatSettings.dnd || false;
  if($("quietStart")) $("quietStart").value = data.chatSettings.start || "20:00";
  if($("quietEnd")) $("quietEnd").value = data.chatSettings.end || "08:00";

  if (data.profile.name !== 'Учитель') {
    if($("authArea")) $("authArea").style.display = 'none';
    if($("profileArea")) $("profileArea").style.display = 'flex';
  }

  const newTask = $("newTaskInput"); if(newTask) newTask.addEventListener("keydown", e => { if (e.key === "Enter") addTask(); });
  const chatIn = $("chatInput"); if(chatIn) chatIn.addEventListener("keydown", e => { if (e.key === "Enter") sendMessage(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });

  // Запускаем проверку времени задач каждые 10 секунд
  setInterval(checkTaskTimes, 10000);
}

document.addEventListener("DOMContentLoaded", initApp);