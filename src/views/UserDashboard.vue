<template>
  <div class="dashboard-container">
    <!-- ==============================================
         Sidebar: مشخصات کاربر، چالش هفتگی و مهارت‌ها
         ============================================== -->
    <aside class="sidebar">
      <!-- کارت مشخصات کاربر -->
      <div class="profile-card">
        <div class="avatar">👩‍🍳</div>
        <h3 class="user-name">{{ user.name }}</h3>
        <p class="user-subtitle">{{ user.subtitle }}</p>

        <!-- نوار پیشرفت سطح -->
        <div class="level-info">
          <span>سطح {{ user.level }}</span>
          <div class="progress-bar">
            <div
                class="progress-fill"
                :style="{ width: levelPercent + '%' }"
            ></div>
          </div>
          <span class="score-text">{{ user.score }}/{{ user.nextLevelScore }} امتیاز</span>
        </div>

        <!-- آمار دوره‌ها و غذاها -->
        <div class="stats">
          <div class="stat-box">
            <div class="stat-number">{{ user.level }}</div>
            <div class="stat-label">دوره‌های گذرانده</div>
          </div>
          <div class="stat-box">
            <div class="stat-number">{{ user.foodsTested }}</div>
            <div class="stat-label">غذاهای امتحان شده</div>
          </div>
        </div>

        <!-- فهرست ناوبری -->
        <ul class="nav-list">
          <li @click="currentView = 'dashboard'">
            <span class="nav-icon">🏠</span>
            <span>داشبورد</span>
          </li>
          <li @click="currentView = 'my-courses'">
            <span class="nav-icon">📚</span>
            <span>دوره‌های من</span>
          </li>
          <li @click="currentView = 'exam-history'">
            <span class="nav-icon">📑</span>
            <span>تاریخچه آزمون‌ها</span>
          </li>
          <li @click="currentView = 'achievements'">
            <span class="nav-icon">✅</span>
            <span>دستاوردها</span>
          </li>
          <li @click="currentView = 'feedback'">
            <span class="nav-icon">💬</span>
            <span>ارسال بازخورد</span>
          </li>
          <!-- گزینهٔ جدید: رده‌بندی -->
          <li @click="currentView = 'leaderboard'">
            <span class="nav-icon">🏆</span>
            <span>رده‌بندی</span>
          </li>
        </ul>
      </div>

      <!-- ویجت چالش هفتگی -->
      <div class="widget weekly-challenge" v-if="currentView === 'dashboard'">
        <h4 class="widget-title">چالش هفتگی</h4>
        <div class="challenge-icon">🛡️</div>
        <p class="challenge-text">{{ weeklyChallenge.title }}</p>
        <div class="challenge-bar">
          <div
              class="challenge-fill"
              :style="{ width: (weeklyChallenge.progress / weeklyChallenge.total) * 100 + '%' }"
          ></div>
        </div>
        <p class="challenge-progress">
          پیشرفت: {{ weeklyChallenge.progress }} / {{ weeklyChallenge.total }} تکمیل شده
        </p>
        <button class="btn btn-primary" @click="openChallengeModal()">مشاهده چالش بعدی</button>
      </div>

      <!-- ویجت مهارت‌های آشپزی -->
      <div class="widget cooking-skills" v-if="currentView === 'dashboard'">
        <h4 class="widget-title">مهارت‌های آشپزی شما</h4>
        <div class="skills-list">
          <span
              v-for="(skill, index) in cookingSkills"
              :key="index"
              class="skill-tag"
              :class="{ done: skill.done }"
          >
            {{ skill.title }}
            <span v-if="skill.done" class="skill-check">✔️</span>
          </span>
        </div>
        <div class="skills-progress-bar">
          <div
              class="skills-progress-fill"
              :style="{ width: cookingSkillPercent + '%' }"
          ></div>
        </div>
        <p class="skills-progress-text">
          مهارت‌های کسب شده: {{ acquiredSkills }}/{{ totalSkills }}
        </p>
      </div>
    </aside>

    <!-- ========================
         Main Content (محتوای اصلی)
         ======================== -->
    <main class="main-content">
      <!-- ===========
           View: داشبورد
           =========== -->
      <div v-if="currentView === 'dashboard'">
        <!-- بنر خوش‌آمدگویی -->
        <div class="banner">
          <div class="banner-icon">🍳</div>
          <div class="banner-content">
            <h2>خوش آمدید، {{ user.name }}!</h2>
            <p>سفر آشپزی خود را از جایی که رها کردید ادامه دهید.</p>
            <button class="btn btn-light">ادامه یادگیری</button>
          </div>
        </div>

        <!-- نوار پیشرفت کل ماژول‌ها -->
        <section class="user-progress-section">
          <h3 class="section-title">پیشرفت کلی شما</h3>
          <div class="progress-bar full">
            <div
                class="progress-fill full"
                :style="{ width: userProgressPercent + '%' }"
            ></div>
          </div>
          <p class="progress-text">
            {{ userModulesCompleted }}/{{ modules.length }} ماژول تکمیل‌شده ({{ userProgressPercent }}%)
          </p>
        </section>

        <!-- سفر یادگیری (ماژول‌ها) -->
        <section class="learning-journey">
          <div class="section-header">
            <h3>سفر یادگیری شما</h3>
            <span class="subheader">سطح {{ user.level }} از {{ modules.length }}</span>
          </div>
          <div class="module-grid">
            <div
                v-for="module in modules"
                :key="module.id"
                class="module-card"
                :class="{
                completed: module.status === 'completed',
                active: module.status === 'active',
                locked: module.status === 'locked'
              }"
            >
              <div class="module-header">
                <span v-if="module.status === 'locked'" class="lock-icon">🔒</span>
                <span v-else-if="module.status === 'completed'" class="check-icon">✔️</span>
                <span class="module-number">{{ module.id }}</span>
                <!-- آیکون بوکمارک -->
                <span
                    class="bookmark-icon"
                    :class="{ bookmarked: module.bookmarked }"
                    @click.stop="toggleBookmark(module)"
                    title="نشان کردن این سطح"
                >
                  ★
                </span>
              </div>
              <div
                  class="module-title"
                  @click="openLevelModal(module)"
                  :class="{ clickable: module.status !== 'locked' }"
              >
                {{ module.title }}
              </div>
              <div v-if="module.status === 'active'" class="module-subtitle">
                در حال انجام
              </div>
            </div>
          </div>
        </section>

        <!-- آزمون نهایی سطح (نمایش جزئیات آخرین ماژول فعال) -->
        <section class="next-exam" v-if="activeModule">
          <div class="exam-info">
            <h3>{{ nextExam.title }}</h3>
            <p>{{ nextExam.description }}</p>
          </div>
          <div class="exam-actions">
            <!-- مرور مطالبِ ماژول فعال -->
            <button class="btn btn-secondary" @click="openLevelModal(activeModule)">
              مرور مطالب
            </button>
            <!-- شرکت در آزمون نهاییِ ماژول فعال -->
            <button
                class="btn btn-danger"
                @click="openFinalExamModal(activeModule)"
                :disabled="activeModule.finalExamPassed"
            >
              {{ activeModule.finalExamPassed ? 'آزمون پاس شده' : 'شرکت در آزمون' }}
            </button>
          </div>
        </section>
        <section v-else style="margin-top: 24px; text-align: center; color: #666;">
          شما هم‌اکنون همهٔ سطوح را تکمیل کرده‌اید 🎉
        </section>

        <!-- نکات آشپزی شخصی‌سازی شده -->
        <section class="personal-tips">
          <h3>نکات آشپزی شخصی‌سازی شده</h3>
          <div class="tips-grid">
            <div v-for="(tip, index) in tips" :key="index" class="tip-card">
              <h4 class="tip-title">{{ tip.title }}</h4>
              <p class="tip-desc">{{ tip.description }}</p>
            </div>
          </div>
        </section>

        <!-- آزمون‌ها و مهلت‌های پیش رو -->
        <section class="upcoming-section">
          <h3>آزمون‌ها و مهلت‌های پیش رو</h3>
          <div class="upcoming-grid">
            <div
                v-for="(item, idx) in upcomingExams"
                :key="idx"
                class="upcoming-card"
                :class="{
                'due-today': item.status === 'due-today',
                'due-near': item.status === 'due-3days',
                'due-future': item.status === 'due-nextweek'
              }"
            >
              <div class="upcoming-info">
                <h4 class="upcoming-title">{{ item.title }}</h4>
                <span class="due-label">
                  <template v-if="item.status === 'due-today'">فردا</template>
                  <template v-else-if="item.status === 'due-3days'">۳ روز مانده</template>
                  <template v-else-if="item.status === 'due-nextweek'">هفته آینده</template>
                </span>
              </div>
              <div class="upcoming-actions">
                <!-- اگر وضعیت فرداست -->
                <template v-if="item.status === 'due-today'">
                  <button class="btn btn-warning" @click="openLevelModal(activeModule)">
                    مرور مطالب
                  </button>
                  <button class="btn btn-outline" @click="setReminder()">
                    تنظیم یادآوری
                  </button>
                </template>

                <!-- اگر ۳ روز مانده -->
                <template v-else-if="item.status === 'due-3days'">
                  <button class="btn btn-danger" @click="openFinalExamModal(activeModule)">
                    شرکت در آزمون
                  </button>
                  <button class="btn btn-outline" @click="openLevelModal(activeModule)">
                    راهنمای مطالعه
                  </button>
                </template>

                <!-- اگر هفتهٔ آینده -->
                <template v-else-if="item.status === 'due-nextweek'">
                  <button class="btn btn-info">
                    افزودن به تقویم
                  </button>
                  <button class="btn btn-outline" @click="openLevelModal(activeModule)">
                    مطالب آمادگی
                  </button>
                </template>
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- =========================
           View: رده‌بندی (Leaderboard)
           ========================= -->
      <div v-else-if="currentView === 'leaderboard'">
        <header class="topbar">
          <div class="brand">رده‌بندی کاربران</div>
        </header>
        <section class="leaderboard-section" style="margin-top: 16px;">
          <h3 class="section-title">جدول رده‌بندی</h3>
          <div class="table-container">
            <table class="employees-table">
              <thead>
              <tr>
                <th>رتبه</th>
                <th>نام کاربر</th>
                <th>سطح</th>
                <th>درصد پیشرفت</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(u, index) in otherUsers" :key="index">
                <td>{{ index + 1 }}</td>
                <td>{{ u.name }}</td>
                <td>{{ u.level }}</td>
                <td>{{ u.progressPercent }}%</td>
              </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <!-- =========================
           View: دوره‌های من (Bookmarked)
           ========================= -->
      <div v-else-if="currentView === 'my-courses'">
        <header class="topbar">
          <div class="brand">دوره‌های من</div>
        </header>
        <section class="bookmarks-section" style="margin-top: 16px;">
          <h3 class="section-title">ماژول‌های نشان‌شده</h3>
          <div class="table-container">
            <table class="employees-table">
              <thead>
              <tr>
                <th>شناسه</th>
                <th>عنوان ماژول</th>
                <th>وضعیت</th>
                <th>عملیات</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(m, idx) in modules.filter(m => m.bookmarked)" :key="idx">
                <td>{{ m.id }}</td>
                <td>{{ m.title }}</td>
                <td>{{ m.status }}</td>
                <td>
                  <button
                      class="btn btn-outline"
                      @click="openLevelModal(m)"
                      :disabled="m.status === 'locked'"
                  >
                    مشاهده جزئیات
                  </button>
                </td>
              </tr>
              <tr v-if="modules.filter(m => m.bookmarked).length === 0">
                <td colspan="4">فعلاً هیچ ماژولی نشان‌شده نیست.</td>
              </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <!-- =========================
           View: تاریخچه آزمون‌ها
           ========================= -->
      <div v-else-if="currentView === 'exam-history'">
        <header class="topbar">
          <div class="brand">تاریخچه آزمون‌ها</div>
        </header>
        <section class="history-section" style="margin-top: 16px;">
          <h3 class="section-title">آزمون‌ها و Quizzes گذشته</h3>
          <div class="table-container">
            <table class="employees-table">
              <thead>
              <tr>
                <th>نوع</th>
                <th>عنوان</th>
                <th>امتیاز</th>
                <th>عملیات</th>
              </tr>
              </thead>
              <tbody>
              <!-- Quizzes پاس شده -->
              <tr v-for="(h, idx) in passedQuizzes" :key="'q' + idx">
                <td>Quiz</td>
                <td>{{ h.title }}</td>
                <td>{{ h.grade }}%</td>
                <td>
                  <button
                      class="btn btn-outline"
                      @click="openHistoryItem(h, 'quiz')"
                  >
                    نمایش
                  </button>
                </td>
              </tr>
              <!-- Final Exam پاس شده -->
              <tr v-for="(e, idx) in passedExams" :key="'e' + idx">
                <td>Final Exam</td>
                <td>{{ e.title }}</td>
                <td>{{ e.grade }}%</td>
                <td>
                  <button
                      class="btn btn-outline"
                      @click="openHistoryItem(e, 'exam')"
                  >
                    نمایش
                  </button>
                </td>
              </tr>
              <tr v-if="passedQuizzes.length === 0 && passedExams.length === 0">
                <td colspan="4">فعلاً آزمونی گذشته نشده.</td>
              </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <!-- =========================
           View: دستاوردها
           ========================= -->
      <div v-else-if="currentView === 'achievements'">
        <header class="topbar">
          <div class="brand">دستاوردهای شما</div>
        </header>
        <section class="achievements-section" style="margin-top: 16px;">
          <h3 class="section-title">دستاوردها</h3>
          <div class="achievements-grid">
            <div v-for="(a, idx) in achievements" :key="idx" class="achievement-card">
              <div class="achievement-icon">{{ a.icon }}</div>
              <h4 class="achievement-title">{{ a.title }}</h4>
              <p class="achievement-desc">{{ a.description }}</p>
            </div>
          </div>
        </section>
      </div>

      <!-- =========================
           View: ارسال بازخورد
           ========================= -->
      <div v-else-if="currentView === 'feedback'">
        <header class="topbar">
          <div class="brand">ارسال بازخورد</div>
        </header>
        <button class="btn btn-primary" @click="showFeedbackModal = true" style="margin-top:16px;">
          ارسال بازخورد جدید
        </button>
      </div>

      <!-- ==============
           مودال سطح (Level Modal)
           ============== -->
      <div
          v-if="showLevelModal"
          class="modal-overlay"
          @click.self="closeLevelModal"
      >
        <div class="modal-content level-modal">
          <h3>سطح {{ selectedModule.id }}: {{ selectedModule.title }}</h3>

          <h4>اهداف</h4>
          <ul>
            <li v-for="(obj, i) in selectedModule.objectives" :key="i">
              {{ obj }}
            </li>
          </ul>

          <h4>ویدیوهای آموزشی</h4>
          <ul>
            <li v-for="(vid, i) in selectedModule.videos" :key="i">
              <a :href="vid.url" target="_blank">{{ vid.title }}</a>
            </li>
          </ul>

          <h4>Quizzes</h4>
          <div class="quiz-buttons">
            <button
                v-for="(quiz, i) in selectedModule.quizzes"
                :key="i"
                class="btn btn-outline"
                @click="openQuiz(i)"
            >
              {{ quiz.title }}
            </button>
          </div>

          <!-- ===== بخش آزمون نهایی ===== -->
          <h4>آزمون نهایی</h4>
          <p>{{ selectedModule.finalExam.description }}</p>
          <div class="modal-buttons" style="margin-bottom: 12px;">
            <!-- فقط اگر ماژول در وضعیت active باشد و آزمون نهایی را پاس نکرده باشد -->
            <button
                v-if="selectedModule.status === 'active' && !selectedModule.finalExamPassed"
                class="btn btn-warning"
                @click="openFinalExamModal(selectedModule)"
            >
              شروع آزمون نهایی
            </button>
            <span v-else-if="selectedModule.finalExamPassed" class="pass-text">
              آزمون نهایی پاس شده ✔️
            </span>
            <span v-else style="color: #666666; font-size: 14px;">
              آزمون نهایی این سطح قبلاً پاس شده است.
            </span>
          </div>

          <!-- دکمهٔ «پایان سطح و باز کردن سطح بعدی» -->
          <div class="modal-buttons">
            <button
                v-if="selectedModule.status === 'active' && selectedModule.finalExamPassed"
                class="btn btn-primary"
                @click="passExam(selectedModule)"
            >
              پایان سطح و باز کردن سطح بعدی
            </button>
            <button class="btn btn-outline" @click="closeLevelModal">
              بستن
            </button>
          </div>
        </div>
      </div>

      <!-- ==============
           مودال Quiz
           ============== -->
      <div
          v-if="showQuizModal"
          class="modal-overlay"
          @click.self="closeQuizModal"
      >
        <div class="modal-content quiz-modal">
          <h3>{{ selectedQuiz.title }}</h3>
          <form>
            <ul>
              <li v-for="(q, idx) in selectedQuiz.questions" :key="idx">
                <p><strong>Q{{ idx + 1 }}:</strong> {{ q.question }}</p>
                <ul class="quiz-options">
                  <li v-for="(opt, j) in q.options" :key="j">
                    <label>
                      <input
                          type="radio"
                          :name="'quiz_' + idx"
                          :value="j"
                          v-model="quizUserAnswers[idx]"
                      />
                      {{ opt }}
                    </label>
                  </li>
                </ul>
              </li>
            </ul>
            <div class="modal-buttons" style="justify-content: flex-end;">
              <button
                  type="button"
                  class="btn btn-primary"
                  @click="submitQuiz()"
              >
                ارسال و مشاهدهٔ نمره
              </button>
              <button class="btn btn-outline" @click="closeQuizModal">
                بستن
              </button>
            </div>
          </form>

          <!-- نمایش نمره پس از ارسال -->
          <div v-if="quizSubmitted" style="margin-top: 12px; color: #388e3c;">
            <strong>نمرهٔ شما در این Quiz: {{ quizScore }}% </strong>
          </div>
        </div>
      </div>

      <!-- ==============
           مودال Final Exam
           ============== -->
      <div
          v-if="showFinalModal"
          class="modal-overlay"
          @click.self="closeFinalExamModal"
      >
        <div class="modal-content quiz-modal">
          <h3>آزمون نهایی سطح {{ selectedFinal.id }}</h3>
          <form>
            <ul>
              <li v-for="(q, idx) in selectedFinal.finalExam.questions" :key="idx">
                <p><strong>Q{{ idx + 1 }}:</strong> {{ q.question }}</p>
                <ul class="quiz-options">
                  <li v-for="(opt, j) in q.options" :key="j">
                    <label>
                      <input
                          type="radio"
                          :name="'final_' + idx"
                          :value="j"
                          v-model="finalUserAnswers[idx]"
                      />
                      {{ opt }}
                    </label>
                  </li>
                </ul>
              </li>
            </ul>
            <div class="modal-buttons" style="justify-content: flex-end;">
              <button
                  type="button"
                  class="btn btn-primary"
                  @click="submitFinalExam()"
              >
                ارسال و مشاهدهٔ نمره نهایی
              </button>
              <button class="btn btn-outline" @click="closeFinalExamModal">
                بستن
              </button>
            </div>
          </form>

          <!-- نمایش نمره پس از ارسال -->
          <div v-if="finalSubmitted" style="margin-top: 12px; color: #388e3c;">
            <strong>نمرهٔ شما در آزمون نهایی: {{ finalScore }}% </strong>
          </div>
        </div>
      </div>

      <!-- ==============
           مودال تاریخچه آزمون‌ها
           ============== -->
      <div
          v-if="showHistoryModal"
          class="modal-overlay"
          @click.self="closeHistoryModal"
      >
        <div class="modal-content history-modal">
          <h3>
            {{ historyType === 'quiz' ? selectedHistoryItem.title : selectedHistoryItem.title }}
          </h3>
          <p>نمره: {{ selectedHistoryItem.grade }}%</p>

          <!-- اگر نوع Quiz باشد -->
          <div v-if="historyType === 'quiz'">
            <h4>سؤالات:</h4>
            <ul>
              <li v-for="(q, idx) in selectedHistoryItem.questions" :key="idx">
                <p><strong>Q{{ idx + 1 }}:</strong> {{ q.question }}</p>
                <ul class="quiz-options">
                  <li v-for="(opt, j) in q.options" :key="j">
                    • {{ opt }}
                  </li>
                </ul>
              </li>
            </ul>
          </div>

          <!-- اگر نوع آزمون نهایی باشد -->
          <div v-else>
            <h4>سؤالات و پاسخ‌ها:</h4>
            <ul>
              <li v-for="(q, idx) in selectedHistoryItem.questions" :key="idx">
                <p><strong>Q{{ idx + 1 }}:</strong> {{ q.question }}</p>
                <ul class="quiz-options">
                  <li
                      v-for="(opt, j) in q.options"
                      :key="j"
                      style="display: flex; align-items: center;"
                  >
                    <!-- اگر این گزینه، گزینهٔ صحیح است -->
                    <span
                        v-if="j === q.correct"
                        style="color: #388e3c; margin-right: 6px;"
                    >
                      ✔
                    </span>
                    <span v-else style="margin-right: 24px;"></span>
                    <span>{{ opt }}</span>
                    <!-- اگر این گزینه، پاسخ کاربر بوده -->
                    <span
                        v-if="selectedHistoryItem.userAnswers[idx] === j"
                        style="color: #ff5722; margin-left: 8px;"
                    >
                      (پاسخ شما)
                    </span>
                  </li>
                </ul>
              </li>
            </ul>
          </div>

          <div class="modal-buttons">
            <button class="btn btn-outline" @click="closeHistoryModal">
              بستن
            </button>
          </div>
        </div>
      </div>

      <!-- ==============
           مودال چالش هفتگی
           ============== -->
      <div
          v-if="showChallengeModal"
          class="modal-overlay"
          @click.self="closeChallengeModal"
      >
        <div class="modal-content level-modal" style="max-width: 500px;">
          <h3>سؤالات چالش هفتگی</h3>
          <form>
            <ul>
              <li v-for="(q, idx) in weeklyChallenge.questions" :key="idx">
                <p><strong>Q{{ idx + 1 }}:</strong> {{ q.question }}</p>
                <ul class="quiz-options">
                  <li v-for="(opt, j) in q.options" :key="j">
                    <label>
                      <input
                          type="radio"
                          :name="'challenge_' + idx"
                          :value="j"
                          v-model="challengeUserAnswers[idx]"
                      />
                      {{ opt }}
                    </label>
                  </li>
                </ul>
              </li>
            </ul>
            <div class="modal-buttons" style="justify-content: flex-end; margin-top: 12px;">
              <button
                  type="button"
                  class="btn btn-primary"
                  @click="submitChallenge()"
              >
                ارسال و بررسی
              </button>
              <button class="btn btn-outline" @click="closeChallengeModal()">
                بستن
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- ==============
           مودال ارسال بازخورد
           ============== -->
      <div
          v-if="showFeedbackModal"
          class="modal-overlay"
          @click.self="closeFeedbackModal"
      >
        <div class="modal-content feedback-modal">
          <h3>ارسال بازخورد</h3>
          <textarea
              v-model="feedbackText"
              placeholder="لطفاً نظرات و پیشنهادات خود را بنویسید..."
              rows="6"
          ></textarea>
          <div class="modal-buttons">
            <button class="btn btn-primary" @click="submitFeedback">
              ارسال
            </button>
            <button class="btn btn-outline" @click="closeFeedbackModal">
              بستن
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { reactive, computed, ref } from 'vue';

//////////////////////////////
// داده‌های کاربر و وضعیت‌ها
//////////////////////////////
const user = reactive({
  name: 'الهه حبیبی',
  subtitle: 'علاقه‌مند به آشپزی ایرانی',
  level: 7,
  score: 350,
  nextLevelScore: 500,
  coursesDone: 8,
  foodsTested: 24,
});

//////////////////////
// درصد نوار سطح
//////////////////////
const levelPercent = computed(() => {
  return ((user.score / user.nextLevelScore) * 100).toFixed(0);
});

//////////////////////
// ماژول‌ها (Levels)
//////////////////////
const modules = reactive([
  {
    id: 1,
    title: 'مقدماتی',
    status: 'completed',
    bookmarked: false,
    objectives: [
      'آشنایی با ابزارهای اولیه آشپزی',
      'یادگیری اصول ایمنی و بهداشت آشپزخانه',
    ],
    videos: [
      { title: 'معرفی ابزارها', url: 'https://youtu.be/example1' },
      { title: 'روش‌های شستن صحیح سبزیجات', url: 'https://youtu.be/example2' },
    ],
    quizzes: [
      {
        title: 'Quiz 1',
        questions: [
          {
            question: 'ابزار پایه‌ای برای خرد کردن کدام است؟',
            options: ['کارد', 'مخلوط‌کن', 'ظرف شستشو', 'تخته گوشت'],
            correct: 0, // جواب صحیح: کارد
          },
          {
            question: 'کدام اصل بهداشت آشپزخانه است؟',
            options: ['شستن دست‌ها', 'پوشیدن دستکش', 'استفاده از ماسک', 'بستن در یخچال'],
            correct: 0, // شستن دست‌ها
          },
        ],
      },
      {
        title: 'Quiz 2',
        questions: [
          {
            question: 'بهترین روش برای نگهداری سبزیجات چیست؟',
            options: ['در یخچال', 'در قفسه', 'در فریزر', 'زیر نور خورشید'],
            correct: 0, // در یخچال
          },
        ],
      },
    ],
    finalExam: {
      description:
          'آزمون نهایی مقدماتی شامل سؤالاتی درباره ابزارهای اولیه و بهداشت آشپزخانه است.',
      questions: [
        {
          question: 'کدام وسیله برای خرد کردن سبزیجات استفاده می‌شود؟',
          options: ['مخلوط‌کن', 'ماهیتابه', 'چاقو', 'ظرف شستشو'],
          correct: 2, // چاقو
        },
        {
          question: 'برای رعایت بهداشت ابتدا باید چه کرد؟',
          options: ['شستن دست‌ها', 'روشن کردن گاز', 'سفت کردن در یخچال', 'نپوشیدن دستکش'],
          correct: 0, // شستن دست‌ها
        },
      ],
    },
    finalExamPassed: true,
  },
  {
    id: 2,
    title: 'مهارت چاقو',
    status: 'completed',
    bookmarked: false,
    objectives: [
      'یادگیری حالت صحیح دست در برش',
      'تمرین تکنیک‌های خرد کردن پیاز و سبزیجات',
    ],
    videos: [
      { title: 'تکنیک خرد کردن پیاز', url: 'https://youtu.be/example3' },
      { title: 'روش استفاده از تخته گوشت', url: 'https://youtu.be/example4' },
    ],
    quizzes: [
      {
        title: 'Quiz 1',
        questions: [
          {
            question: 'کدام تکنیک برای نگه‌داشتن انگشتان در حین برش ایمن است؟',
            options: ['چنگال محافظ', 'قرار دادن انگشت صاف', 'بلند کردن همه انگشتان', 'استفاده از دستکش'],
            correct: 0, // چنگال محافظ
          },
        ],
      },
      {
        title: 'Quiz 2',
        questions: [
          {
            question: 'بهترین زاویه برای حفظ تیزی چاقو چیست؟',
            options: ['۲۰ درجه', '۴۵ درجه', '۹۰ درجه', '۱۰ درجه'],
            correct: 0, // ۲۰ درجه
          },
        ],
      },
    ],
    finalExam: {
      description:
          'آزمون نهایی مهارت چاقو شامل سؤالاتی درباره حالت دست، زاویهٔ تیز کردن و ایمنی در برش است.',
      questions: [
        {
          question: 'برای ایمنی در برش، باید انگشتان را چگونه نگه داشت؟',
          options: ['چنگال محافظ', 'انگشت صاف', 'انگشتان جمع', 'دستکش'],
          correct: 0, // چنگال محافظ
        },
        {
          question: 'زاویهٔ تیز کردن استاندارد چاقو چقدر است؟',
          options: ['۲۰ درجه', '۹۰ درجه', '۳۰ درجه', '۵۰ درجه'],
          correct: 0, // ۲۰ درجه
        },
      ],
    },
    finalExamPassed: true,
  },
  {
    id: 3,
    title: 'حرارت و زمان',
    status: 'completed',
    bookmarked: false,
    objectives: [
      'تشخیص حرارت مناسب برای تابه',
      'یادگیری زمان‌بندی پخت انواع غذا',
    ],
    videos: [
      { title: 'کنترل حرارت روی شعله‌پلوپز', url: 'https://youtu.be/example5' },
      { title: 'هنر زمان‌بندی پخت', url: 'https://youtu.be/example6' },
    ],
    quizzes: [
      {
        title: 'Quiz 1',
        questions: [
          {
            question: 'برای سرخ کردن مرغ، شعله چقدر باید باشد؟',
            options: ['متوسط', 'کم', 'زیاد', 'خاموش'],
            correct: 0, // متوسط
          },
        ],
      },
    ],
    finalExam: {
      description:
          'آزمون نهایی حرارت و زمان شامل سؤالاتی درباره دماها و زمان‌بندی پخت است.',
      questions: [
        {
          question: 'برای سرخ کردن مرغ معمولاً از چه درجه‌ای استفاده می‌شود؟',
          options: ['متوسط', 'کم', 'زیاد', 'کم‌تر از متوسط'],
          correct: 0, // متوسط
        },
        {
          question: 'چه مدت زمانی برای پخت کامل برنج لازم است؟',
          options: ['۲۰ دقیقه', '۵ دقیقه', '۵۰ دقیقه', '۱۲۰ دقیقه'],
          correct: 0, // ۲۰ دقیقه
        },
      ],
    },
    finalExamPassed: true,
  },
  {
    id: 4,
    title: 'طعم‌ها',
    status: 'completed',
    bookmarked: false,
    objectives: [
      'آشنایی با ترکیب طعم‌های ترش و شور',
      'یادگیری استفاده از ادویه‌های پایه',
    ],
    videos: [
      { title: 'اصول تعادل طعم‌ها', url: 'https://youtu.be/example7' },
      { title: 'افزودن ادویه به غذا', url: 'https://youtu.be/example8' },
    ],
    quizzes: [
      {
        title: 'Quiz 1',
        questions: [
          {
            question: 'اضافه کردن یک قاشق سماق چه تأثیری بر طعم غذا دارد؟',
            options: ['طعم ترش', 'طعم شیرین', 'طعم تلخ', 'طعم شور'],
            correct: 0, // طعم ترش
          },
        ],
      },
    ],
    finalExam: {
      description:
          'آزمون نهایی طعم‌ها شامل سؤالاتی در مورد ترکیب طعم‌ها و کار با ادویه است.',
      questions: [
        {
          question: 'در ترکیب طعم‌ها، کدام طعم معمولاً با ترشی مقابله می‌کند؟',
          options: ['شیرینی', 'تلخی', 'شور', 'ادویه'],
          correct: 0, // شیرینی
        },
        {
          question: 'مادهٔ اصلی برای ایجاد طعم تند چیست؟',
          options: ['فلفل', 'نمک', 'شکر', 'آب لیمو'],
          correct: 0, // فلفل
        },
      ],
    },
    finalExamPassed: true,
  },
  {
    id: 5,
    title: 'تکنیک‌ها',
    status: 'completed',
    bookmarked: false,
    objectives: [
      'تمرین روش‌های سرخ کردن لایه‌ای',
      'یادگیری فن ته دیگ و برشته‌سازی',
    ],
    videos: [
      { title: 'سرخ کردن لایه‌ای اصولی', url: 'https://youtu.be/example9' },
      { title: 'ساختن ته‌دیگ طلایی', url: 'https://youtu.be/example10' },
    ],
    quizzes: [
      {
        title: 'Quiz 1',
        questions: [
          {
            question: 'برای رسیدن به ته‌دیگ یکدست باید چه کار کرد؟',
            options: ['حرارت پایین', 'حرارت زیاد', 'روغن زیاد', 'روغن کم'],
            correct: 0, // حرارت پایین
          },
        ],
      },
    ],
    finalExam: {
      description:
          'آزمون نهایی تکنیک‌ها شامل سؤالاتی درباره سرخ کردن لایه‌ای و فن ته‌دیگ است.',
      questions: [
        {
          question: 'برای داشتن ته‌دیگ یک‌دست، درجه حرارت باید چگونه باشد؟',
          options: ['پایین', 'بالا', 'متوسط', 'خاموش'],
          correct: 0, // پایین
        },
        {
          question: 'در چه مرحله‌ای باید روغن را اضافه کرد؟',
          options: ['ابتدا', 'وسط پخت', 'آخر کار', 'هیچ‌وقت'],
          correct: 0, // ابتدا
        },
      ],
    },
    finalExamPassed: true,
  },
  {
    id: 6,
    title: 'آشپزی ایرانی',
    status: 'completed',
    bookmarked: false,
    objectives: [
      'طرز تهیه خورش قورمه‌سبزی',
      'طرز تهیه خورش قیمه',
    ],
    videos: [
      { title: 'خورش قورمه‌سبزی مرحله به مرحله', url: 'https://youtu.be/example11' },
      { title: 'خورش قیمه به سبک سنتی', url: 'https://youtu.be/example12' },
    ],
    quizzes: [
      {
        title: 'Quiz 1',
        questions: [
          {
            question: 'اصلی‌ترین سبزی خورش قورمه‌سبزی چیست؟',
            options: ['شلغم', 'گشنیز و شنبلیله', 'برگ کرفس', 'ریحان'],
            correct: 1, // گشنیز و شنبلیله
          },
        ],
      },
    ],
    finalExam: {
      description:
          'آزمون نهایی آشپزی ایرانی سوالاتی درباره خورش‌های سنتی و مواد اولیهٔ آن‌ها دارد.',
      questions: [
        {
          question: 'کدام‌یک از موارد جزو ادویه‌های لازم برای قورمه‌سبزی است؟',
          options: ['زردچوبه', 'زعفران', 'نمک و فلفل', 'تخم گشنیز'],
          correct: 3, // تخم گشنیز
        },
        {
          question: 'در خورش قیمه معمولاً از چه چیزی برای طعم‌دهی استفاده می‌شود؟',
          options: ['سبزی خشک', 'رب گوجه‌فرنگی', 'زعفران', 'رب انار'],
          correct: 1, // رب گوجه‌فرنگی
        },
      ],
    },
    finalExamPassed: true,
  },
  {
    id: 7,
    title: 'پیشرفته',
    status: 'active',
    bookmarked: false,
    objectives: [
      'تهیه انواع خورشت پیشرفته',
      'بهبود کار با ادویه‌های منطقه‌ای',
    ],
    videos: [
      { title: 'خورش فسنجان با طعم ویژه', url: 'https://youtu.be/example13' },
      { title: 'استفاده از زعفران پیشرفته', url: 'https://youtu.be/example14' },
    ],
    quizzes: [
      {
        title: 'Quiz 1',
        questions: [
          {
            question: 'برای طعم خاص فسنجان چه چیزی را باید کم یا زیاد کنیم؟',
            options: ['میزان رب انار', 'میزان روغن', 'نمک', 'فلفل'],
            correct: 0, // میزان رب انار
          },
        ],
      },
    ],
    finalExam: {
      description:
          'آزمون نهایی پیشرفته سوالاتی درباره خورشت‌های پیشرفته و ادویه‌های منطقه‌ای دارد.',
      questions: [
        {
          question: 'در فسنجان، نسبت گردو به رب انار به چه صورت است؟',
          options: ['یک به یک', 'دو به یک', 'سه به یک', 'یک به دو'],
          correct: 0, // یک به یک
        },
        {
          question: 'کدام ادویه در خورشت پیشرفتهٔ ایرانی کاربرد دارد؟',
          options: ['هل', 'زردچوبه', 'آویشن', 'فلفل سیاه'],
          correct: 0, // هل
        },
      ],
    },
    finalExamPassed: false,
  },
  {
    id: 8,
    title: 'شیرینی‌پزی',
    status: 'locked',
    bookmarked: false,
    objectives: [
      'آشنایی با آرد و شکر مناسب کیک',
      'آموزش زدن سفیده و خامه',
    ],
    videos: [
      { title: 'طرز تهیه کیک اسفنجی', url: 'https://youtu.be/example15' },
      { title: 'تهیه خامه فرم گرفته', url: 'https://youtu.be/example16' },
    ],
    quizzes: [
      {
        title: 'Quiz 1',
        questions: [
          {
            question: 'برای تهیه کیک اسفنجی از کدام نوع آرد استفاده می‌شود؟',
            options: ['آرد کیک', 'آرد نان', 'آرد سمولینا', 'آرد برنج'],
            correct: 0, // آرد کیک
          },
        ],
      },
    ],
    finalExam: {
      description:
          'آزمون نهایی شیرینی‌پزی سوالاتی درباره انواع آرد و روش‌های پنیرزدن دارد.',
      questions: [
        {
          question: 'در کیک اسفنجی، برای نرم شدن بافت کیک، از چه مقدار شکر استفاده می‌شود؟',
          options: ['زیاد', 'کم', 'متوسط', 'هیچکدام'],
          correct: 2, // متوسط
        },
        {
          question: 'برای سفت‌شدن خامه فرم‌گرفته، چه دمایی مناسب است؟',
          options: ['کم‌تر از صفر', 'نزدیک صفر', 'بالای صفر', 'بیش از ۵۰ درجه'],
          correct: 1, // نزدیک صفر
        },
      ],
    },
    finalExamPassed: false,
  },
  {
    id: 9,
    title: 'دسرها',
    status: 'locked',
    bookmarked: false,
    objectives: [
      'تهیه انواع دسرهای سرد',
      'یادگیری ژلاتین‌گذاری',
    ],
    videos: [
      { title: 'طرز تهیه دسر پاناکوتا', url: 'https://youtu.be/example17' },
      { title: 'یادگیری علامت‌گذاری ژلاتین', url: 'https://youtu.be/example18' },
    ],
    quizzes: [
      {
        title: 'Quiz 1',
        questions: [
          {
            question: 'برای ژلاتین‌گذاری دسر چه دمایی مناسب است؟',
            options: ['بالا و بجوشاندن', 'کم‌حرارت', 'بدون حرارت', 'حرارت متوسط'],
            correct: 1, // کم‌حرارت
          },
        ],
      },
    ],
    finalExam: {
      description:
          'آزمون نهایی دسرها شامل پرسش‌هایی درباره دسرهای سرد و ژلاتین‌گذاری است.',
      questions: [
        {
          question: 'در پاناکوتا، نسبت شیر به خامه چگونه است؟',
          options: ['یک به یک', 'دو به یک', 'سه به یک', 'یک به دو'],
          correct: 0, // یک به یک
        },
        {
          question: 'برای ژلاتین‌گذاری، باید ژلاتین را ابتدا در چه چیزی خیساند؟',
          options: ['آب سرد', 'شیر گرم', 'آب جوش', 'خود دسر'],
          correct: 0, // آب سرد
        },
      ],
    },
    finalExamPassed: false,
  },
  {
    id: 10,
    title: 'سرآشپز',
    status: 'locked',
    bookmarked: false,
    objectives: [
      'طراحی منوی کامل یک مراسم',
      'ایجاد هماهنگی بین پیش‌غذا، غذای اصلی و دسر',
    ],
    videos: [
      { title: 'اصول طراحی منو حرفه‌ای', url: 'https://youtu.be/example19' },
      { title: 'هماهنگی طعم‌ها در منو', url: 'https://youtu.be/example20' },
    ],
    quizzes: [
      {
        title: 'Quiz 1',
        questions: [
          {
            question: 'اصلی‌ترین نکته در طراحی منو چیست؟',
            options: ['تنوع طعم', 'تنوع رنگ', 'زیبایی سرو', 'هزینه نهایی'],
            correct: 0, // تنوع طعم
          },
        ],
      },
    ],
    finalExam: {
      description:
          'آزمون نهایی سرآشپز دربارهٔ طراحی منوی حرفه‌ای و هماهنگی غذاهاست.',
      questions: [
        {
          question: 'در طراحی منو، اولین مرحله چیست؟',
          options: ['انتخاب پیشغذا', 'انتخاب غذا اصلی', 'انتخاب دسر', 'بودجه‌بندی'],
          correct: 3, // بودجه‌بندی
        },
        {
          question: 'برای هماهنگی طعم‌ها در یک منو، باید چه کار کرد؟',
          options: ['تنظیم ادویه‌ها', 'تنظیم رنگ‌ها', 'تنظیم زمان‌بندی', 'تنظیم دما'],
          correct: 0, // تنظیم ادویه‌ها
        },
      ],
    },
    finalExamPassed: false,
  },
]);

//////////////////////////////
// وضعیت‌های مودال‌ها
//////////////////////////////
const showLevelModal = ref(false);
const selectedModule = ref({});

const showQuizModal = ref(false);
const selectedQuiz = ref({});

//////////////////////
// Quizzes و Final Examهای قبلاً پاس شده
//////////////////////
const passedQuizzes = reactive([]);
const passedExams = reactive([]);

// پرکردن تاریخچهٔ آزمون‌ها براساس ماژول‌های تکمیل‌شده یا آزمون نهایی پاس‌شده
modules.forEach((mod) => {
  if (mod.status === 'completed') {
    mod.quizzes.forEach((quiz) => {
      passedQuizzes.push({
        title: `${quiz.title} سطح ${mod.id}`,
        grade: 100,
        questions: quiz.questions,
        userAnswers: quiz.questions.map((q) => q.correct),
      });
    });
  }
  if (mod.finalExamPassed) {
    passedExams.push({
      title: `Final Exam سطح ${mod.id}`,
      grade: 100,
      description: mod.finalExam.description,
      questions: mod.finalExam.questions,
      userAnswers: mod.finalExam.questions.map((q) => q.correct),
    });
  }
});

//////////////////////
// آرایهٔ Quizzes جدید که در طول UI پاس می‌شوند
//////////////////////
const quizUserAnswers = ref([]);
const quizScore = ref(null);
const quizSubmitted = ref(false);

//////////////////////
// متغیرهای Final Exam
//////////////////////
const showFinalModal = ref(false);
const selectedFinal = ref({});
const finalUserAnswers = ref([]);
const finalScore = ref(null);
const finalSubmitted = ref(false);

//////////////////////
// متغیرهای چالش هفتگی
//////////////////////
const showChallengeModal = ref(false);
const challengeUserAnswers = ref([]);

// تعریف چالش هفتگی به همراه سؤالات و پاسخ‌های صحیح
const weeklyChallenge = reactive({
  title: 'تسلط بر ۳ غذای ایرانی',
  progress: 2,
  total: 3,
  questions: [
    {
      question: 'کدام یک از این خورش‌ها ایرانی نیست؟',
      options: ['قورمه‌سبزی', 'فسنجان', 'بیف استراگانف'],
      correct: 2, // بیف استراگانف
    },
    {
      question: 'چه ادویه‌ای معمولاً در قورمه‌سبزی به‌کار می‌رود؟',
      options: ['زردچوبه', 'هل', 'نمک'],
      correct: 0, // زردچوبه
    },
    {
      question: 'برای خوش‌رنگ شدن فسنجان از چه افزودنی‌ای استفاده می‌شود؟',
      options: ['رب انار', 'رب گوجه‌فرنگی', 'سماق'],
      correct: 0, // رب انار
    },
  ],
});

//////////////////////
// محاسبهٔ سطح فعال (اولین ماژول فعال)
//////////////////////
const activeModule = computed(() => {
  return modules.find((m) => m.status === 'active') || null;
});

//////////////////////
// محاسبهٔ nextExam بر اساس activeModule
//////////////////////
const nextExam = computed(() => {
  if (!activeModule.value) {
    return { title: 'همه سطوح تکمیل شده', description: '' };
  }
  return {
    title: `آزمون نهایی سطح ${activeModule.value.id}`,
    description: activeModule.value.finalExam.description,
  };
});

//////////////////////
// آرایهٔ آزمون‌ها و مهلت‌ها
//////////////////////
const upcomingExams = [
  {
    title: 'ارزیابی مهارت‌های چاقو',
    status: 'due-today',
  },
  {
    title: 'آزمون نهایی سطح ۷',
    status: 'due-3days',
  },
  {
    title: 'آزمون تهیه خورش',
    status: 'due-nextweek',
  },
];

// داده‌های فرضی برای رده‌بندی (Leaderboard)
const otherUsers = reactive([
  { name: 'علی محمدی', level: 9, progressPercent: 90 },
  { name: 'مهدی شریفی', level: 8, progressPercent: 80 },
  { name: 'سارا رضایی', level: 7, progressPercent: 70 },
  { name: 'لیلا کریمی', level: 6, progressPercent: 60 },
  { name: 'امیرحسین رضایی', level: 7, progressPercent: 75 },
  { name: 'فاطمه مهدوی', level: 5, progressPercent: 50 },
  { name: 'حسن پورمهر', level: 6, progressPercent: 65 },
]);

//////////////////////////////
// درصد پیشرفت ماژول‌ها
//////////////////////////////
const userModulesCompleted = computed(() => {
  return modules.filter((m) => m.status === 'completed').length;
});
const userProgressPercent = computed(() => {
  return ((userModulesCompleted.value / modules.length) * 100).toFixed(0);
});

//////////////////////
// باز کردن مودال سطح
//////////////////////
function openLevelModal(mod) {
  if (mod.status === 'locked') return;
  selectedModule.value = mod;
  showLevelModal.value = true;
}

//////////////////////
// بستن مودال سطح
//////////////////////
function closeLevelModal() {
  showLevelModal.value = false;
  selectedModule.value = {};
}

//////////////////////
// پاس کردن ماژول (باز کردن سطح بعدی)
//////////////////////
function passExam(mod) {
  mod.status = 'completed';
  // سطح بعدی را فعال کن
  const idx = modules.findIndex((m) => m.id === mod.id);
  if (idx >= 0 && idx + 1 < modules.length) {
    if (modules[idx + 1].status === 'locked') {
      modules[idx + 1].status = 'active';
      if (user.level < modules[idx + 1].id) {
        user.level = modules[idx + 1].id;
      }
    }
  }
  closeLevelModal();
}

//////////////////////
// بوک‌مارک کردن سطح
//////////////////////
function toggleBookmark(mod) {
  mod.bookmarked = !mod.bookmarked;
}

//////////////////////
// باز کردن مودال Quiz
//////////////////////
function openQuiz(idx) {
  selectedQuiz.value = selectedModule.value.quizzes[idx];
  quizUserAnswers.value = Array(selectedQuiz.value.questions.length).fill(null);
  quizScore.value = null;
  quizSubmitted.value = false;
  showQuizModal.value = true;
}

//////////////////////
// ارسال Quiz و محاسبهٔ نمره
//////////////////////
function submitQuiz() {
  const questions = selectedQuiz.value.questions;
  let correctCount = 0;
  for (let i = 0; i < questions.length; i++) {
    if (quizUserAnswers.value[i] === questions[i].correct) {
      correctCount++;
    }
  }
  const percent = Math.round((correctCount / questions.length) * 100);
  quizScore.value = percent;
  quizSubmitted.value = true;

  // اضافه کردن به تاریخچهٔ آزمون Quizzes اگر قبلاً اضافه نشده باشد
  const title = `${selectedQuiz.value.title} سطح ${selectedModule.value.id}`;
  const already = passedQuizzes.find((q) => q.title === title);
  if (!already) {
    passedQuizzes.push({
      title,
      grade: percent,
      questions: questions,
      userAnswers: [...quizUserAnswers.value],
    });
  }
}

//////////////////////
// بستن مودال Quiz
//////////////////////
function closeQuizModal() {
  showQuizModal.value = false;
  selectedQuiz.value = {};
  quizUserAnswers.value = [];
  quizScore.value = null;
  quizSubmitted.value = false;
}

//////////////////////
// باز کردن مودال Final Exam
//////////////////////
function openFinalExamModal(mod) {
  if (!mod.finalExamPassed) {
    selectedFinal.value = mod;
    finalUserAnswers.value = Array(mod.finalExam.questions.length).fill(null);
    finalScore.value = null;
    finalSubmitted.value = false;
    showFinalModal.value = true;
  }
}

//////////////////////
// ارسال Final Exam و محاسبهٔ نمره
//////////////////////
function submitFinalExam() {
  const questions = selectedFinal.value.finalExam.questions;
  let correctCount = 0;
  for (let i = 0; i < questions.length; i++) {
    if (finalUserAnswers.value[i] === questions[i].correct) {
      correctCount++;
    }
  }
  const percent = Math.round((correctCount / questions.length) * 100);
  finalScore.value = percent;
  finalSubmitted.value = true;

  // اگر نمره کمتر از ۵۰٪ باشد، اجازهٔ عبور نمی‌دهد
  if (percent < 50) {
    alert('متأسفانه نمرهٔ شما کمتر از ۵۰٪ است. برای رفتن به سطح بعدی باید دوباره آزمون را بدهید.');
    return;
  }

  // اگر درصد ≥۵۰٪، ماژول را پاس شده علامت‌گذاری کن
  if (!selectedFinal.value.finalExamPassed) {
    selectedFinal.value.finalExamPassed = true;
    passedExams.push({
      title: `Final Exam سطح ${selectedFinal.value.id}`,
      grade: percent,
      description: selectedFinal.value.finalExam.description,
      questions: questions,
      userAnswers: [...finalUserAnswers.value],
    });
  }
}

//////////////////////
// بستن مودال Final Exam
//////////////////////
function closeFinalExamModal() {
  showFinalModal.value = false;
  selectedFinal.value = {};
  finalUserAnswers.value = [];
  finalScore.value = null;
  finalSubmitted.value = false;
}

//////////////////////
// باز کردن تاریخچه آزمون
//////////////////////
const showHistoryModal = ref(false);
const selectedHistoryItem = ref({});
const historyType = ref('');

function openHistoryItem(item, type) {
  selectedHistoryItem.value = item;
  historyType.value = type;
  showHistoryModal.value = true;
}

function closeHistoryModal() {
  showHistoryModal.value = false;
  selectedHistoryItem.value = {};
  historyType.value = '';
}

//////////////////////
// تنظیم یادآوری
//////////////////////
function setReminder() {
  alert('یادآوری برای این آزمون تنظیم شد.');
}

//////////////////////
// باز کردن مودال چالش هفتگی
//////////////////////
function openChallengeModal() {
  challengeUserAnswers.value = Array(weeklyChallenge.questions.length).fill(null);
  showChallengeModal.value = true;
}

//////////////////////
// ارسال پاسخ‌های چالش هفتگی و علامت‌گذاری تکمیل
//////////////////////
function submitChallenge() {
  let allAnswered = true;
  for (let i = 0; i < weeklyChallenge.questions.length; i++) {
    if (challengeUserAnswers.value[i] !== weeklyChallenge.questions[i].correct) {
      allAnswered = false;
      break;
    }
  }
  if (!allAnswered) {
    alert('حداقل یکی از پاسخ‌ها اشتباه است. لطفاً دوباره تلاش کنید.');
    return;
  }
  weeklyChallenge.progress = weeklyChallenge.total;
  showChallengeModal.value = false;
  alert('تبریک! چالش هفته با موفقیت تکمیل شد.');
}

//////////////////////
// بستن مودال چالش هفتگی
//////////////////////
function closeChallengeModal() {
  showChallengeModal.value = false;
}

//////////////////////
// دستاوردها
//////////////////////
const achievements = reactive([
  {
    icon: '🥇',
    title: 'تازه‌کار',
    description: 'تکمیل اولین ماژول آموزشی',
  },
  {
    icon: '🥈',
    title: 'نیمه راه',
    description: 'تکمیل ۵ ماژول',
  },
  {
    icon: '🥉',
    title: 'استاد پیشرفته',
    description: 'رسیدن به سطح ۷',
  },
  {
    icon: '🎖️',
    title: 'قهرمان آشپزخانه',
    description: 'تکمیل تمامی ماژول‌های اولیه',
  },
]);

//////////////////////
// مودال ارسال بازخورد
//////////////////////
const showFeedbackModal = ref(false);
const feedbackText = ref('');

function closeFeedbackModal() {
  showFeedbackModal.value = false;
  feedbackText.value = '';
}

function submitFeedback() {
  if (!feedbackText.value.trim()) {
    alert('لطفاً متن بازخورد را وارد کنید.');
    return;
  }
  alert('بازخورد شما ارسال شد:\n\n' + feedbackText.value);
  closeFeedbackModal();
}

//////////////////////
// نکات آشپزی شخصی‌سازی شده
//////////////////////
const tips = [
  {
    title: 'مهارت چاقو',
    description:
        'تکنیک «چنگال محافظ» را تمرین کنید تا سرعت خرد کردن را بهبود بخشیده و از انگشتان خود محافظت کنید.',
  },
  {
    title: 'مدیریت حرارت',
    description:
        'به یاد داشته باشید که قبل از اضافه کردن روغن، تابه را پیش‌گرم کنید تا از چسبیدن غذا جلوگیری شود و پخت یکنواختی داشته باشید.',
  },
  {
    title: 'تعادل طعم‌ها',
    description:
        'غذاهای شما می‌توانند از اسیدیته بیشتری بهره ببرند. کمی آب لیمو یا آبغوره برای درخشان‌تر کردن طعم‌ها اضافه کنید.',
  },
];

//////////////////////
// داده‌های آزمون‌ها و موعدها (ساکن)
//////////////////////
// const weeklyChallenge = weeklyChallenge; // تکرار جلوگیری شده
// const upcomingExams = upcomingExams; // تکرار جلوگیری شده

//////////////////////
// مهارت‌های آشپزی
//////////////////////
const cookingSkills = reactive([
  { title: 'مهارت چاقو', done: true },
  { title: 'تعادل طعم‌ها', done: true },
  { title: 'تفت دادن', done: true },
  { title: 'اصول پخت برنج', done: true },
  { title: 'تهیه خورش', done: true },
  { title: 'تهیه ادویه‌ها', done: true },
  { title: 'تزئین غذا', done: true },
]);
const acquiredSkills = computed(() => {
  return cookingSkills.filter((s) => s.done).length;
});
const totalSkills = 20;
const cookingSkillPercent = computed(() => {
  return ((acquiredSkills.value / totalSkills) * 100).toFixed(0);
});

//////////////////////
// متغیر View جاری
//////////////////////
const currentView = ref('dashboard');
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
  width: 280px;
  padding: 16px;
  background-color: #ffffff;
  border-left: 1px solid #e0e0e0;
  overflow-y: auto;
}

/* کارت مشخصات کاربر */
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
/* نوار پیشرفت سطح */
.level-info {
  margin: 12px 0;
}
.level-info span {
  display: inline-block;
  font-size: 14px;
  color: #333333;
}
.progress-bar {
  width: 100%;
  height: 8px;
  background-color: #e0e0e0;
  border-radius: 4px;
  margin: 6px 0;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  background-color: #4caf50;
  transition: width 0.3s ease;
}
.score-text {
  font-size: 12px;
  color: #555555;
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

/* آیکون بوکمارک */
.bookmark-icon {
  position: absolute;
  top: 6px;
  right: 6px;
  font-size: 18px;
  color: #cccccc;
  cursor: pointer;
  transition: color 0.2s ease;
}
.bookmark-icon.bookmarked {
  color: #ffb300;
}

/* ویجت‌ها */
.widget {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  padding: 16px;
  margin-bottom: 24px;
}
.widget-title {
  font-size: 16px;
  margin-bottom: 12px;
  color: #333333;
}
.weekly-challenge .challenge-icon {
  font-size: 32px;
  text-align: center;
  margin-bottom: 8px;
}
.challenge-text {
  font-size: 14px;
  margin-bottom: 12px;
  color: #444444;
  text-align: center;
}
.challenge-bar {
  width: 100%;
  height: 8px;
  background-color: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
}
.challenge-fill {
  height: 100%;
  background-color: #4caf50;
  transition: width 0.3s ease;
}
.challenge-progress {
  font-size: 12px;
  color: #555555;
  text-align: center;
  margin-bottom: 12px;
}
.btn {
  display: inline-block;
  border: none;
  border-radius: 4px;
  padding: 8px 12px;
  font-size: 14px;
  cursor: pointer;
  text-align: center;
  margin-top: 4px;
}
.btn-primary {
  background-color: #4caf50;
  color: #ffffff;
}
.btn-primary:hover {
  background-color: #43a047;
}
.btn-secondary {
  background-color: #888888;
  color: #ffffff;
}
.btn-secondary:hover {
  background-color: #666666;
}
.btn-danger {
  background-color: #f44336;
  color: #ffffff;
}
.btn-danger:hover {
  background-color: #d32f2f;
}
.btn-light {
  background-color: #ffffff;
  color: #4caf50;
  border: 1px solid #4caf50;
}
.btn-light:hover {
  background-color: #f1f8e9;
}
.btn-warning {
  background-color: #ffb300;
  color: #ffffff;
}
.btn-warning:hover {
  background-color: #ff9800;
}
.btn-info {
  background-color: #2196f3;
  color: #ffffff;
}
.btn-info:hover {
  background-color: #1976d2;
}
.btn-outline {
  background-color: transparent;
  color: #555555;
  border: 1px solid #cccccc;
}
.btn-outline:hover {
  background-color: #f0f0f0;
}

/* ویجت مهارت‌ها */
.cooking-skills .skills-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 12px;
}
.skill-tag {
  background-color: #e8f5e9;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  color: #388e3c;
  display: inline-flex;
  align-items: center;
}
.skill-tag.done {
  background-color: #c8e6c9;
}
.skill-check {
  margin-left: 4px;
  font-size: 12px;
}
.skills-progress-bar {
  width: 100%;
  height: 6px;
  background-color: #e0e0e0;
  border-radius: 3px;
  overflow: hidden;
}
.skills-progress-fill {
  height: 100%;
  background-color: #4caf50;
  transition: width 0.3s ease;
}
.skills-progress-text {
  font-size: 12px;
  color: #555555;
  text-align: center;
  margin-top: 6px;
}

/* ===== Main Content ===== */
.main-content {
  flex: 1;
  padding: 20px;
}

/* بنر خوش‌آمدگویی */
.banner {
  background-color: #4caf50;
  border-radius: 8px;
  color: #ffffff;
  display: flex;
  align-items: center;
  padding: 20px;
  margin-bottom: 24px;
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

/* نوار پیشرفت کل ماژول‌ها */
.user-progress-section {
  margin-bottom: 24px;
}
.user-progress-section .section-title {
  font-size: 18px;
  color: #333333;
  margin-bottom: 8px;
}
.user-progress-section .progress-bar.full {
  width: 100%;
  height: 10px;
  background-color: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 6px;
}
.user-progress-section .progress-fill.full {
  height: 100%;
  background-color: #4caf50;
  transition: width 0.3s ease;
}
.user-progress-section .progress-text {
  font-size: 12px;
  color: #555555;
}

/* بخش سفر یادگیری */
.learning-journey .section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.learning-journey h3 {
  margin: 0;
  font-size: 18px;
  color: #333333;
}
.subheader {
  font-size: 12px;
  color: #555555;
}
.module-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 12px;
  margin-bottom: 24px;
}
.module-card {
  background-color: #e8f5e9;
  border-radius: 6px;
  padding: 12px;
  text-align: center;
  position: relative;
  min-height: 80px;
  color: #333333;
  transition: transform 0.2s ease;
}
.module-card:hover {
  transform: translateY(-2px);
}
.module-card.completed {
  background-color: #c8e6c9;
}
.module-card.locked {
  background-color: #cccccc;
  color: #777777;
}
.module-card.active {
  border: 2px solid #4caf50;
  background-color: #ffffff;
}
.module-header {
  font-size: 14px;
  margin-bottom: 8px;
}
.lock-icon,
.check-icon {
  font-size: 18px;
  margin-left: 4px;
}
.module-number {
  font-weight: bold;
}
.module-title {
  font-size: 13px;
  cursor: pointer;
}
.module-title.clickable:hover {
  text-decoration: underline;
}
.module-subtitle {
  font-size: 12px;
  color: #4caf50;
  margin-top: 4px;
}

/* دکمه‌های Quiz */
.quiz-buttons {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

/* بخش آزمون بعدی */
.next-exam {
  background-color: #ffffff;
  border: 1px solid #4caf50;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}
.exam-info h3 {
  margin: 0 0 6px 0;
  font-size: 17px;
  color: #333333;
}
.exam-info p {
  margin: 0;
  font-size: 13px;
  color: #555555;
}
.exam-actions button + button {
  margin-right: 8px;
}

/* بخش نکات آشپزی */
.personal-tips h3 {
  margin-bottom: 12px;
  font-size: 18px;
  color: #333333;
}
.tips-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
  margin-bottom: 24px;
}
.tip-card {
  background-color: #e8f5e9;
  border-radius: 6px;
  padding: 12px;
  min-height: 100px;
}
.tip-title {
  font-size: 14px;
  margin-bottom: 6px;
  color: #388e3c;
}
.tip-desc {
  font-size: 12px;
  color: #444444;
}

/* بخش آزمون‌ها و مهلت‌ها */
.upcoming-section h3 {
  margin-bottom: 12px;
  font-size: 18px;
  color: #333333;
}
.upcoming-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}
.upcoming-card {
  border-radius: 6px;
  padding: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.upcoming-info {
  display: flex;
  flex-direction: column;
}
.upcoming-title {
  font-size: 14px;
  margin: 0 0 4px 0;
  color: #333333;
}
.due-label {
  font-size: 12px;
  color: #666666;
}
.upcoming-actions button + button {
  margin-right: 6px;
}
.due-today {
  background-color: #fff8e1;
  border: 1px solid #ffb300;
}
.due-near {
  background-color: #ffebee;
  border: 1px solid #f44336;
}
.due-future {
  background-color: #e3f2fd;
  border: 1px solid #2196f3;
}

/* ==========================
   View: رده‌بندی - جدول
   ========================== */
.leaderboard-section .section-title {
  font-size: 18px;
  color: #333333;
  margin-bottom: 12px;
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

/* ==========================
   مودال سطح (Level Modal)
   ========================== */
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
.modal-content.level-modal {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 6px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  direction: rtl;
  color: #1f2023;
}
.modal-content.level-modal h3 {
  margin-top: 0;
  font-size: 18px;
  margin-bottom: 12px;
  color: #333333;
}
.modal-content.level-modal h4 {
  margin-bottom: 8px;
  font-size: 16px;
  color: #333333;
}
.modal-content.level-modal ul {
  padding-left: 20px;
  margin-bottom: 12px;
}
.modal-content.level-modal .quiz-buttons {
  margin-bottom: 12px;
}
.modal-content.level-modal .modal-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 12px;
}
.pass-text {
  font-size: 14px;
  color: #388e3c;
}

/* ==============
   مودال Quiz و Final Exam
   ============== */
.modal-content.quiz-modal {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 6px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  direction: rtl;
  color: #1f2023;
}
.modal-content.quiz-modal h3 {
  margin-top: 0;
  font-size: 18px;
  margin-bottom: 12px;
  color: #333333;
}
.modal-content.quiz-modal ul {
  padding-left: 20px;
  margin-bottom: 12px;
}
.modal-content.quiz-modal .quiz-options {
  list-style: none;
  padding-left: 0;
  margin-bottom: 12px;
}
.modal-content.quiz-modal .quiz-options li {
  margin-bottom: 4px;
}
.modal-content.quiz-modal form {
  margin-bottom: 12px;
}

/* ==========================
   مودال تاریخچه آزمون‌ها
   ========================== */
.modal-content.history-modal {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 6px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  direction: rtl;
  color: #1f2023;
}
.modal-content.history-modal h3 {
  margin-top: 0;
  font-size: 18px;
  margin-bottom: 8px;
  color: #333333;
}
.modal-content.history-modal p {
  font-size: 14px;
  margin-bottom: 12px;
  color: #555555;
}
.modal-content.history-modal ul {
  padding-left: 20px;
  margin-bottom: 12px;
}
.modal-content.history-modal .quiz-options {
  list-style: none;
  padding-left: 0;
  margin-bottom: 12px;
}
.modal-content.history-modal .quiz-options li {
  margin-bottom: 4px;
  display: flex;
  align-items: center;
}

/* ==========================
   مودال چالش هفتگی
   ========================== */
.modal-content.level-modal h3 {
  margin-top: 0;
  font-size: 18px;
  margin-bottom: 12px;
  color: #333333;
}
.modal-content.level-modal .quiz-options {
  list-style: none;
  padding-left: 0;
  margin-bottom: 12px;
}
.modal-content.level-modal .quiz-options li {
  margin-bottom: 4px;
}

/* ==========================
   مودال ارسال بازخورد
   ========================== */
.modal-content.feedback-modal {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 6px;
  width: 90%;
  max-width: 500px;
  direction: rtl;
  color: #1f2023;
}
.modal-content.feedback-modal h3 {
  margin-top: 0;
  font-size: 18px;
  margin-bottom: 12px;
  color: #333333;
}
.modal-content.feedback-modal textarea {
  width: 100%;
  padding: 8px;
  font-size: 14px;
  border: 1px solid #cccccc;
  border-radius: 4px;
  resize: vertical;
  margin-bottom: 12px;
}

/* ==========================
   دستاوردها
   ========================== */
.achievements-section .section-title {
  font-size: 18px;
  color: #333333;
  margin-bottom: 12px;
}
.achievements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 12px;
}
.achievement-card {
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 12px;
  text-align: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}
.achievement-icon {
  font-size: 32px;
  margin-bottom: 8px;
}
.achievement-title {
  font-size: 14px;
  margin: 4px 0;
  color: #333333;
}
.achievement-desc {
  font-size: 12px;
  color: #555555;
}
</style>
