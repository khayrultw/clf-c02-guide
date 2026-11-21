# AWS CLF-C02 Study Website

## Development

```bash
npm install
cp .env.example .env
npm run dev
```

Before Supabase is configured, the study lessons are available and practice questions can be read, but answers cannot be checked: answer keys only exist in Supabase.

## Content

The markdown at the package root (`study-material/`, `service-reference/`, `question-sets/`, `answer-keys/`) is the source of truth. `npm run dev` and `npm run build` copy it into `src/content/` first, so edit the root files, not the copies. Question sets are written to `src/content/question-sets/*.json` without answers.

```bash
npm run check-content   # validates pages, heading ids, internal links, and every question against its answer key and the coverage CSV
```

## Supabase setup

1. Create a Supabase project.
2. Run [supabase/schema.sql](supabase/schema.sql) in the Supabase SQL Editor.
3. Enable Email/Password authentication in Supabase Auth providers.
4. Copy `.env.example` to `.env`.
5. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`.
6. Set `SUPABASE_SERVICE_ROLE_KEY` for the local seeding command only. Never share `.env` or include it in a copy of this package given to students. If it has ever been shared, rotate the key in Supabase.
7. Run:

```bash
npm run seed-supabase
npm run dev
```

`npm run seed-supabase` reads the questions and answer keys from the package markdown and the exam domain of each question from `question-reports/question-coverage.csv`. Run it again after editing questions or answers.

Do not expose `SUPABASE_SERVICE_ROLE_KEY` through a `VITE_` variable or commit `.env`.

Recommended Supabase Auth settings:

- Minimum password length 8 and leaked password protection enabled (the forms already require 8 characters).
- If only your class should register, disable public sign-ups and invite students, or restrict sign-ups with a "before user created" auth hook.

## Hosting

The site is a single-page app, so every path must serve `index.html`; otherwise refreshing a page or opening the email links for `/reset-password` and `/email-verified` returns 404. `public/_redirects` handles this on Netlify and Cloudflare Pages. On AWS Amplify add a rewrite from `</^[^.]+$/>` to `/index.html` (200). On S3 + CloudFront, return `/index.html` with status 200 for 403 and 404 errors.

## Password recovery

In Supabase Authentication settings, add your local and deployed reset URLs:

```text
http://127.0.0.1:5173/reset-password
http://127.0.0.1:5173/email-verified
https://your-domain/reset-password
https://your-domain/email-verified
```

Use **forgot-password** to send the reset email and **reset-password** to set the new password.

## Admin role

New registrations receive the `student` role automatically. Promote a specific existing user from the Supabase SQL Editor:

```sql
update public.profiles
set role = 'admin'
where email = 'admin@example.com';
```

This SQL must be run by a Supabase project administrator. Do not accept a role from registration form data or expose the service-role key in the React app.

## Supabase data model

- `question_sets`: set title and question count
- `questions`: prompts, options, exam domain, and task
- `answer_keys`: correct answers and explanations (readable by admins only)
- `quiz_attempts`: one row per attempt; retaking a set starts a new attempt and keeps the old one
- `quiz_answers`: selected answers and correctness per question

Students cannot write scores or answers directly. The app calls these database functions, which grade on the server:

- `start_attempt(set_id)`: resumes the in-progress attempt or starts a new one
- `submit_answer(attempt_id, question_id, selected)`: grades and stores an answer once, then returns the explanation
- `get_attempt_review(attempt_id)`: answers and explanations already earned in an attempt
- `complete_attempt(attempt_id)`: finishes an attempt after every question is answered
- `attempt_summaries(all)` and `domain_performance(all)`: dashboard data; `all = true` only works for admins
- `start_mock_exam()`: resumes the in-progress mock exam or draws a new one: 65 questions weighted 16/19/22/8 by domain, preferring questions the student has not answered, with a 90-minute deadline
- `save_mock_answer(attempt_id, question_id, selected)`: saves or clears a mock answer without revealing whether it is correct
- `finish_mock_exam(attempt_id)`: scores and closes a mock exam (also after the deadline)

While a mock exam is in progress, its correctness, explanations, score, and domain results stay hidden from the student, including through direct table reads.

The only columns a student can update directly are `current_question_index`, `current_selected_answers`, and `flagged_question_ids` (their place in an in-progress attempt).

## Apply database changes

Run `supabase/schema.sql` again after adding or updating the database, then run
`npm run seed-supabase` so questions get their exam domain. The script is idempotent,
upgrades existing databases in place, and backfills existing users into `profiles`.
Existing attempts and answers are kept.

After running the SQL, verify the tables in Supabase:

```sql
select table_name
from information_schema.tables
where table_schema = 'public'
  and table_name in (
    'profiles',
    'question_sets',
    'questions',
    'answer_keys',
    'quiz_attempts',
    'quiz_answers'
  )
order by table_name;
```

For existing registered users, the schema script runs this backfill:

```sql
insert into public.profiles (id, email, full_name, role)
select
  users.id,
  users.email,
  coalesce(
    nullif(users.raw_user_meta_data->>'full_name', ''),
    split_part(coalesce(users.email, ''), '@', 1)
  ),
  'student'
from auth.users users
on conflict (id) do nothing;
```

After applying the schema, sign out and sign in again once so the app reloads the
profile and role. The app also creates a missing profile automatically for the
logged-in user if the profile row is absent.

The app reads question sets from Supabase when available and falls back to the copied JSON files.
# clf-c02-guide
