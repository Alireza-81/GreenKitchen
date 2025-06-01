<template>
  <div class="dashboard-container">
    <!-- Sidebar: منوی اصلی و مشخصات ادمین -->
    <aside class="sidebar">
      <!-- عنوان پنل -->
      <div class="sidebar-header">
        <h2 class="sidebar-title">داشبورد مدیریت آشپزی</h2>
        <!-- آیکون‌های تنظیمات و اعلان -->
        <div class="sidebar-icons">
          <button class="icon-btn"><span class="icon">⚙️</span></button>
          <button class="icon-btn"><span class="icon">🔔</span></button>
        </div>
      </div>

      <!-- منوی اصلی ناوبری -->
      <ul class="nav-list">
        <li :class="{ active: activeSection === 'dashboard' }" @click="activeSection = 'dashboard'">
          <span class="nav-icon">🏠</span>
          <span>داشبورد</span>
        </li>
        <li :class="{ active: activeSection === 'levels' }" @click="activeSection = 'levels'">
          <span class="nav-icon">📊</span>
          <span>سطوح آموزشی</span>
        </li>
        <li :class="{ active: activeSection === 'users' }" @click="activeSection = 'users'">
          <span class="nav-icon">👥</span>
          <span>کاربران</span>
        </li>
        <li :class="{ active: activeSection === 'content' }" @click="activeSection = 'content'">
          <span class="nav-icon">📚</span>
          <span>محتوای آموزشی</span>
        </li>
        <li :class="{ active: activeSection === 'exams' }" @click="activeSection = 'exams'">
          <span class="nav-icon">📝</span>
          <span>آزمون‌ها</span>
        </li>
        <li :class="{ active: activeSection === 'integrations' }" @click="activeSection = 'integrations'">
          <span class="nav-icon">🔌</span>
          <span>اتصالات سیستم</span>
        </li>
      </ul>

      <!-- مشخصات ادمین و دکمه خروج -->
      <div class="sidebar-footer">
        <div class="admin-info">
          <div class="avatar">👩‍💼</div>
          <div class="admin-text">
            <p class="admin-name">{{ admin.name }}</p>
            <p class="admin-email">{{ admin.email }}</p>
          </div>
        </div>
        <button class="btn btn-logout">خروج</button>
      </div>
    </aside>

    <!-- محتوای اصلی داشبورد ادمین -->
    <main class="main-content">
      <!-- ===== بخش داشبورد اولیه ===== -->
      <section v-if="activeSection === 'dashboard'">
        <!-- کارت‌های متریک بالا -->
        <section class="metrics">
          <div class="metric-card">
            <div class="metric-icon">👥</div>
            <div class="metric-info">
              <h4 class="metric-number">{{ stats.activeUsers }}</h4>
              <p class="metric-label">کاربران فعال</p>
            </div>
          </div>
          <div class="metric-card">
            <div class="metric-icon">📋</div>
            <div class="metric-info">
              <h4 class="metric-number">{{ stats.levels }}</h4>
              <p class="metric-label">سطوح آموزشی</p>
            </div>
          </div>
          <div class="metric-card">
            <div class="metric-icon">📚</div>
            <div class="metric-info">
              <h4 class="metric-number">{{ stats.contents }}</h4>
              <p class="metric-label">محتوای آموزشی</p>
            </div>
          </div>
          <div class="metric-card">
            <div class="metric-icon">✅</div>
            <div class="metric-info">
              <h4 class="metric-number">{{ stats.exams }}</h4>
              <p class="metric-label">آزمون‌ها</p>
            </div>
          </div>
        </section>

        <!-- وضعیت سیستم و فعالیت اخیر کاربران در یک کارت سفید -->
        <section class="bottom-panels-wrapper">
          <div class="panel card-panel">
            <!-- وضعیت سیستم -->
            <div class="panel system-status">
              <h3 class="panel-title">وضعیت سیستم</h3>
              <div class="status-item" v-for="(item, idx) in systemStatus" :key="idx">
                <div class="status-label">
                  <span class="status-text">{{ item.label }}</span>
                  <span v-if="item.valueLabel" class="status-value-label">{{ item.valueLabel }}</span>
                </div>
                <div class="progress-bar">
                  <div
                      class="progress-fill"
                      :style="item.percentageStyle"
                  ></div>
                </div>
                <span v-if="item.percentage" class="status-percentage">{{ item.percentage }}%</span>
              </div>
            </div>

            <!-- فعالیت اخیر کاربران -->
            <div class="panel recent-activity">
              <h3 class="panel-title">فعالیت اخیر کاربران</h3>
              <ul class="activity-list">
                <li v-for="(act, idx) in recentActivities" :key="idx">
                  <span class="activity-avatar" :style="{ backgroundColor: act.color }">{{ act.initial }}</span>
                  <div class="activity-text">
                    <p>
                      <strong>{{ act.name }}</strong>
                      {{ act.action }}
                    </p>
                    <span class="activity-time">{{ act.time }}</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </section>

      <!-- ===== بخش ویرایش سطوح آموزشی ===== -->
      <section v-else-if="activeSection === 'levels'" class="panel levels-panel">
        <h3 class="panel-title">مدیریت سطوح آموزشی</h3>
        <button class="btn btn-primary" @click="addLevel">افزودن سطح جدید</button>
        <ul class="levels-list">
          <li v-for="(level, idx) in levelsData" :key="level.id" class="level-item">
            <div class="level-order">
              <button class="btn btn-outline small" @click="moveLevelUp(idx)" :disabled="idx === 0">▲</button>
              <button class="btn btn-outline small" @click="moveLevelDown(idx)" :disabled="idx === levelsData.length - 1">▼</button>
            </div>
            <input
                type="text"
                v-model="level.title"
                class="level-input"
                placeholder="نام سطح"
            />
            <button class="btn btn-danger small" @click="removeLevel(idx)">حذف</button>
          </li>
        </ul>
      </section>

      <!-- ===== بخش مدیریت کاربران ===== -->
      <section v-else-if="activeSection === 'users'" class="panel users-panel">
        <h3 class="panel-title">مدیریت کاربران</h3>
        <table class="users-table">
          <thead>
          <tr>
            <th>نام</th>
            <th>ایمیل</th>
            <th>دسترسی</th>
            <th>اقدامات</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(usr, idx) in usersData" :key="usr.id">
            <td>{{ usr.name }}</td>
            <td>{{ usr.email }}</td>
            <td>
              <select v-model="usr.role" @change="updateUserRole(usr.id, usr.role)">
                <option value="user">کاربر عادی</option>
                <option value="manager">مدیر</option>
                <option value="admin">ادمین</option>
                <option value="banned">مسدود شده</option>
              </select>
            </td>
            <td>
              <button class="btn btn-danger small" @click="removeUser(idx)">
                حذف
              </button>
            </td>
          </tr>
          </tbody>
        </table>
      </section>

      <!-- ===== بخش مدیریت محتوای آموزشی ===== -->
      <section v-else-if="activeSection === 'content'" class="panel content-panel">
        <h3 class="panel-title">مدیریت محتوای آموزشی</h3>
        <button class="btn btn-primary" @click="addContent">افزودن محتوا</button>
        <ul class="content-list">
          <li v-for="(cont, idx) in contentData" :key="cont.id" class="content-item">
            <input
                type="text"
                v-model="cont.title"
                class="content-input"
                placeholder="عنوان محتوا"
            />
            <textarea
                v-model="cont.text"
                class="content-textarea"
                placeholder="متن محتوا"
                rows="3"
            ></textarea>
            <button class="btn btn-danger small" @click="removeContent(idx)">حذف</button>
          </li>
        </ul>
      </section>

      <!-- ===== بخش مدیریت آزمون‌ها ===== -->
      <section v-else-if="activeSection === 'exams'" class="panel exams-panel">
        <h3 class="panel-title">مدیریت آزمون‌ها</h3>
        <button class="btn btn-primary" @click="addExam">افزودن آزمون</button>
        <ul class="exams-list">
          <li v-for="(exam, eIdx) in examsData" :key="exam.id" class="exam-item">
            <div class="exam-header">
              <input
                  type="text"
                  v-model="exam.title"
                  class="exam-input"
                  placeholder="عنوان آزمون"
              />
              <button class="btn btn-danger small" @click="removeExam(eIdx)">حذف آزمون</button>
            </div>
            <h4 class="exam-subtitle">سؤالات:</h4>
            <ul class="questions-list">
              <li v-for="(q, qIdx) in exam.questions" :key="qIdx" class="question-item">
                <input
                    type="text"
                    v-model="q.question"
                    class="question-input"
                    placeholder="متن سؤال"
                />
                <ul class="options-list">
                  <li v-for="(opt, oIdx) in q.options" :key="oIdx" class="option-item">
                    <input
                        type="text"
                        v-model="q.options[oIdx]"
                        class="option-input"
                        placeholder="متن گزینه"
                    />
                    <label>
                      <input
                          type="radio"
                          :name="'correct-' + exam.id + '-' + qIdx"
                          :value="oIdx"
                          v-model="q.correct"
                      />
                      صحیح
                    </label>
                  </li>
                </ul>
                <button class="btn btn-outline small" @click="addOption(exam.id, qIdx)">
                  افزودن گزینه
                </button>
                <button class="btn btn-danger small" @click="removeQuestion(exam.id, qIdx)">
                  حذف سؤال
                </button>
              </li>
            </ul>
            <button class="btn btn-outline small" @click="addQuestion(exam.id)">
              افزودن سؤال جدید
            </button>
          </li>
        </ul>
      </section>

      <!-- ===== بخش اتصالات سیستم ===== -->
      <section v-else-if="activeSection === 'integrations'" class="panel integrations-panel">
        <h3 class="panel-title">اتصالات سیستم</h3>
        <p>در این بخش می‌توانید سرویس‌های جانبی را به سیستم متصل کنید (نمایش صرفاً بصری).</p>
        <div class="integration-item">
          <span class="integration-icon">🔗</span>
          <span class="integration-label">اتصال به LMS شرکت</span>
          <button class="btn btn-outline small">پیکربندی</button>
        </div>
        <div class="integration-item">
          <span class="integration-icon">📊</span>
          <span class="integration-label">گزارش‌گیری BI</span>
          <button class="btn btn-outline small">پیکربندی</button>
        </div>
        <div class="integration-item">
          <span class="integration-icon">🔔</span>
          <span class="integration-label">اعلان‌های ایمیلی</span>
          <button class="btn btn-outline small">پیکربندی</button>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";

// اطلاعات ادمین
const admin = reactive({
  name: "مدیر سیستم",
  email: "admin@cooking.com",
});

// وضعیت فعلی بخش‌های مختلف
const stats = reactive({
  activeUsers: 20,
  levels: 10,
  contents: 24,
  exams: 12,
});

// داده‌های وضعیت سیستم برای نمایش نوار پیشرفت
const systemStatus = reactive([
  {
    label: "پیشرفت کلی کاربران",
    percentage: 68,
    get percentageStyle() {
      return { width: this.percentage + "%" };
    },
  },
  {
    label: "تکمیل محتوا",
    percentage: 82,
    get percentageStyle() {
      return { width: this.percentage + "%" };
    },
  },
  {
    label: "میانگین نمرات آزمون",
    percentage: 75,
    get percentageStyle() {
      return { width: this.percentage + "%" };
    },
  },
  {
    label: "اتصالات سیستم",
    valueLabel: "3/5",
    get percentageStyle() {
      // 3 از 5 معادل 60%
      return { width: (3 / 5) * 100 + "%" };
    },
  },
]);

// فعالیت‌های اخیر کاربران
const recentActivities = reactive([
  {
    initial: "س",
    name: "سارا محمدی",
    action: "سطح «آشپزی ایتالیایی پیشرفته» را به اتمام رساند.",
    time: "2 ساعت پیش",
    color: "#4caf50",
  },
  {
    initial: "ع",
    name: "علی رضایی",
    action: "در آزمون «اصول پخت و پز» نمره 95 از 100 کسب کرد.",
    time: "5 ساعت پیش",
    color: "#2196f3",
  },
  {
    initial: "م",
    name: "مریم کریمی",
    action: "دوره «دسرهای فرانسوی» را شروع کرد.",
    time: "دیروز",
    color: "#9c27b0",
  },
  {
    initial: "ح",
    name: "حسین اکبری",
    action: "محتوای «تکنیک‌های برش سبزیجات» را مطالعه کرد.",
    time: "دیروز",
    color: "#ff9800",
  },
]);

const activeSection = ref("dashboard");

/* =============== ۱. مدیریت سطوح آموزشی =============== */
// داده‌های سطوح آموزشی با ۱۰ مقدار ثابت
const levelsData = reactive([
  { id: 1, title: "مقدماتی" },
  { id: 2, title: "مهارت چاقو" },
  { id: 3, title: "حرارت و زمان" },
  { id: 4, title: "طعم‌ها" },
  { id: 5, title: "تکنیک‌ها" },
  { id: 6, title: "آشپزی ایرانی" },
  { id: 7, title: "پیشرفته" },
  { id: 8, title: "شیرینی‌پزی" },
  { id: 9, title: "دسرها" },
  { id: 10, title: "سرآشپز" },
]);

// افزودن سطح جدید (اما در خواست اینجا ثابت نگه داشته می‌شود، اضافه نمی‌کنیم)
// اگر نیاز باشد، می‌توان مشابه داینامیک اضافه کرد:
function addLevel() {
  const newId = levelsData.length ? levelsData[levelsData.length - 1].id + 1 : 1;
  levelsData.push({ id: newId, title: "" });
}

// حذف سطح
function removeLevel(index) {
  levelsData.splice(index, 1);
}

// جابجایی سطح به بالا
function moveLevelUp(index) {
  if (index === 0) return;
  const temp = levelsData[index - 1];
  levelsData[index - 1] = levelsData[index];
  levelsData[index] = temp;
}

// جابجایی سطح به پایین
function moveLevelDown(index) {
  if (index === levelsData.length - 1) return;
  const temp = levelsData[index + 1];
  levelsData[index + 1] = levelsData[index];
  levelsData[index] = temp;
}

/* =============== ۲. مدیریت کاربران و تغییر دسترسی =============== */
// داده‌های نمونه کاربران با نقش‌های مورد نیاز
const usersData = reactive([
  { id: 1, name: "سارا محمدی", email: "sara@example.com", role: "user" },
  { id: 2, name: "علی رضایی", email: "ali@example.com", role: "manager" },
  { id: 3, name: "مریم کریمی", email: "maryam@example.com", role: "user" },
  { id: 4, name: "حسین اکبری", email: "hossein@example.com", role: "banned" },
]);

// به‌روزرسانی نقش/دسترسی کاربر
function updateUserRole(userId, newRole) {
  const user = usersData.find((u) => u.id === userId);
  if (user) {
    user.role = newRole;
    // در اینجا می‌توانید API کال جهت ذخیره تغییرات به سرور را اضافه کنید
  }
}

// حذف کاربر
function removeUser(index) {
  usersData.splice(index, 1);
}

/* =============== ۳. مدیریت محتوای آموزشی =============== */
// داده‌های نمونه محتوای آموزشی
const contentData = reactive([
  { id: 1, title: "مبانی آشپزی", text: "متن آموزشی درباره مبانی آشپزی..." },
  { id: 2, title: "ایمنی در آشپزخانه", text: "متن آموزشی درباره نکات ایمنی..." },
]);

// افزودن محتوا
function addContent() {
  const newId = contentData.length ? contentData[contentData.length - 1].id + 1 : 1;
  contentData.push({ id: newId, title: "", text: "" });
}

// حذف محتوا
function removeContent(index) {
  contentData.splice(index, 1);
}

/* =============== ۴. مدیریت آزمون‌ها و سوالات =============== */
// داده‌های نمونه آزمون‌ها
const examsData = reactive([
  {
    id: 1,
    title: "آزمون مقدماتی",
    questions: [
      {
        question: "کدام ابزار برای خرد کردن مناسب است؟",
        options: ["کارد", "مخلوط‌کن", "ظرف شستشو", "تخته گوشت"],
        correct: 0,
      },
      {
        question: "اولین گام ایمنی در آشپزخانه چیست؟",
        options: ["شستن دست‌ها", "روشن کردن گاز", "پوشیدن دستکش", "خنک‌کردن غذا"],
        correct: 0,
      },
    ],
  },
  {
    id: 2,
    title: "آزمون مهارت چاقو",
    questions: [
      {
        question: "برای ایمنی انگشتان باید چه کار کرد؟",
        options: ["چنگال محافظ", "انگشت صاف", "انگشتان جمع", "دستکش"],
        correct: 0,
      },
    ],
  },
]);

// افزودن آزمون جدید
function addExam() {
  const newId = examsData.length ? examsData[examsData.length - 1].id + 1 : 1;
  examsData.push({
    id: newId,
    title: "",
    questions: [],
  });
}

// حذف آزمون
function removeExam(index) {
  examsData.splice(index, 1);
}

// افزودن سؤال به یک آزمون
function addQuestion(examId) {
  const exam = examsData.find((e) => e.id === examId);
  if (exam) {
    exam.questions.push({
      question: "",
      options: [],
      correct: 0,
    });
  }
}

// حذف سؤال از یک آزمون
function removeQuestion(examId, questionIndex) {
  const exam = examsData.find((e) => e.id === examId);
  if (exam) {
    exam.questions.splice(questionIndex, 1);
  }
}

// افزودن گزینه به یک سؤال خاص
function addOption(examId, questionIndex) {
  const exam = examsData.find((e) => e.id === examId);
  if (exam) {
    const q = exam.questions[questionIndex];
    q.options.push("");
  }
}
</script>

<style scoped>
.dashboard-container {
  display: flex;
  direction: rtl;
  font-family: sans-serif;
  background-color: #f5f5f5;
  min-height: 100vh;
}

/* ===== Sidebar ===== */
.sidebar {
  width: 260px;
  background-color: #2e7d32;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px 16px;
}
.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}
.sidebar-title {
  font-size: 18px;
  margin: 0;
}
.sidebar-icons {
  display: flex;
  gap: 8px;
}
.icon-btn {
  background: none;
  border: none;
  color: #ffffff;
  cursor: pointer;
  font-size: 18px;
}
.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.nav-list li {
  display: flex;
  align-items: center;
  padding: 10px 12px;
  cursor: pointer;
  font-size: 14px;
  border-radius: 6px;
  margin-bottom: 8px;
  transition: background-color 0.2s;
}
.nav-list li:hover,
.nav-list li.active {
  background-color: rgba(255, 255, 255, 0.1);
}
.nav-icon {
  margin-left: 10px;
  font-size: 18px;
}
.sidebar-footer {
  margin-top: 24px;
}
.admin-info {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}
.avatar {
  font-size: 40px;
  margin-left: 10px;
}
.admin-text {
  line-height: 1.2;
}
.admin-name {
  font-size: 16px;
  margin: 0;
}
.admin-email {
  font-size: 12px;
  color: #c8e6c9;
  margin: 0;
}
.btn-logout {
  width: 100%;
  background-color: #ffffff;
  color: #2e7d32;
  border: none;
  padding: 10px 0;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}
.btn-logout:hover {
  background-color: #e0e0e0;
}

/* ===== Main Content ===== */
.main-content {
  flex: 1;
  padding: 20px;
}

/* ===== بخش داشبورد اولیه ===== */
/* کارت‌های متریک بالا */
.metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}
.metric-card {
  background-color: #ffffff;
  border-radius: 8px;
  display: flex;
  align-items: center;
  padding: 16px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}
.metric-icon {
  font-size: 32px;
  margin-left: 12px;
}
.metric-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.metric-number {
  font-size: 20px;
  margin: 0;
  color: #333333;
}
.metric-label {
  font-size: 12px;
  color: #555555;
  margin: 0;
}

/* بخش پایین کارت سفید */
.bottom-panels-wrapper {
  margin-top: 24px;
}
.card-panel {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

/* قسمت‌های داخل کارت */
.system-status .panel-title,
.recent-activity .panel-title {
  font-size: 18px;
  margin: 0 0 12px 0;
  color: #333333;
}
.status-item {
  margin-bottom: 16px;
}
.status-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.status-text {
  font-size: 14px;
  color: #333333;
}
.status-value-label {
  font-size: 12px;
  color: #777777;
}
.progress-bar {
  width: 100%;
  height: 8px;
  background-color: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
  margin: 6px 0;
}
.progress-fill {
  height: 100%;
  background-color: #4caf50;
  transition: width 0.3s ease;
}
.status-percentage {
  font-size: 12px;
  color: #555555;
}

/* پنل فعالیت اخیر کاربران */
.activity-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.activity-list li {
  display: flex;
  align-items: flex-start;
  margin-bottom: 16px;
}
.activity-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  color: #ffffff;
  font-size: 16px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 12px;
}
.activity-text {
  flex: 1;
}
.activity-text p {
  margin: 0 0 4px 0;
  font-size: 14px;
  color: #333333;
}
.activity-time {
  font-size: 12px;
  color: #777777;
}

/* ===== بخش مدیریت سطوح آموزشی ===== */
.levels-panel {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 20px;
}
.levels-panel .panel-title {
  font-size: 18px;
  margin-bottom: 16px;
  color: #333333;
}
.levels-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.level-item {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}
.level-order {
  display: flex;
  flex-direction: column;
}
.level-input {
  flex: 1;
  margin: 0 12px;
  padding: 6px 8px;
  font-size: 14px;
  border: 1px solid #cccccc;
  border-radius: 4px;
}
.small {
  padding: 4px 8px;
  font-size: 12px;
  margin-left: 6px;
}

/* ===== بخش مدیریت کاربران ===== */
.users-panel {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 20px;
  color: #1f2023;
}
.users-panel .panel-title {
  font-size: 18px;
  margin-bottom: 16px;
  color: #333333;
}
.users-table {
  width: 100%;
  border-collapse: collapse;
}
.users-table th,
.users-table td {
  padding: 10px 8px;
  text-align: center;
  font-size: 14px;
  border-bottom: 1px solid #e0e0e0;
}
.users-table select {
  padding: 4px 6px;
  font-size: 14px;
}

/* ===== بخش مدیریت محتوای آموزشی ===== */
.content-panel {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 20px;
}
.content-panel .panel-title {
  font-size: 18px;
  margin-bottom: 16px;
  color: #333333;
}
.content-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.content-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 12px;
}
.content-input {
  flex: 1;
  margin-right: 12px;
  padding: 6px 8px;
  font-size: 14px;
  border: 1px solid #cccccc;
  border-radius: 4px;
}
.content-textarea {
  flex: 2;
  margin-right: 12px;
  padding: 6px 8px;
  font-size: 14px;
  border: 1px solid #cccccc;
  border-radius: 4px;
  resize: vertical;
}

/* ===== بخش مدیریت آزمون‌ها ===== */
.exams-panel {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 20px;
}
.exams-panel .panel-title {
  font-size: 18px;
  margin-bottom: 16px;
  color: #333333;
}
.exams-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.exam-item {
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  padding: 12px;
  margin-bottom: 16px;
  background-color: #fafafa;
}
.exam-header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}
.exam-input {
  flex: 1;
  margin-right: 12px;
  padding: 6px 8px;
  font-size: 14px;
  border: 1px solid #cccccc;
  border-radius: 4px;
}
.exam-subtitle {
  font-size: 16px;
  margin-bottom: 8px;
  color: #333333;
}
.questions-list {
  list-style: none;
  padding: 0;
  margin: 0 0 8px 0;
}
.question-item {
  margin-bottom: 12px;
  padding: 8px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  background-color: #ffffff;
}
.question-input {
  width: 100%;
  margin-bottom: 8px;
  padding: 6px 8px;
  font-size: 14px;
  border: 1px solid #cccccc;
  border-radius: 4px;
}
.options-list {
  list-style: none;
  padding: 0;
  margin: 0 0 8px 0;
}
.option-item {
  display: flex;
  align-items: center;
  margin-bottom: 6px;
}
.option-input {
  flex: 1;
  padding: 4px 6px;
  font-size: 14px;
  border: 1px solid #cccccc;
  border-radius: 4px;
  margin-right: 8px;
}

/* ===== بخش اتصالات سیستم ===== */
.integrations-panel {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 20px;
}
.integrations-panel .panel-title {
  font-size: 18px;
  margin-bottom: 16px;
  color: #333333;
}
.integration-item {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}
.integration-icon {
  font-size: 24px;
  margin-left: 12px;
}
.integration-label {
  flex: 1;
  font-size: 14px;
  color: #333333;
}
</style>
