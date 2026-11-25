# Admin Tracking Redesign Plan

Status: implemented. Database changes are in `supabase/schema.sql`; the admin pages are in `src/pages/`. Run the rollout order in section 10 before deploying.

## 1. Goal

Replace the two flat tables on the admin dashboard ("Students" and "Set attempts") with two drill-down views:

- **Tracking by student**: student list, then a detail page per student.
- **Tracking by set**: set list, then a detail page per set with per-question results.

The database keeps only the **latest completed attempt** per user and set. Existing data must be preserved.

## 2. Decisions

| # | Topic | Decision |
|---|---|---|
| 1 | Attempts kept | One completed practice attempt per user per set. One completed mock exam per user. |
| 2 | Meaning of "latest" | The latest **completed** attempt (by `completed_at`). An abandoned retake never replaces it. |
| 3 | In-progress attempts | Kept while in progress and allowed alongside the previous completed attempt. Never counted in any admin metric. |
| 4 | Replacement time | When a new attempt completes, the older completed attempt and its answers are deleted. |
| 5 | Mock exams | Same rule as sets. They count toward a student's overall accuracy, weakest module and domain breakdown. They do not appear in the set list. |
| 6 | "Correct / Total" | A display format such as `43 / 50`, not a division. |
| 7 | Set list | Shows set title and accuracy only. |
| 8 | Set accuracy | Total correct answers divided by total answered, across every student's latest completed attempt of that set. |
| 9 | Question row | `correct / answered` across each student's latest completed attempt, plus the question number and prompt. |
| 10 | Weakest module | Domain with the lowest accuracy among domains with at least 5 answered questions. Ties go to the domain with more answered questions. |
| 11 | Student overall accuracy | Total correct divided by total answered over the student's latest completed practice attempts and latest completed mock. |
| 12 | No data | Shown as `—`. Students and sets with no completed attempt still appear in lists. |
| 13 | Calculation location | In the database through admin-only functions. React only formats results. |
| 14 | Existing data | Never cleared. Only superseded completed duplicates are removed, after a backup and preview. |

## 3. Data retention

### 3.1 Ongoing behaviour

- `complete_attempt` (practice): after marking the attempt completed, delete the same user's other completed attempts for the same set.
- `finish_mock_exam`: after marking the mock completed, delete the same user's other completed mock exams.
- `start_attempt` and `start_mock_exam` are unchanged. A completed attempt stays until its replacement completes.
- The student's review of their previous attempt, shown before "Start new attempt", keeps working.

### 3.2 Constraints

Add two partial unique indexes, created after the cleanup in section 4:

- One completed practice attempt per `(user_id, set_id)`.
- One completed mock per `user_id`.

### 3.3 Side effects

- A student's own dashboard shows one row per set instead of every past attempt, and "Completed attempts" counts accordingly.
- `start_mock_exam` prefers questions the student has not answered. Its "seen" list is built from stored answers, so pruning old mock attempts can make previously seen questions eligible again. Latest practice attempts cover every question in a set, so the effect is small.
- Domain numbers on admin pages exclude in-progress answers. The existing `domain_performance` function includes them, so admin pages use new functions and the student dashboard is unchanged.

## 4. Migration of existing data

The migration lives in `supabase/schema.sql`, which is re-run on updates, so it must be idempotent.

1. **Backup**: export `quiz_attempts` and `quiz_answers`, or take a Supabase backup, before running.
2. **Preview**: run a read-only query listing completed attempts that would be removed. Check it before continuing.
3. **Cleanup**: for each `(user_id, set_id)` with several completed practice attempts, keep the one with the latest `completed_at`. Do the same for completed mocks per `user_id`. Delete the others. Answers cascade.
4. **Untouched**: all in-progress attempts and each user's latest completed attempts.
5. **Indexes**: create the unique indexes from section 3.2.
6. **Re-run safety**: a second run deletes nothing.

Expected effect on the current data: none. The admin screenshots show no user with two completed attempts for the same set. Nur Jannah appears under two separate accounts: `workwithjannah@gmail.com` (Practice set 01, 43 / 50) and `jannahmazlan08@gmail.com` (Mock exam, 56 / 65). Different users and different attempt types, so nothing is removed.

## 5. Admin database functions

All functions check `public.is_admin()` and return nothing otherwise. They count only completed attempts, filter to student-role users, and are granted to `authenticated` and revoked from `public` and `anon`, like the existing functions.

| Function | Returns |
|---|---|
| `admin_student_overview()` | One row per student: id, name, email, overall accuracy, weakest domain and its accuracy. Students without attempts are included. |
| `admin_student_detail(p_user_id)` | Domain breakdown (answered, correct) and per-set results (set, correct, total, completed date), plus a mock exam entry. |
| `admin_set_overview()` | One row per set: id, title, set number, accuracy and number of students. Sets with no attempts are included. |
| `admin_set_questions(p_set_id)` | One row per question: id, number, prompt, correct count and answered count. Questions nobody answered show `0 / 0`. |

## 6. Admin pages

Routes, all behind the existing admin-only guard:

| Route | Page |
|---|---|
| `/admin` | Redirects to `/admin/students`. |
| `/admin/students` | Student list. |
| `/admin/students/:studentId` | Student detail. |
| `/admin/sets` | Set list. |
| `/admin/sets/:setId` | Set detail. |

### 6.1 Shared layout

- Heading and summary cards (students, active students, completed attempts, overall accuracy).
- Tabs: **Students** and **Sets**.
- Existing loading, error and table styles are reused.

### 6.2 Student list

| Student | Email | Overall accuracy | Weakest module |
|---|---|---|---|

The student name links to the detail page.

### 6.3 Student detail

- Header: name, email, overall accuracy, weakest module, back link.
- **Domain breakdown**: Domain, Correct / Total, Accuracy.
- **Set breakdown**: Set, Correct / Total, Accuracy, Completed. Includes a "Mock exam" row if the student has one.

### 6.4 Set list

| Set | Accuracy |
|---|---|

The set title links to the detail page.

### 6.5 Set detail

- Header: set title, accuracy, number of students, back link.
- **Questions**: Question No, Title (prompt, shortened with the full text available on expansion), Correct / Total.

### 6.6 Removed

The "Set attempts" table and the old flat "Students" table.

## 7. Code organization

- `AdminDashboardPage`: shared layout, summary and tabs.
- `AdminStudentList`, `AdminStudentDetailPage`, `AdminSetList`, `AdminSetDetailPage`.
- Data loading in a small helper module that calls the admin functions.
- `DomainPerformance` reused or extended for the student detail domain table.
- `App.jsx`: add the new routes under the existing admin guard.

## 8. Edge cases

- Student with no attempts.
- Set with no attempts.
- Missing name or email.
- Long question prompts.
- Request errors and empty results.
- Invalid or unknown student or set ids in the URL.
- Horizontal scroll for tables on narrow screens.
- Keyboard-accessible links.

## 9. Validation

Compare against the existing admin screenshots:

| Student | Expected |
|---|---|
| Muhammad Amirul Aiman bin Zawawi | 22 / 50 on Practice set 01 (44%). The in-progress attempt is excluded. |
| ABD HAFIZ B. ABD HALIM | 14 / 50 on Practice set 01 (28%). |
| Nur Jannah Mazlan (`workwithjannah@gmail.com`) | 43 / 50 on Practice set 01 (86%). |
| Nur Jannah Mazlan (`jannahmazlan08@gmail.com`) | 56 / 65 on the mock exam (86%). |
| Syamsul | In progress only, so `—`. |
| Students with no attempts | Listed with `—`. |

Tests:

1. Retake a set: start, abandon, and confirm the previous result remains.
2. Complete the retake and confirm the old attempt and its answers are gone and the new one is reflected.
3. Repeat for the mock exam.
4. Confirm Practice set 01 question rows add up to the number of students with a completed attempt.
5. Confirm a non-admin gets no data from the admin functions.
6. Run `npm run build`.
7. Check desktop and mobile layouts.

## 10. Rollout order

1. Back up and preview the rows to be removed.
2. Run the updated `schema.sql` (cleanup, indexes, updated completion functions, admin functions).
3. Verify the admin function output against section 9.
4. Deploy the frontend changes.
5. Run the retake tests.
