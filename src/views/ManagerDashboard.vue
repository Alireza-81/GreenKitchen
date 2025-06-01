<template>
  <div class="dashboard-container">
    <!-- Sidebar: مشخصات مدیر، منو ناوبری و آمار جانبی -->
    <aside class="sidebar">
      <!-- کارت مشخصات مدیر -->
      <div class="profile-card">
        <div class="avatar">👨‍🏫</div>
        <h3 class="user-name">{{ manager.name }}</h3>
        <p class="user-subtitle">{{ manager.title }}</p>
        <!-- آمار دوره‌ها و کارمندان فعال -->
        <div class="stats">
          <div class="stat-box">
            <div class="stat-number">{{ manager.activeCourses }}</div>
            <div class="stat-label">دوره‌های فعال</div>
          </div>
          <div class="stat-box">
            <div class="stat-number">{{ manager.activeEmployees }}</div>
            <div class="stat-label">کارمندان فعال</div>
          </div>
        </div>
      </div>

      <!-- فهرست ناوبری -->
      <ul class="nav-list">
        <li @click="currentView = 'dashboard'">
          <span class="nav-icon">🏠</span>
          <span>داشبورد</span>
        </li>
        <li @click="currentView = 'employees'">
          <span class="nav-icon">👥</span>
          <span>کارمندان</span>
        </li>
        <li @click="currentView = 'goals'">
          <span class="nav-icon">🎯</span>
          <span>اهداف آموزشی</span>
        </li>
        <li @click="currentView = 'certificates'">
          <span class="nav-icon">🛡️</span>
          <span>گواهینامه‌ها</span>
        </li>
        <li @click="openRecommendationModal">
          <span class="nav-icon">💡</span>
          <span>توصیه‌های آموزشی</span>
        </li>
        <!-- تنظیمات حذف شد -->
      </ul>

      <!-- اعلان‌های مهم -->
      <div class="widget alerts-widget" v-if="currentView === 'dashboard' || currentView === 'analysis'">
        <h4 class="widget-title">اعلان‌های مهم</h4>
        <div
            v-for="(alert, idx) in importantAlerts"
            :key="idx"
            class="alert-card"
            :class="{
              'alert-warning': alert.type === 'warning',
              'alert-success': alert.type === 'success',
              'alert-danger': alert.type === 'danger'
            }"
        >
          <span class="alert-icon" v-html="alert.icon"></span>
          <div class="alert-content">
            <p class="alert-text">{{ alert.text }}</p>
            <p class="alert-subtext">{{ alert.subtext }}</p>
          </div>
        </div>
      </div>

      <!-- آمار کلی تیم -->
      <div class="widget team-stats-widget" v-if="currentView === 'dashboard' || currentView === 'analysis'">
        <h4 class="widget-title">آمار کلی</h4>
        <div class="stat-item">
          <span>میانگین پیشرفت تیم</span>
          <div class="progress-bar">
            <div
                class="progress-fill"
                :style="{ width: teamStats.avgProgress + '%' }"
            ></div>
          </div>
          <span class="stat-value">{{ teamStats.avgProgress }}%</span>
        </div>
        <div class="stat-item">
          <span>دوره‌های تکمیل شده</span>
          <div class="progress-bar">
            <div
                class="progress-fill"
                :style="{ width: teamStats.completedCoursesPercent + '%' }"
            ></div>
          </div>
          <span class="stat-value">{{ teamStats.completedCourses }}/{{ teamStats.totalCourses }}</span>
        </div>
        <div class="stat-item">
          <span>گواهینامه‌های صادر شده</span>
          <div class="progress-bar">
            <div
                class="progress-fill"
                :style="{ width: teamStats.issuedCertificatesPercent + '%' }"
            ></div>
          </div>
          <span class="stat-value">{{ teamStats.issuedCertificates }}</span>
        </div>
        <div class="stat-item">
          <span>اهداف تکمیل شده</span>
          <div class="progress-bar">
            <div
                class="progress-fill"
                :style="{ width: teamStats.achievedGoalsPercent + '%' }"
            ></div>
          </div>
          <span class="stat-value">{{ teamStats.achievedGoals }}/{{ teamStats.totalGoals }}</span>
        </div>
      </div>
    </aside>

    <!-- محتوای اصلی داشبورد مدیریت -->
    <main class="main-content">

      <!-- داشبورد اصلی -->
      <div v-if="currentView === 'dashboard'">
        <!-- نوار بالایی: عنوان سایت و اطلاعیه‌ها -->
        <header class="topbar">
          <div class="brand">آشپزخانه سبز - پنل مدیریت</div>
          <div class="topbar-user">
            <span class="user-name">{{ manager.name }}</span>
            <div class="topbar-avatar">👨‍🏫</div>
            <div class="notification-badge">{{ notificationsCount }}</div>
          </div>
        </header>

        <!-- بنر خوش‌آمدگویی برای مدیر -->
        <div class="banner">
          <div class="banner-icon">📊</div>
          <div class="banner-content">
            <h2>خوش آمدید، {{ manager.name }}!</h2>
            <p>خلاصه وضعیت تیم شما در یک نگاه.</p>
          </div>
        </div>

        <!-- فیلتر ماه -->
        <div class="filter-bar">
          <button class="btn btn-outline">
            <span class="download-icon">⬇️</span>
          </button>
          <select v-model="selectedMonth" class="month-select">
            <option v-for="m in monthOptions" :key="m" :value="m">{{ m }}</option>
          </select>
        </div>

        <!-- عملکرد کلی تیم (به‌روز شده بر اساس month) -->
        <section class="team-performance">
          <h3 class="section-title">عملکرد کلی تیم</h3>
          <div class="cards-grid">
            <div class="perf-card perf-success">
              <div class="card-icon">📈</div>
              <h4 class="card-number">{{ currentOverview.avgProgress }}%</h4>
              <p class="card-text">
                میانگین پیشرفت <br />
                <span class="card-sub">
                  ↑ {{ currentOverview.avgChange }}% نسبت به مقدار قبلی
                </span>
              </p>
            </div>
            <div class="perf-card perf-info">
              <div class="card-icon">📚</div>
              <h4 class="card-number">
                {{ currentOverview.completedCourses }}/{{ currentOverview.totalCourses }}
              </h4>
              <p class="card-text">
                دوره‌های تکمیل شده <br />
                <span class="card-sub">
                  {{ currentOverview.coursesThisMonth }} دوره در ماه جاری
                </span>
              </p>
            </div>
            <div class="perf-card perf-primary">
              <div class="card-icon">✅</div>
              <h4 class="card-number">{{ currentOverview.successfulTestsPercent }}%</h4>
              <p class="card-text">
                آزمون‌های موفق <br />
                <span class="card-sub">
                  ↑ {{ currentOverview.testsChange }}% نسبت به مقدار قبلی
                </span>
              </p>
            </div>
            <div class="perf-card perf-warning">
              <div class="card-icon">🎯</div>
              <h4 class="card-number">
                {{ currentOverview.achievedGoals }}/{{ currentOverview.totalGoals }}
              </h4>
              <p class="card-text">
                اهداف تکمیل شده <br />
                <span class="card-sub">
                  {{ currentOverview.newGoals }} هدف جدید تکمیل شده
                </span>
              </p>
            </div>
          </div>
        </section>

        <!-- نمودار روند پیشرفت تیم -->
        <section class="team-trend">
          <h3 class="section-title">روند پیشرفت تیم</h3>
          <div class="chart-container">
            <canvas ref="teamTrendChart"></canvas>
          </div>
        </section>

        <!-- جدول کارمندان برتر -->
        <section class="top-employees-section">
          <h3 class="section-title">کارمندان برتر</h3>
          <div class="table-container">
            <table class="employees-table">
              <thead>
              <tr>
                <th>کارمند</th>
                <th>پیشرفت</th>
                <th>دوره‌های تکمیل شده</th>
                <th>مهارت برتر</th>
                <th>نقاط ضعف</th>
                <th>عملیات</th>
              </tr>
              </thead>
              <tbody>
              <tr
                  v-for="(emp, idx) in displayedEmployees"
                  :key="idx"
              >
                <td class="emp-info">
                  <img :src="emp.avatar" alt="avatar" class="emp-avatar" />
                  <div>
                    <p
                        class="emp-name clickable-name"
                        @click="openDetailModal(emp)"
                    >
                      {{ emp.name }}
                    </p>
                    <p class="emp-role">{{ emp.role }}</p>
                  </div>
                </td>
                <td>
                  <div class="progress-wrapper">
                    <div class="progress-bar small">
                      <div
                          class="progress-fill"
                          :style="{ width: emp.progress + '%' }"
                      ></div>
                    </div>
                    <span class="progress-text">{{ emp.progress }}%</span>
                  </div>
                </td>
                <td>{{ emp.completedCourses }}/{{ emp.totalCourses }}</td>
                <td>
                  <span class="skill-tag">{{ emp.topSkill }}</span>
                </td>
                <td>
                  <span class="weakness-text">{{ emp.weaknesses }}</span>
                </td>
                <td class="actions-cell">
                  <button class="link-btn" @click="openMessageModal(emp)">
                    پیام
                  </button>
                  <button class="link-btn" @click="openCertificateModal(emp)">
                    گواهینامه
                  </button>
                </td>
              </tr>
              </tbody>
            </table>
          </div>

          <div class="show-all-container">
            <button class="btn btn-primary" @click="toggleShowAll">
              {{ showAll ? "نمایش کمتر" : "مشاهده همه کارکنان" }}
            </button>
          </div>
        </section>
      </div>

      <!-- بخش کارمندان: نمایش فهرست کامل -->
      <div v-if="currentView === 'employees'">
        <header class="topbar">
          <div class="brand">لیست کامل کارمندان</div>
        </header>
        <section class="top-employees-section">
          <h3 class="section-title">تمامی کارمندان</h3>
          <div class="table-container">
            <table class="employees-table">
              <thead>
              <tr>
                <th>نام</th>
                <th>نقش</th>
                <th>پیشرفت</th>
                <th>دوره‌های تکمیل شده</th>
                <th>مهارت برتر</th>
                <th>نقاط ضعف</th>
              </tr>
              </thead>
              <tbody>
              <tr
                  v-for="(emp, idx) in allEmployees"
                  :key="idx"
              >
                <td class="emp-name clickable-name" @click="openDetailModal(emp)">
                  {{ emp.name }}
                </td>
                <td>{{ emp.role }}</td>
                <td>
                  <div class="progress-wrapper">
                    <div class="progress-bar small">
                      <div
                          class="progress-fill"
                          :style="{ width: emp.progress + '%' }"
                      ></div>
                    </div>
                    <span class="progress-text">{{ emp.progress }}%</span>
                  </div>
                </td>
                <td>{{ emp.completedCourses }}/{{ emp.totalCourses }}</td>
                <td><span class="skill-tag">{{ emp.topSkill }}</span></td>
                <td><span class="weakness-text">{{ emp.weaknesses }}</span></td>
              </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <!-- بخش اهداف آموزشی -->
      <div v-if="currentView === 'goals'">
        <header class="topbar">
          <div class="brand">تنظیم اهداف آموزشی</div>
        </header>
        <section class="top-employees-section" style="margin-top:16px;">
          <h3 class="section-title">انتخاب هدف برای هر کارمند</h3>
          <div class="table-container">
            <table class="employees-table">
              <thead>
              <tr>
                <th>نام</th>
                <th>نقش</th>
                <th>هدف آموزشی</th>
                <th>مهلت انجام</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(emp, idx) in allEmployees" :key="idx">
                <td>{{ emp.name }}</td>
                <td>{{ emp.role }}</td>
                <td>
                  <select v-model="emp.goal" class="month-select">
                    <option disabled value="">انتخاب کنید</option>
                    <option value="تسلط بر مهارت چاقو">تسلط بر مهارت چاقو</option>
                    <option value="تسلط بر حرارت و زمان">تسلط بر حرارت و زمان</option>
                    <option value="تسلط بر طعم‌ها">تسلط بر طعم‌ها</option>
                    <option value="تسلط بر تکنیک‌ها">تسلط بر تکنیک‌ها</option>
                    <option value="آشپزی ایرانی">آشپزی ایرانی</option>
                    <option value="تسلط بر مهارت‌های پیشرفته">تسلط بر مهارت‌های پیشرفته</option>
                    <option value="تسلط بر شیرینی‌پزی">تسلط بر شیرینی‌پزی</option>
                    <option value="تسلط بر دسرها">تسلط بر دسرها</option>
                  </select>
                </td>
                <td>
                  <input
                      type="date"
                      v-model="emp.deadline"
                      class="month-select"
                  />
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <!-- بخش گواهینامه‌ها -->
      <div v-if="currentView === 'certificates'">
        <header class="topbar">
          <div class="brand">لیست کاربران دارای گواهینامه</div>
        </header>
        <section class="top-employees-section" style="margin-top:16px;">
          <h3 class="section-title">کاربرانی که گواهینامه دریافت کرده‌اند</h3>
          <div class="table-container">
            <table class="employees-table">
              <thead>
              <tr>
                <th>نام</th>
                <th>نقش</th>
                <th>تاریخ دریافت</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(emp, idx) in allEmployees.filter(e => e.certificateSigned)" :key="idx">
                <td>{{ emp.name }}</td>
                <td>{{ emp.role }}</td>
                <td>امروز</td>
              </tr>
              <tr v-if="allEmployees.filter(e => e.certificateSigned).length === 0">
                <td colspan="3">فعلاً هیچ کاربری گواهینامه ندارد.</td>
              </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>

    </main>

    <!-- ====== مودال ارسال پیام ====== -->
    <div
        v-if="showMessageModal"
        class="modal-overlay"
        @click.self="closeMessageModal"
    >
      <div class="modal-content">
        <h3>ارسال پیام به {{ currentEmployee.name }}</h3>
        <textarea
            v-model="messageText"
            placeholder="پیام خود را اینجا بنویسید..."
            rows="5"
        ></textarea>
        <div class="modal-buttons">
          <button class="btn btn-primary" @click="sendMessage">
            ارسال
          </button>
          <button class="btn btn-outline" @click="closeMessageModal">
            انصراف
          </button>
        </div>
      </div>
    </div>

    <!-- ====== مودال امضای گواهینامه ====== -->
    <div
        v-if="showCertificateModal"
        class="modal-overlay"
        @click.self="closeCertificateModal"
    >
      <div class="modal-content">
        <template v-if="!currentEmployee.eligibleForCertificate">
          <h3>هشدار</h3>
          <h3>متأسفانه {{ currentEmployee.name }} واجد شرایط دریافت گواهینامه نیست.</h3>
          <button class="btn btn-primary" @click="closeCertificateModal">
            بستن
          </button>
        </template>

        <template v-else>
          <h3>تأیید امضای گواهینامه</h3>
          <p>آیا مطمئن هستید که می‌خواهید برای <strong>{{ currentEmployee.name }}</strong> گواهینامه امضا کنید؟</p>
          <div class="modal-buttons">
            <button class="btn btn-primary" @click="confirmCertificate">
              بله، امضا کن
            </button>
            <button class="btn btn-outline" @click="closeCertificateModal">
              لغو
            </button>
          </div>
        </template>
      </div>
    </div>

    <!-- ====== مودال جزئیات پیشرفت کاربر ====== -->
    <div
        v-if="showDetailModal"
        class="modal-overlay"
        @click.self="closeDetailModal"
    >
      <div class="modal-content detail-modal-content">
        <h3>گزارش پیشرفت: {{ detailEmployee.name }}</h3>
        <ul class="detail-list">
          <li><strong>نقش:</strong> {{ detailEmployee.role }}</li>
          <li>
            <strong>درصد پیشرفت:</strong>
            {{ detailEmployee.progress }}%
            <div class="progress-bar small detail-progress-bar">
              <div
                  class="progress-fill"
                  :style="{ width: detailEmployee.progress + '%' }"
              ></div>
            </div>
          </li>
          <li>
            <strong>دوره‌های تکمیل شده:</strong>
            {{ detailEmployee.completedCourses }}/{{ detailEmployee.totalCourses }}
          </li>
          <li>
            <strong>مهارت برتر:</strong>
            {{ detailEmployee.topSkill }}
          </li>
          <li>
            <strong>نقاط ضعف:</strong>
            {{ detailEmployee.weaknesses }}
          </li>
          <li>
            <strong>گواهینامه:</strong>
            <span v-if="detailEmployee.certificateSigned">صدور شده ✔️</span>
            <span v-else>در انتظار امضا ❌</span>
          </li>
        </ul>
        <button class="btn btn-primary" @click="closeDetailModal">
          بستن
        </button>
      </div>
    </div>

    <!-- ====== مودال توصیه‌های آموزشی ====== -->
    <div
        v-if="showRecommendationModal"
        class="modal-overlay"
        @click.self="closeRecommendationModal"
    >
      <div class="modal-content">
        <h3>توصیه آموزشی برای کل تیم</h3>
        <textarea
            v-model="recommendationText"
            placeholder="پیام خود را اینجا بنویسید..."
            rows="5"
        ></textarea>
        <div class="modal-buttons">
          <button class="btn btn-primary" @click="sendRecommendation">
            ارسال
          </button>
          <button class="btn btn-outline" @click="closeRecommendationModal">
            انصراف
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, nextTick } from "vue";
import { Chart, registerables } from "chart.js";

// ====== راه‌اندازی Chart.js برای نمودار ======
Chart.register(...registerables);

// ====== داده‌های اولیه ======
const notificationsCount = ref(3);
const manager = reactive({
  name: "حسین مدبری",
  title: "مدیر آموزش",
  activeCourses: 8,
  activeEmployees: 5,
});

const importantAlerts = [
  {
    type: "warning",
    icon: "⏰",
    text: "مهلت هدف «تسلط بر تکنیک‌های پخت و پز ایرانی» نزدیک است",
    subtext: "۳ روز باقی مانده",
  },
  {
    type: "success",
    icon: "✅",
    text: "الهه حبیبی دوره «آشپزی ایرانی» را تکمیل کرد",
    subtext: "گواهینامه آماده صدور است",
  },
  {
    type: "danger",
    icon: "⚠️",
    text: "محمد کریمی در آزمون نهایی سطح ۵ ناموفق بود",
    subtext: "نیاز به بررسی و پیگیری",
  },
];

const months = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
];
const monthOptions = [...months, "هفته گذشته"];
const selectedMonth = ref("فروردین");

// ====== آمار کلی تیم (ثابت برای نوار جانبی) ======
const teamStats = reactive({
  avgProgress: 72,
  completedCourses: 12,
  totalCourses: 20,
  issuedCertificates: 8,
  totalGoals: 8,
  achievedGoals: 5,
});
teamStats.completedCoursesPercent = computed(() => {
  return ((teamStats.completedCourses / teamStats.totalCourses) * 100).toFixed(0);
});
teamStats.issuedCertificatesPercent = computed(() => {
  return ((teamStats.issuedCertificates / 20) * 100).toFixed(0);
});
teamStats.achievedGoalsPercent = computed(() => {
  return ((teamStats.achievedGoals / teamStats.totalGoals) * 100).toFixed(0);
});

// ====== لیست همهٔ کارمندان (۱۰ نفر) ======
const allEmployees = reactive([
  {
    name: "الهه حبیبی",
    role: "سرآشپز دستیار",
    avatar: "https://i.pravatar.cc/40?img=47",
    progress: 92,
    completedCourses: 8,
    totalCourses: 10,
    topSkill: "آشپزی ایرانی",
    weaknesses: "مدیریت زمان ضعیف",
    eligibleForCertificate: true,   // چون progress >= 80
    certificateSigned: false,
    goal: "",
    deadline: "",
  },
  {
    name: "علی محمدی",
    role: "آشپز",
    avatar: "https://i.pravatar.cc/40?img=12",
    progress: 85,
    completedCourses: 7,
    totalCourses: 10,
    topSkill: "تکنیک‌های چاقو",
    weaknesses: "دقت در تزئین غذا",
    eligibleForCertificate: true,
    certificateSigned: false,
    goal: "",
    deadline: "",
  },
  {
    name: "سارا رضایی",
    role: "آشپز دستیار",
    avatar: "https://i.pravatar.cc/40?img=5",
    progress: 78,
    completedCourses: 6,
    totalCourses: 10,
    topSkill: "شیرینی‌پزی",
    weaknesses: "مدیریت پرسش‌های همکاران",
    eligibleForCertificate: false,
    certificateSigned: false,
    goal: "",
    deadline: "",
  },
  {
    name: "مهدی شریفی",
    role: "آشپز",
    avatar: "https://i.pravatar.cc/40?img=15",
    progress: 74,
    completedCourses: 5,
    totalCourses: 10,
    topSkill: "گریل کردن گوشت",
    weaknesses: "ضعف در تهیه پیش‌غذا",
    eligibleForCertificate: false,
    certificateSigned: false,
    goal: "",
    deadline: "",
  },
  {
    name: "لیلا کریمی",
    role: "آشپز",
    avatar: "https://i.pravatar.cc/40?img=22",
    progress: 69,
    completedCourses: 5,
    totalCourses: 10,
    topSkill: "غذای دریایی",
    weaknesses: "هماهنگی در سرویس‌دهی",
    eligibleForCertificate: false,
    certificateSigned: false,
    goal: "",
    deadline: "",
  },
  {
    name: "امیرحسین رضایی",
    role: "سرآشپز",
    avatar: "https://i.pravatar.cc/40?img=33",
    progress: 82,
    completedCourses: 7,
    totalCourses: 10,
    topSkill: "برنامه‌ریزی منو",
    weaknesses: "جداسازی طعم‌ها",
    eligibleForCertificate: true,
    certificateSigned: false,
    goal: "",
    deadline: "",
  },
  {
    name: "مهسا احمدی",
    role: "کمک‌آشپز",
    avatar: "https://i.pravatar.cc/40?img=28",
    progress: 64,
    completedCourses: 4,
    totalCourses: 10,
    topSkill: "آشپزی سنتی",
    weaknesses: "سرعت انجام سفارشات",
    eligibleForCertificate: false,
    certificateSigned: false,
    goal: "",
    deadline: "",
  },
  {
    name: "حسن پورمهر",
    role: "آشپز",
    avatar: "https://i.pravatar.cc/40?img=9",
    progress: 70,
    completedCourses: 5,
    totalCourses: 10,
    topSkill: "پخت غذای گیاهی",
    weaknesses: "چیدمان ظروف",
    eligibleForCertificate: false,
    certificateSigned: false,
    goal: "",
    deadline: "",
  },
  {
    name: "فاطمه مهدوی",
    role: "آشپز دستیار",
    avatar: "https://i.pravatar.cc/40?img=41",
    progress: 76,
    completedCourses: 6,
    totalCourses: 10,
    topSkill: "استیک پزی",
    weaknesses: "هماهنگی با سرویس‌دهی",
    eligibleForCertificate: false,
    certificateSigned: false,
    goal: "",
    deadline: "",
  },
  {
    name: "سعید نادری",
    role: "کمک‌سرآشپز",
    avatar: "https://i.pravatar.cc/40?img=18",
    progress: 68,
    completedCourses: 5,
    totalCourses: 10,
    topSkill: "پخت نان سنتی",
    weaknesses: "حفظ دمای مناسب فر",
    eligibleForCertificate: false,
    certificateSigned: false,
    goal: "",
    deadline: "",
  },
]);

// ===== متغیر برای کنترل نمایش ۳ یا ۱۰ کارمند =====
const showAll = ref(false);
const displayedEmployees = computed(() => {
  return showAll.value ? allEmployees : allEmployees.slice(0, 3);
});
function toggleShowAll() {
  showAll.value = !showAll.value;
}

// ===== تعیین ویو فعلی =====
const currentView = ref("dashboard");

// هر بار currentView تغییر می‌کند، اگر به ویویی رسیدیم که نمودار دارد، پس از nextTick دوباره createOrUpdateChart را صدا بزن
watch(currentView, (newView) => {
  if (newView === "dashboard" || newView === "analysis") {
    nextTick(() => {
      createOrUpdateChart(selectedMonth.value);
    });
  }
});

// ====== مدیریت مودال‌ها ======
// اطلاعات کاربری که در حال حاضر دکمهٔ پیام یا گواهینامه آن زده شده
const currentEmployee = ref(null);

// مودال پیام
const showMessageModal = ref(false);
const messageText = ref(""); // متغیر برای نگهداری متن پیام

function openMessageModal(emp) {
  currentEmployee.value = emp;
  messageText.value = "";      // پاک کردن متن قبلی
  showMessageModal.value = true;
}
function closeMessageModal() {
  showMessageModal.value = false;
  currentEmployee.value = null;
}
function sendMessage() {
  if (!messageText.value.trim()) {
    alert("لطفاً یک متن برای پیام وارد کنید.");
    return;
  }
  alert(`پیام برای ${currentEmployee.value.name} ارسال شد:\n\n${messageText.value}`);
  closeMessageModal();
}

// مودال امضای گواهینامه
const showCertificateModal = ref(false);
function openCertificateModal(emp) {
  currentEmployee.value = emp;
  showCertificateModal.value = true;
}
function closeCertificateModal() {
  showCertificateModal.value = false;
  currentEmployee.value = null;
}
function confirmCertificate() {
  currentEmployee.value.certificateSigned = true;
  teamStats.issuedCertificates += 1;
  closeCertificateModal();
  alert(`گواهینامه برای ${currentEmployee.value.name} با موفقیت صادر شد.`);
}

// ===== مدیریت مودال جزئیات پیشرفت =====
const showDetailModal = ref(false);
const detailEmployee = ref(null);
function openDetailModal(emp) {
  detailEmployee.value = emp;
  showDetailModal.value = true;
}
function closeDetailModal() {
  showDetailModal.value = false;
  detailEmployee.value = null;
}

// ===== مدیریت مودال توصیه‌های آموزشی =====
const showRecommendationModal = ref(false);
const recommendationText = ref("");
function openRecommendationModal() {
  showRecommendationModal.value = true;
}
function closeRecommendationModal() {
  showRecommendationModal.value = false;
  recommendationText.value = "";
}
function sendRecommendation() {
  if (!recommendationText.value.trim()) {
    alert("لطفاً متنی وارد کنید.");
    return;
  }
  alert(`پیام تیمی ارسال شد:\n\n${recommendationText.value}`);
  closeRecommendationModal();
}

// ====== داده‌های فرضی روند پیشرفت (trendData) ======
const trendData = {
  فروردین: {
    labels: ["هفته ۱", "هفته ۲", "هفته ۳", "هفته ۴"],
    avgProgress: [65, 70, 72, 75],
    completedPercent: [50, 58, 62, 68],
  },
  اردیبهشت: {
    labels: ["هفته ۱", "هفته ۲", "هفته ۳", "هفته ۴"],
    avgProgress: [75, 78, 80, 83],
    completedPercent: [60, 65, 70, 75],
  },
  خرداد: {
    labels: ["هفته ۱", "هفته ۲", "هفته ۳", "هفته ۴"],
    avgProgress: [82, 85, 88, 90],
    completedPercent: [70, 75, 80, 85],
  },
  تیر: {
    labels: ["هفته ۱", "هفته ۲", "هفته ۳", "هفته ۴"],
    avgProgress: [88, 89, 90, 92],
    completedPercent: [75, 78, 82, 88],
  },
  مرداد: {
    labels: ["هفته ۱", "هفته ۲", "هفته ۳", "هفته ۴"],
    avgProgress: [90, 91, 92, 93],
    completedPercent: [80, 82, 85, 90],
  },
  شهریور: {
    labels: ["هفته ۱", "هفته ۲", "هفته ۳", "هفته ۴"],
    avgProgress: [91, 92, 93, 94],
    completedPercent: [82, 85, 88, 92],
  },
  مهر: {
    labels: ["هفته ۱", "هفته ۲", "هفته ۳", "هفته ۴"],
    avgProgress: [92, 93, 94, 95],
    completedPercent: [85, 88, 90, 94],
  },
  آبان: {
    labels: ["هفته ۱", "هفته ۲", "هفته ۳", "هفته ۴"],
    avgProgress: [93, 94, 95, 96],
    completedPercent: [88, 90, 92, 96],
  },
  آذر: {
    labels: ["هفته ۱", "هفته ۲", "هفته ۳", "هفته ۴"],
    avgProgress: [94, 95, 96, 97],
    completedPercent: [90, 92, 94, 98],
  },
  دی: {
    labels: ["هفته ۱", "هفته ۲", "هفته ۳", "هفته ۴"],
    avgProgress: [95, 96, 97, 97],
    completedPercent: [92, 94, 96, 99],
  },
  بهمن: {
    labels: ["هفته ۱", "هفته ۲", "هفته ۳", "هفته ۴"],
    avgProgress: [96, 97, 97, 98],
    completedPercent: [94, 96, 98, 100],
  },
  اسفند: {
    labels: ["هفته ۱", "هفته ۲", "هفته ۳", "هفته ۴"],
    avgProgress: [97, 97, 98, 99],
    completedPercent: [96, 98, 100, 100],
  },
  "هفته گذشته": {
    labels: ["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنجشنبه", "جمعه"],
    avgProgress: [90, 91, 92, 93, 92, 91, 94],
    completedPercent: [80, 82, 83, 85, 84, 82, 88],
  },
};

// ====== کامپیوتر برای مقادیر کارت‌ها بر اساس selectedMonth ======
const currentOverview = computed(() => {
  // اگر selectedMonth خارج از trendData بود، به «هفته گذشته» برگرد
  const dataObj = trendData[selectedMonth.value] || trendData["هفته گذشته"];
  // آخرین ایندکس برای هر آرایه
  const lastIndex = dataObj.avgProgress.length - 1;
  const prevIndex = Math.max(lastIndex - 1, 0);

  // مقدارهای میانگین پیشرفت جدید و قبلی
  const avgLast = dataObj.avgProgress[lastIndex];
  const avgPrev = dataObj.avgProgress[prevIndex];

  // مقدارهای درصد دوره‌های تکمیل‌شده جدید و قدیم
  const compLastPct = dataObj.completedPercent[lastIndex];
  const compPrevPct = dataObj.completedPercent[prevIndex];

  // میانگین پیشرفت
  const avgProgress = avgLast;
  // تغییر نسبت به هفته/هفتهٔ قبل یا ماه قبل
  const avgChange = avgLast - avgPrev;

  // تعداد کل دوره = همان totalCourses ثابت
  const totalCourses = teamStats.totalCourses;
  // تعداد دوره‌های تکمیل‌شده بر اساس درصد آخرین هفته
  const completedCourses = Math.round((compLastPct / 100) * totalCourses);
  // تغییر تعداد دوره‌های تکمیل‌شده از ابتدای ماه تا انتها
  const coursesThisMonth = Math.round(
      ((dataObj.completedPercent[lastIndex] - dataObj.completedPercent[0]) / 100) * totalCourses
  );

  // موفقیت در آزمون (اینجا صرفاً همان avgLast فرض شده)
  const successfulTestsPercent = avgLast;
  // تغییر آزمون از هفته قبلی
  const testsChange = avgLast - avgPrev;

  // تعداد کل اهداف ثابت
  const totalGoals = teamStats.totalGoals;
  // اهداف تکمیل شده براساس درصد کامل‌شده (فرض کنیم هر «درصد دوره تکمیل‌شده» یک هدف معادل دارد)
  const achievedGoals = Math.round((compLastPct / 100) * totalGoals);
  // اهداف جدید شده از ابتدا تا انتها
  const newGoals = Math.round(
      ((dataObj.completedPercent[lastIndex] - dataObj.completedPercent[0]) / 100) * totalGoals
  );

  return {
    avgProgress,
    avgChange,
    completedCourses,
    totalCourses,
    coursesThisMonth,
    successfulTestsPercent,
    testsChange,
    achievedGoals,
    totalGoals,
    newGoals,
  };
});

// ===== ایجاد یا بروزرسانی نمودار =====
const teamTrendChart = ref(null);
let chartInstance = null;

function createOrUpdateChart(monthKey) {
  const dataObj = trendData[monthKey] || trendData["هفته گذشته"];
  const labels = dataObj.labels;
  const avgData = dataObj.avgProgress;
  const completedData = dataObj.completedPercent;

  if (!chartInstance) {
    chartInstance = new Chart(teamTrendChart.value, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "میانگین پیشرفت (%)",
            data: avgData,
            borderColor: "#4caf50",
            backgroundColor: "rgba(76, 175, 80, 0.2)",
            tension: 0.2,
            fill: true,
          },
          {
            label: "درصد دوره‌های تکمیل‌شده (%)",
            data: completedData,
            borderColor: "#2196f3",
            backgroundColor: "rgba(33, 150, 243, 0.2)",
            tension: 0.2,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            title: {
              display: true,
              text:
                  monthKey === "هفته گذشته"
                      ? "روزهای هفته گذشته"
                      : "هفته‌های " + monthKey,
              font: { size: 14 },
            },
            ticks: {
              font: { size: 12 },
            },
          },
          y: {
            beginAtZero: true,
            max: 100,
            title: {
              display: true,
              text: "درصد",
              font: { size: 14 },
            },
            ticks: {
              font: { size: 12 },
            },
          },
        },
        plugins: {
          legend: {
            labels: {
              font: { size: 12 },
            },
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                return context.dataset.label + ": " + context.parsed.y + "%";
              },
            },
          },
        },
      },
    });
  } else {
    chartInstance.data.labels = labels;
    chartInstance.data.datasets[0].data = avgData;
    chartInstance.data.datasets[1].data = completedData;
    chartInstance.options.scales.x.title.text =
        monthKey === "هفته گذشته" ? "روزهای هفته گذشته" : "هفته‌های " + monthKey;
    chartInstance.update();
  }
}

onMounted(() => {
  createOrUpdateChart(selectedMonth.value);
});

watch(selectedMonth, (newMonth) => {
  createOrUpdateChart(newMonth);
});
</script>

<style scoped>
/* ===== کانتینر کلی ===== */
.dashboard-container {
  display: flex;
  direction: rtl;
  font-family: sans-serif;
  background-color: #f5f5f5;
  min-height: 100vh;
}

/* ===== Sidebar ===== */
.sidebar {
  width: 280px;
  padding: 16px;
  height: 130vh;
  background-color: #ffffff;
  border-left: 1px solid #e0e0e0;
  overflow-y: auto;
}

/* کارت مشخصات مدیر */
.profile-card {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
  text-align: center;
  margin-bottom: 24px;
}
.avatar {
  font-size: 48px;
  margin-bottom: 8px;
}
.user-name {
  font-size: 18px;
  margin: 4px 0;
  color: #1f2023;
}
.user-subtitle {
  font-size: 14px;
  color: #666666;
  margin-bottom: 12px;
}
/* آمار */
.stats {
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
}
.stat-box {
  background-color: #e8f5e9;
  border-radius: 6px;
  flex: 0 0 45%;
  padding: 12px;
  text-align: center;
}
.stat-number {
  font-size: 20px;
  font-weight: bold;
  color: #388e3c;
}
.stat-label {
  font-size: 12px;
  color: #388e3c;
  margin-top: 4px;
}

/* فهرست ناوبری */
.nav-list {
  list-style: none;
  padding: 0;
  margin-top: 24px;
  overflow-y: auto;
}
.nav-list li {
  display: flex;
  align-items: center;
  padding: 8px 0;
  cursor: pointer;
  font-size: 14px;
  color: #333333;
}
.nav-list li + li {
  border-top: 1px solid #eeeeee;
}
.nav-icon {
  margin-left: 8px;
  font-size: 18px;
}

/* اعلان‌های مهم */
.alerts-widget {
  margin-top: 24px;
}
.widget-title {
  font-size: 16px;
  margin-bottom: 12px;
  color: #333333;
}
.alert-card {
  display: flex;
  align-items: flex-start;
  background-color: #fdfdfd;
  border-radius: 6px;
  padding: 12px;
  margin-bottom: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}
.alert-icon {
  font-size: 24px;
  margin-left: 8px;
}
.alert-content {
  flex: 1;
}
.alert-text {
  font-size: 14px;
  margin: 0 0 4px 0;
  color: #333333;
}
.alert-subtext {
  font-size: 12px;
  color: #666666;
}
/* رنگ‌بندی انواع اعلان */
.alert-warning {
  border-left: 4px solid #ffb300;
  background-color: #fff8e1;
}
.alert-success {
  border-left: 4px solid #4caf50;
  background-color: #e8f5e9;
}
.alert-danger {
  border-left: 4px solid #f44336;
  background-color: #ffebee;
}

/* آمار کلی تیم */
.team-stats-widget {
  margin-top: 24px;
}
.stat-item {
  margin-bottom: 16px;
}
.stat-item span {
  display: inline-block;
  font-size: 14px;
  color: #333333;
  margin-bottom: 4px;
}
.progress-bar {
  width: 100%;
  height: 8px;
  background-color: #e0e0e0;
  border-radius: 4px;
  margin: 4px 0;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  background-color: #4caf50;
  transition: width 0.3s ease;
}
.stat-value {
  display: inline-block;
  font-size: 12px;
  color: #555555;
  margin-right: 6px;
}

/* ===== Main Content ===== */
.main-content {
  flex: 1;
  padding: 0 20px 20px 20px;
}

/* نوار بالایی */
.topbar {
  background-color: #2e7d32;
  color: #ffffff;
  height: 56px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  justify-content: space-between;
}
.brand {
  font-size: 18px;
  font-weight: bold;
}
.topbar-user {
  display: flex;
  align-items: center;
  position: relative;
}
.topbar-avatar {
  font-size: 28px;
  margin-left: 8px;
}
.topbar-user .user-name {
  font-size: 14px;
}
.notification-badge {
  background-color: #f44336;
  color: #ffffff;
  font-size: 12px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  text-align: center;
  line-height: 18px;
  position: absolute;
  top: -4px;
  left: -4px;
}

/* بنر خوش‌آمدگویی */
.banner {
  background-color: #4caf50;
  border-radius: 8px;
  color: #ffffff;
  display: flex;
  align-items: center;
  padding: 20px;
  margin: 16px 0;
}
.banner-icon {
  font-size: 48px;
  margin-left: 16px;
}
.banner-content h2 {
  margin: 0 0 6px 0;
  font-size: 22px;
}
.banner-content p {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #e8f5e9;
}

/* نوار فیلتر ماه */
.filter-bar {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}
.btn-outline {
  background-color: transparent;
  color: #555555;
  border: 1px solid #cccccc;
  border-radius: 4px;
  padding: 6px 10px;
  cursor: pointer;
  font-size: 14px;
  margin-left: 8px;
}
.btn-outline:hover {
  background-color: #f0f0f0;
}
.download-icon {
  font-size: 18px;
}
.month-select {
  padding: 6px 10px;
  font-size: 14px;
  border: 1px solid #cccccc;
  border-radius: 4px;
}

/* بخش عملکرد کلی تیم */
.team-performance .section-title {
  font-size: 18px;
  color: #333333;
  margin-bottom: 12px;
}
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
  margin-bottom: 24px;
}
.perf-card {
  border-radius: 8px;
  color: #ffffff;
  padding: 16px;
  display: flex;
  flex-direction: column;
}
.card-icon {
  font-size: 32px;
  margin-bottom: 8px;
}
.card-number {
  font-size: 24px;
  font-weight: bold;
}
.card-text {
  font-size: 14px;
  margin-top: 4px;
}
.card-sub {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
}
/* رنگ‌بندی کارت‌ها */
.perf-success {
  background-color: #4caf50;
}
.perf-info {
  background-color: #2196f3;
}
.perf-primary {
  background-color: #1976d2;
}
.perf-warning {
  background-color: #ffb300;
}

/* بخش روند پیشرفت تیم */
.team-trend .section-title {
  font-size: 18px;
  color: #333333;
  margin-bottom: 12px;
}
.chart-container {
  position: relative;
  width: 100%;
  height: 250px; /* ارتفاع ثابت برای نمودار */
  background-color: #ffffff;
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

/* جدول کارمندان برتر */
.top-employees-section .section-title {
  font-size: 18px;
  color: #333333;
  margin-bottom: 12px;
  margin-top: 12px;
}
.table-container {
  overflow-x: auto;
}
.employees-table {
  width: 100%;
  border-collapse: collapse;
  background-color: #ffffff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}
.employees-table th,
.employees-table td {
  padding: 12px 8px;
  text-align: center;
  font-size: 14px;
  color: #333333;
}
.employees-table th {
  background-color: #f0f0f0;
  font-weight: normal;
}
.emp-info {
  display: flex;
  align-items: center;
  gap: 8px;
}
.emp-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
.emp-name {
  font-weight: bold;
  margin: 0;
}
.emp-role {
  font-size: 12px;
  color: #666666;
  margin: 0;
}
.progress-wrapper {
  position: relative;
  width: 100px;   /* عرض نوار */
  height: 6px;    /* ارتفاع نوار */
}
.progress-bar.small {
  width: 100%;
  height: 100%;
  background-color: #e0e0e0;
  border-radius: 3px;
  overflow: hidden;
}
.progress-bar.small .progress-fill {
  background-color: #4caf50;
  height: 100%;
  transition: width 0.3s ease;
}
.progress-text {
  position: absolute;
  top: 50%;
  left: -50%;
  transform: translate(-50%, -50%);
  font-size: 12px;
  color: #555555;
  pointer-events: none;
}

/* استایل ستون نقاط ضعف */
.weakness-text {
  background-color: #f5e8e8;
  color: #ff0009;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
}

/* استایل ستون هدف و مهلت */
.month-select {
  padding: 4px 8px;
  font-size: 14px;
  border: 1px solid #cccccc;
  border-radius: 4px;
}

/* دکمهٔ مشاهده همه */
.show-all-container {
  margin-top: 12px;
  text-align: center;
}
.show-all-container .btn {
  padding: 6px 16px;
  font-size: 14px;
  border: none;
  border-radius: 4px;
  background-color: #1976d2;
  color: #ffffff;
  cursor: pointer;
}
.show-all-container .btn:hover {
  background-color: #1565c0;
}

.skill-tag {
  background-color: #e8f5e9;
  color: #388e3c;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
}
.actions-cell .link-btn {
  background: none;
  border: none;
  color: #1976d2;
  cursor: pointer;
  font-size: 14px;
  margin: 0 4px;
}
.actions-cell .link-btn:hover {
  text-decoration: underline;
}

/* ===== استایل مودال (ارسال پیام + امضای گواهینامه) ===== */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-content {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 6px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  direction: rtl;
}
.modal-content h3 {
  margin-top: 0;
  font-size: 18px;
  margin-bottom: 12px;
  color: #333333;
}
.modal-content textarea {
  width: 100%;
  padding: 8px;
  font-size: 14px;
  border: 1px solid #cccccc;
  border-radius: 4px;
  resize: vertical;
  margin-bottom: 12px;
}
.modal-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
.modal-buttons .btn {
  padding: 6px 12px;
  font-size: 14px;
  cursor: pointer;
}
.modal-buttons .btn-outline {
  background-color: transparent;
  border: 1px solid #cccccc;
  color: #333333;
  border-radius: 4px;
}
.modal-buttons .btn-primary {
  background-color: #4caf50;
  border: none;
  color: #ffffff;
  border-radius: 4px;
}
.modal-buttons .btn-primary:hover {
  background-color: #43a047;
}

/* ===== استایل برای نام کارمند کلیک‌پذیر ===== */
.clickable-name {
  cursor: pointer;
  color: #1976d2;
}
.clickable-name:hover {
  text-decoration: underline;
}

/* ===== استایل مودال جزئیات پیشرفت ===== */
.detail-modal-content {
  direction: rtl;
}
.detail-list {
  list-style: none;
  padding: 0;
  margin-bottom: 16px;
}
.detail-list li {
  margin-bottom: 8px;
  font-size: 14px;
  color: #333333;
}
.detail-progress-bar {
  margin-top: 4px;
  width: 100%;
  height: 6px;
  background-color: #e0e0e0;
  border-radius: 3px;
  overflow: hidden;
}
.detail-progress-bar .progress-fill {
  background-color: #4caf50;
  height: 100%;
  transition: width 0.3s ease;
}

/* سایر استایل‌های قبلی (نمودار و بقیهٔ بخش‌ها) همانند قبل */
</style>
