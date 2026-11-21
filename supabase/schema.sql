create table if not exists public.question_sets (
  id text primary key,
  title text not null,
  set_number text not null,
  question_count integer not null,
  created_at timestamptz not null default now()
);

create table if not exists public.questions (
  id text primary key,
  set_id text not null references public.question_sets(id) on delete cascade,
  number integer not null,
  prompt text not null,
  response_mode text not null,
  required_answers integer not null,
  options jsonb not null,
  unique (set_id, number)
);

create table if not exists public.answer_keys (
  question_id text primary key references public.questions(id) on delete cascade,
  correct_answers text[] not null,
  concept_tested text,
  why_these_selections_fit text,
  lesson_links jsonb not null default '[]'::jsonb,
  option_rationales jsonb not null default '[]'::jsonb,
  common_trap text,
  official_documentation jsonb not null default '[]'::jsonb
);

create table if not exists public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  set_id text not null references public.question_sets(id) on delete cascade,
  score integer not null,
  total integer not null,
  started_at timestamptz,
  completed_at timestamptz,
  status text not null default 'in_progress' check (status in ('in_progress', 'completed')),
  current_question_index integer not null default 0,
  current_selected_answers text[] not null default '{}',
  current_checked boolean not null default false,
  current_correct boolean not null default false
);

create table if not exists public.quiz_answers (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references public.quiz_attempts(id) on delete cascade,
  question_id text not null references public.questions(id) on delete cascade,
  selected_answers text[] not null,
  is_correct boolean not null,
  unique (attempt_id, question_id)
);

alter table public.quiz_attempts
  add column if not exists status text;
alter table public.quiz_attempts
  add column if not exists current_question_index integer;
alter table public.quiz_attempts
  add column if not exists current_selected_answers text[];
alter table public.quiz_attempts
  add column if not exists current_checked boolean;
alter table public.quiz_attempts
  add column if not exists current_correct boolean;

update public.quiz_attempts
set
  status = coalesce(status, 'completed'),
  current_question_index = coalesce(current_question_index, 0),
  current_selected_answers = coalesce(current_selected_answers, '{}'),
  current_checked = coalesce(current_checked, false),
  current_correct = coalesce(current_correct, false)
where status is null
  or current_question_index is null
  or current_selected_answers is null
  or current_checked is null
  or current_correct is null;

alter table public.quiz_attempts alter column status set default 'in_progress';
alter table public.quiz_attempts alter column status set not null;
alter table public.quiz_attempts alter column current_question_index set default 0;
alter table public.quiz_attempts alter column current_question_index set not null;
alter table public.quiz_attempts alter column current_selected_answers set default '{}';
alter table public.quiz_attempts alter column current_selected_answers set not null;
alter table public.quiz_attempts alter column current_checked set default false;
alter table public.quiz_attempts alter column current_checked set not null;
alter table public.quiz_attempts alter column current_correct set default false;
alter table public.quiz_attempts alter column current_correct set not null;
alter table public.quiz_attempts alter column completed_at drop not null;

create unique index if not exists quiz_attempts_one_in_progress_per_set
  on public.quiz_attempts (user_id, set_id)
  where status = 'in_progress';

-- Mock exams: a timed attempt over questions drawn from every set.
alter table public.quiz_attempts add column if not exists kind text not null default 'practice';
alter table public.quiz_attempts add column if not exists question_ids text[];
alter table public.quiz_attempts add column if not exists expires_at timestamptz;
alter table public.quiz_attempts add column if not exists flagged_question_ids text[] not null default '{}';
alter table public.quiz_attempts alter column set_id drop not null;

do $$
begin
  alter table public.quiz_attempts
    add constraint quiz_attempts_kind_check check (kind in ('practice', 'mock'));
exception when duplicate_object then null;
end $$;

do $$
begin
  alter table public.quiz_attempts
    add constraint quiz_attempts_set_matches_kind check ((kind = 'practice') = (set_id is not null));
exception when duplicate_object then null;
end $$;

create unique index if not exists quiz_attempts_one_mock_in_progress
  on public.quiz_attempts (user_id)
  where kind = 'mock' and status = 'in_progress';

alter table public.question_sets enable row level security;
alter table public.questions enable row level security;
alter table public.answer_keys enable row level security;
alter table public.quiz_attempts enable row level security;
alter table public.quiz_answers enable row level security;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  role text not null default 'student' check (role in ('student', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(nullif(new.raw_user_meta_data->>'full_name', ''), split_part(coalesce(new.email, ''), '@', 1)),
    'student'
  )
  on conflict (id) do update set
    email = excluded.email,
    full_name = coalesce(public.profiles.full_name, excluded.full_name);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

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

alter table public.questions add column if not exists domain text;
alter table public.questions add column if not exists task_id text;

-- Keep profiles.email in step with the auth email after a user changes it.
create or replace function public.handle_user_email_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.profiles
  set email = new.email, updated_at = now()
  where id = new.id;
  return new;
end;
$$;

drop trigger if exists on_auth_user_email_changed on auth.users;
create trigger on_auth_user_email_changed
  after update of email on auth.users
  for each row
  when (old.email is distinct from new.email)
  execute function public.handle_user_email_change();

-- Row level security policies.
-- Students only read through policies. Every write that affects scoring goes through
-- the security definer functions below, so the browser can never set a score,
-- mark its own answer correct, or read an answer key before answering.

drop policy if exists "Users read their own profile" on public.profiles;
create policy "Users read their own profile"
  on public.profiles for select using (auth.uid() = id);

drop policy if exists "Users update their own profile" on public.profiles;
drop policy if exists "Users insert their own profile" on public.profiles;

drop policy if exists "Admins read all profiles" on public.profiles;
create policy "Admins read all profiles"
  on public.profiles for select using (public.is_admin());

drop policy if exists "Anyone can read question sets" on public.question_sets;
create policy "Anyone can read question sets"
  on public.question_sets for select using (true);
drop policy if exists "Anyone can read questions" on public.questions;
create policy "Anyone can read questions"
  on public.questions for select using (true);

drop policy if exists "Authenticated users can read answer keys" on public.answer_keys;
drop policy if exists "Admins read answer keys" on public.answer_keys;
create policy "Admins read answer keys"
  on public.answer_keys for select using (public.is_admin());

drop policy if exists "Users read their own attempts" on public.quiz_attempts;
create policy "Users read their own attempts"
  on public.quiz_attempts for select using (auth.uid() = user_id);
drop policy if exists "Admins read all attempts" on public.quiz_attempts;
create policy "Admins read all attempts"
  on public.quiz_attempts for select using (public.is_admin());
drop policy if exists "Users create their own attempts" on public.quiz_attempts;
drop policy if exists "Users update their own attempts" on public.quiz_attempts;
-- Column privileges below limit this policy to the saved position in a set.
create policy "Users update their own attempts"
  on public.quiz_attempts for update
  using (auth.uid() = user_id and status = 'in_progress')
  with check (auth.uid() = user_id and status = 'in_progress');
drop policy if exists "Users delete their own attempts" on public.quiz_attempts;

drop policy if exists "Users read their own answers" on public.quiz_answers;
-- Answers in an unfinished mock exam are hidden so correctness is not revealed early.
create policy "Users read their own answers"
  on public.quiz_answers for select using (
    exists (
      select 1 from public.quiz_attempts
      where quiz_attempts.id = quiz_answers.attempt_id
        and quiz_attempts.user_id = auth.uid()
        and (quiz_attempts.kind = 'practice' or quiz_attempts.status = 'completed')
    )
  );
drop policy if exists "Admins read all answers" on public.quiz_answers;
create policy "Admins read all answers"
  on public.quiz_answers for select using (public.is_admin());
drop policy if exists "Users create their own answers" on public.quiz_answers;
drop policy if exists "Users update their own answers" on public.quiz_answers;
drop policy if exists "Users delete their own answers" on public.quiz_answers;

-- Table privileges. Supabase grants everything to anon and authenticated by default,
-- so writes are revoked explicitly and only the saved position stays writable.
revoke insert, update, delete on public.profiles from anon, authenticated;
revoke insert, update, delete on public.question_sets from anon, authenticated;
revoke insert, update, delete on public.questions from anon, authenticated;
revoke all on public.answer_keys from anon;
revoke insert, update, delete on public.answer_keys from authenticated;
revoke insert, update, delete on public.quiz_attempts from anon, authenticated;
grant update (current_question_index, current_selected_answers, flagged_question_ids)
  on public.quiz_attempts to authenticated;
revoke insert, update, delete on public.quiz_answers from anon, authenticated;

-- Creates the caller's profile if the signup trigger missed it.
create or replace function public.ensure_profile()
returns public.profiles
language plpgsql
security definer
set search_path = ''
as $$
declare
  result public.profiles;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated' using errcode = '42501';
  end if;

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
  where users.id = auth.uid()
  on conflict (id) do nothing;

  select * into result from public.profiles where id = auth.uid();
  return result;
end;
$$;

-- Returns the caller's in-progress attempt for a set, or starts a new one.
-- Completed attempts are kept, so retaking a set preserves history.
create or replace function public.start_attempt(p_set_id text)
returns public.quiz_attempts
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user uuid := auth.uid();
  v_total integer;
  result public.quiz_attempts;
begin
  if v_user is null then
    raise exception 'Not authenticated' using errcode = '42501';
  end if;

  select count(*) into v_total from public.questions where set_id = p_set_id;
  if v_total = 0 then
    raise exception 'Unknown question set %', p_set_id using errcode = 'P0002';
  end if;

  insert into public.quiz_attempts (
    user_id, set_id, score, total, started_at, status,
    current_question_index, current_selected_answers, current_checked, current_correct
  )
  values (v_user, p_set_id, 0, v_total, now(), 'in_progress', 0, '{}', false, false)
  on conflict (user_id, set_id) where status = 'in_progress' do nothing;

  select * into result
  from public.quiz_attempts
  where user_id = v_user and set_id = p_set_id and kind = 'practice' and status = 'in_progress';
  return result;
end;
$$;

-- Grades one answer on the server, stores it once, and only then returns the
-- explanation. Resubmitting returns the first stored answer unchanged.
create or replace function public.submit_answer(
  p_attempt_id uuid,
  p_question_id text,
  p_selected text[]
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_attempt public.quiz_attempts;
  v_question public.questions;
  v_key public.answer_keys;
  v_answer public.quiz_answers;
  v_selected text[];
  v_correct text[];
begin
  select * into v_attempt
  from public.quiz_attempts
  where id = p_attempt_id and user_id = auth.uid()
  for update;
  if not found then
    raise exception 'Attempt not found' using errcode = 'P0002';
  end if;
  if v_attempt.kind <> 'practice' then
    raise exception 'Mock exam answers are saved with save_mock_answer' using errcode = 'P0001';
  end if;
  if v_attempt.status <> 'in_progress' then
    raise exception 'This attempt is already completed' using errcode = 'P0001';
  end if;

  select * into v_question
  from public.questions
  where id = p_question_id and set_id = v_attempt.set_id;
  if not found then
    raise exception 'Question is not part of this attempt' using errcode = 'P0002';
  end if;

  select * into v_key from public.answer_keys where question_id = p_question_id;
  if not found then
    raise exception 'Answer key unavailable for %', p_question_id using errcode = 'P0002';
  end if;

  select * into v_answer
  from public.quiz_answers
  where attempt_id = p_attempt_id and question_id = p_question_id;

  if not found then
    select coalesce(array_agg(distinct picked.key order by picked.key), '{}')
    into v_selected
    from unnest(coalesce(p_selected, '{}')) as picked(key);

    if cardinality(v_selected) <> v_question.required_answers then
      raise exception 'Select exactly % answer(s)', v_question.required_answers using errcode = '22023';
    end if;
    if exists (
      select 1 from unnest(v_selected) as picked(key)
      where not exists (
        select 1 from jsonb_array_elements(v_question.options) as options(option)
        where options.option->>'key' = picked.key
      )
    ) then
      raise exception 'Invalid option selected' using errcode = '22023';
    end if;

    select coalesce(array_agg(distinct expected.key order by expected.key), '{}')
    into v_correct
    from unnest(v_key.correct_answers) as expected(key);

    insert into public.quiz_answers (attempt_id, question_id, selected_answers, is_correct)
    values (p_attempt_id, p_question_id, v_selected, v_selected = v_correct)
    returning * into v_answer;

    update public.quiz_attempts
    set score = (
      select count(*) from public.quiz_answers
      where attempt_id = p_attempt_id and is_correct
    )
    where id = p_attempt_id;
  end if;

  return jsonb_build_object(
    'question_id', v_answer.question_id,
    'selected_answers', to_jsonb(v_answer.selected_answers),
    'is_correct', v_answer.is_correct,
    'answer', jsonb_build_object(
      'correct_answers', to_jsonb(v_key.correct_answers),
      'concept_tested', v_key.concept_tested,
      'why_these_selections_fit', v_key.why_these_selections_fit,
      'lesson_links', v_key.lesson_links,
      'option_rationales', v_key.option_rationales,
      'common_trap', v_key.common_trap,
      'official_documentation', v_key.official_documentation
    )
  );
end;
$$;

-- Answers and explanations for an attempt: answered questions, plus every drawn
-- question once a mock exam is submitted. Unfinished mock exams reveal only the
-- student's own selections.
create or replace function public.get_attempt_review(p_attempt_id uuid)
returns table (
  question_id text,
  selected_answers text[],
  is_correct boolean,
  answer jsonb
)
language sql
stable
security definer
set search_path = ''
as $$
  with target as (
    select attempts.*
    from public.quiz_attempts attempts
    where attempts.id = p_attempt_id
      and (attempts.user_id = auth.uid() or public.is_admin())
  ),
  items as (
    select answers.question_id
    from public.quiz_answers answers
    join target on answers.attempt_id = target.id
    union
    select drawn.question_id
    from target, unnest(target.question_ids) as drawn(question_id)
    where target.kind = 'mock' and target.status = 'completed'
  )
  select
    items.question_id,
    answers.selected_answers,
    case when target.kind = 'mock' and target.status <> 'completed' then null
      else coalesce(answers.is_correct, false) end,
    case when target.kind = 'mock' and target.status <> 'completed' then null else jsonb_build_object(
      'correct_answers', to_jsonb(keys.correct_answers),
      'concept_tested', keys.concept_tested,
      'why_these_selections_fit', keys.why_these_selections_fit,
      'lesson_links', keys.lesson_links,
      'option_rationales', keys.option_rationales,
      'common_trap', keys.common_trap,
      'official_documentation', keys.official_documentation
    ) end
  from items
  cross join target
  left join public.quiz_answers answers
    on answers.attempt_id = target.id and answers.question_id = items.question_id
  left join public.answer_keys keys on keys.question_id = items.question_id;
$$;

-- Marks an attempt complete once every question has a stored answer.
create or replace function public.complete_attempt(p_attempt_id uuid)
returns public.quiz_attempts
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_attempt public.quiz_attempts;
  v_answered integer;
  v_correct integer;
begin
  select * into v_attempt
  from public.quiz_attempts
  where id = p_attempt_id and user_id = auth.uid()
  for update;
  if not found then
    raise exception 'Attempt not found' using errcode = 'P0002';
  end if;
  if v_attempt.kind <> 'practice' then
    raise exception 'Use finish_mock_exam for mock exams' using errcode = 'P0001';
  end if;
  if v_attempt.status = 'completed' then
    return v_attempt;
  end if;

  select count(*), count(*) filter (where is_correct)
  into v_answered, v_correct
  from public.quiz_answers
  where attempt_id = p_attempt_id;

  if v_answered < v_attempt.total then
    raise exception 'Answer every question before finishing (% of %)', v_answered, v_attempt.total
      using errcode = 'P0001';
  end if;

  update public.quiz_attempts
  set
    status = 'completed',
    score = v_correct,
    completed_at = now(),
    current_selected_answers = '{}',
    current_checked = false,
    current_correct = false
  where id = p_attempt_id
  returning * into v_attempt;
  return v_attempt;
end;
$$;

-- Attempt list with answered and correct counts. p_all returns every user's
-- attempts for admins; everyone else only ever sees their own.
drop function if exists public.attempt_summaries(boolean);
create function public.attempt_summaries(p_all boolean default false)
returns table (
  id uuid,
  user_id uuid,
  set_id text,
  kind text,
  score integer,
  total integer,
  answered_count integer,
  started_at timestamptz,
  completed_at timestamptz,
  status text,
  current_question_index integer
)
language sql
stable
security definer
set search_path = ''
as $$
  select
    attempts.id,
    attempts.user_id,
    attempts.set_id,
    attempts.kind,
    case
      when attempts.status = 'completed' then attempts.score
      when attempts.kind = 'mock' then 0
      else coalesce(counts.correct, 0)
    end,
    attempts.total,
    coalesce(counts.answered, 0),
    attempts.started_at,
    attempts.completed_at,
    attempts.status,
    attempts.current_question_index
  from public.quiz_attempts attempts
  left join lateral (
    select
      count(*)::integer as answered,
      (count(*) filter (where answers.is_correct))::integer as correct
    from public.quiz_answers answers
    where answers.attempt_id = attempts.id
  ) counts on true
  where case when p_all then public.is_admin() else attempts.user_id = auth.uid() end
  order by coalesce(attempts.completed_at, attempts.started_at) desc, attempts.id;
$$;

-- Answered and correct counts per user and exam domain, across all attempts.
create or replace function public.domain_performance(p_all boolean default false)
returns table (
  user_id uuid,
  domain text,
  answered integer,
  correct integer
)
language sql
stable
security definer
set search_path = ''
as $$
  select
    attempts.user_id,
    questions.domain,
    count(*)::integer,
    (count(*) filter (where answers.is_correct))::integer
  from public.quiz_answers answers
  join public.quiz_attempts attempts on attempts.id = answers.attempt_id
  join public.questions questions on questions.id = answers.question_id
  where questions.domain is not null
    and (attempts.kind = 'practice' or attempts.status = 'completed')
    and case when p_all then public.is_admin() else attempts.user_id = auth.uid() end
  group by attempts.user_id, questions.domain
  order by attempts.user_id, questions.domain;
$$;


-- Starts (or resumes) a 65-question, 90-minute mock exam weighted like the exam
-- guide: 16, 19, 22, and 8 questions from Domains 1-4. Questions the student
-- has not answered before are preferred.
create or replace function public.start_mock_exam()
returns public.quiz_attempts
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user uuid := auth.uid();
  v_ids text[];
  result public.quiz_attempts;
begin
  if v_user is null then
    raise exception 'Not authenticated' using errcode = '42501';
  end if;

  select * into result
  from public.quiz_attempts
  where user_id = v_user and kind = 'mock' and status = 'in_progress';
  if found then
    return result;
  end if;

  with seen as (
    select distinct answers.question_id
    from public.quiz_answers answers
    join public.quiz_attempts attempts on attempts.id = answers.attempt_id
    where attempts.user_id = v_user
  ),
  quota(domain, wanted) as (
    values ('1', 16), ('2', 19), ('3', 22), ('4', 8)
  ),
  ranked as (
    select
      questions.id,
      questions.domain,
      row_number() over (
        partition by questions.domain
        order by (seen.question_id is not null), random()
      ) as position
    from public.questions questions
    join public.answer_keys keys on keys.question_id = questions.id
    left join seen on seen.question_id = questions.id
  )
  select array_agg(ranked.id order by random())
  into v_ids
  from ranked
  join quota on quota.domain = ranked.domain
  where ranked.position <= quota.wanted;

  if coalesce(cardinality(v_ids), 0) <> 65 then
    raise exception 'Not enough questions with exam domains; run npm run seed-supabase' using errcode = 'P0001';
  end if;

  insert into public.quiz_attempts (
    user_id, set_id, kind, score, total, started_at, expires_at, status, question_ids,
    current_question_index, current_selected_answers, current_checked, current_correct
  )
  values (
    v_user, null, 'mock', 0, 65, now(), now() + interval '90 minutes', 'in_progress', v_ids,
    0, '{}', false, false
  )
  on conflict (user_id) where kind = 'mock' and status = 'in_progress' do nothing;

  select * into result
  from public.quiz_attempts
  where user_id = v_user and kind = 'mock' and status = 'in_progress';
  return result;
end;
$$;

-- Saves (or clears) a mock exam answer. Correctness is stored but not returned.
create or replace function public.save_mock_answer(
  p_attempt_id uuid,
  p_question_id text,
  p_selected text[]
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_attempt public.quiz_attempts;
  v_question public.questions;
  v_selected text[];
  v_correct text[];
begin
  select * into v_attempt
  from public.quiz_attempts
  where id = p_attempt_id and user_id = auth.uid() and kind = 'mock'
  for update;
  if not found then
    raise exception 'Mock exam not found' using errcode = 'P0002';
  end if;
  if v_attempt.status <> 'in_progress' then
    raise exception 'This mock exam is already submitted' using errcode = 'P0001';
  end if;
  -- A short grace period absorbs network delay at the deadline.
  if now() > v_attempt.expires_at + interval '1 minute' then
    raise exception 'Time is up for this mock exam' using errcode = 'P0001';
  end if;
  if not (p_question_id = any(v_attempt.question_ids)) then
    raise exception 'Question is not part of this mock exam' using errcode = 'P0002';
  end if;

  select * into v_question from public.questions where id = p_question_id;

  select coalesce(array_agg(distinct picked.key order by picked.key), '{}')
  into v_selected
  from unnest(coalesce(p_selected, '{}')) as picked(key);

  if cardinality(v_selected) = 0 then
    delete from public.quiz_answers
    where attempt_id = p_attempt_id and question_id = p_question_id;
    return;
  end if;
  if cardinality(v_selected) > v_question.required_answers then
    raise exception 'Select at most % answer(s)', v_question.required_answers using errcode = '22023';
  end if;
  if exists (
    select 1 from unnest(v_selected) as picked(key)
    where not exists (
      select 1 from jsonb_array_elements(v_question.options) as options(option)
      where options.option->>'key' = picked.key
    )
  ) then
    raise exception 'Invalid option selected' using errcode = '22023';
  end if;

  select coalesce(array_agg(distinct expected.key order by expected.key), '{}')
  into v_correct
  from public.answer_keys keys, unnest(keys.correct_answers) as expected(key)
  where keys.question_id = p_question_id;

  insert into public.quiz_answers (attempt_id, question_id, selected_answers, is_correct)
  values (p_attempt_id, p_question_id, v_selected, v_selected = v_correct)
  on conflict (attempt_id, question_id) do update
  set selected_answers = excluded.selected_answers, is_correct = excluded.is_correct;
end;
$$;

-- Submits a mock exam (or closes one whose time ran out) and scores it.
-- Unanswered questions count as incorrect.
create or replace function public.finish_mock_exam(p_attempt_id uuid)
returns public.quiz_attempts
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_attempt public.quiz_attempts;
begin
  select * into v_attempt
  from public.quiz_attempts
  where id = p_attempt_id and user_id = auth.uid() and kind = 'mock'
  for update;
  if not found then
    raise exception 'Mock exam not found' using errcode = 'P0002';
  end if;
  if v_attempt.status = 'completed' then
    return v_attempt;
  end if;

  update public.quiz_attempts
  set
    status = 'completed',
    score = (
      select count(*) from public.quiz_answers
      where attempt_id = p_attempt_id and is_correct and question_id = any(v_attempt.question_ids)
    ),
    completed_at = least(now(), v_attempt.expires_at),
    current_selected_answers = '{}'
  where id = p_attempt_id
  returning * into v_attempt;
  return v_attempt;
end;
$$;

revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.handle_user_email_change() from public, anon, authenticated;
revoke execute on function public.ensure_profile() from public, anon;
revoke execute on function public.start_attempt(text) from public, anon;
revoke execute on function public.submit_answer(uuid, text, text[]) from public, anon;
revoke execute on function public.get_attempt_review(uuid) from public, anon;
revoke execute on function public.complete_attempt(uuid) from public, anon;
revoke execute on function public.attempt_summaries(boolean) from public, anon;
revoke execute on function public.domain_performance(boolean) from public, anon;
revoke execute on function public.start_mock_exam() from public, anon;
revoke execute on function public.save_mock_answer(uuid, text, text[]) from public, anon;
revoke execute on function public.finish_mock_exam(uuid) from public, anon;
grant execute on function public.ensure_profile() to authenticated;
grant execute on function public.start_attempt(text) to authenticated;
grant execute on function public.submit_answer(uuid, text, text[]) to authenticated;
grant execute on function public.get_attempt_review(uuid) to authenticated;
grant execute on function public.complete_attempt(uuid) to authenticated;
grant execute on function public.attempt_summaries(boolean) to authenticated;
grant execute on function public.domain_performance(boolean) to authenticated;
grant execute on function public.start_mock_exam() to authenticated;
grant execute on function public.save_mock_answer(uuid, text, text[]) to authenticated;
grant execute on function public.finish_mock_exam(uuid) to authenticated;
