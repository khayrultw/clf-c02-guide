# Admin Tracking Wireframes

Companion to [ADMIN_TRACKING_PLAN.md](./ADMIN_TRACKING_PLAN.md). Layouts are low-fidelity; names and numbers are sample data.

Legend: `[text]` is a link or button, `▓` is a filled progress bar segment, `░` is an empty one, `—` means no data.

## 1. Shared layout (all admin pages)

```
┌──────────────────────────────────────────────────────────────────────────┐
│ CLF-C02 Study Guide   Learn  Review  Reference  Practice  Dashboard Admin│
├──────────────────────────────────────────────────────────────────────────┤
│ ADMIN DASHBOARD                                                          │
│ Student progress overview                                                │
│                                                                          │
│ ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐              │
│ │     10     │ │      5     │ │      4     │ │     57%    │              │
│ │  Students  │ │   Active   │ │ Completed  │ │  Overall   │              │
│ │            │ │  students  │ │  attempts  │ │  accuracy  │              │
│ └────────────┘ └────────────┘ └────────────┘ └────────────┘              │
│                                                                          │
│  [ Students ]  [ Sets ]          <- tabs, active tab underlined          │
│ ─────────────────────────────────────────────────────────────────────── │
│                                                                          │
│  (page content)                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

On mobile the four cards become a 2 x 2 grid and tables scroll horizontally.

## 2. Student list (`/admin/students`)

```
 Students
┌──────────────────────────────────────────────────────────────────────────┐
│ Student                          Overall accuracy   Weakest module       │
│                                  (email below name)                      │
├──────────────────────────────────────────────────────────────────────────┤
│ [Nur Jannah Mazlan]              86%                Cloud Concepts       │
│  workwithjannah@gmail.com        ▓▓▓▓▓▓▓▓▓░                              │
├──────────────────────────────────────────────────────────────────────────┤
│ [Muhammad Amirul Aiman bin Z.]   44%                Security and         │
│  muamirulaiman@gmail.com         ▓▓▓▓░░░░░░         Compliance           │
├──────────────────────────────────────────────────────────────────────────┤
│ [ABD HAFIZ B. ABD HALIM]         28%                Security and         │
│  hafizishalim@gmail.com          ▓▓░░░░░░░░         Compliance           │
├──────────────────────────────────────────────────────────────────────────┤
│ [khayrul Islam]                  —                  —                    │
│  khayrul@forward.edu.my                                                  │
└──────────────────────────────────────────────────────────────────────────┘
```

Notes:
- Email is a separate column on wide screens and sits under the name on narrow ones.
- Students with no completed attempt still appear, with `—`.
- The weakest module shows its accuracy, for example `Security and Compliance (25%)`.
- Clicking a student name opens the detail page.

## 3. Student detail (`/admin/students/:studentId`)

```
 [← Students]

 Nur Jannah Mazlan
 workwithjannah@gmail.com

┌────────────────────┐ ┌─────────────────────────┐
│        86%         │ │ Weakest module          │
│  Overall accuracy  │ │ Cloud Concepts (83%)    │
└────────────────────┘ └─────────────────────────┘

 Accuracy by domain
┌──────────────────────────────────────────────────────────────────────────┐
│ Domain                                  Correct / Total   Accuracy       │
├──────────────────────────────────────────────────────────────────────────┤
│ 1. Cloud Concepts                       10 / 12           83%            │
│                                                           ▓▓▓▓▓▓▓▓░░     │
│ 2. Security and Compliance              12 / 14           86%            │
│ 3. Cloud Technology and Services        15 / 17           88%            │
│ 4. Billing, Pricing, and Support         6 / 7            86%            │
└──────────────────────────────────────────────────────────────────────────┘

 Accuracy by set
┌──────────────────────────────────────────────────────────────────────────┐
│ Set                    Correct / Total   Accuracy   Completed            │
├──────────────────────────────────────────────────────────────────────────┤
│ Practice set 01        43 / 50           86%        11/21/2026, 6:39 PM  │
│ Practice set 02        —                 —          Not completed        │
│ ...                                                                      │
│ Mock exam              56 / 65           86%        11/25/2026, 1:54 PM  │
└──────────────────────────────────────────────────────────────────────────┘
```

Notes:
- The "Mock exam" row appears only if the student has a completed mock.
- Domain figures combine the latest practice attempts and the latest mock.
- A student with no completed attempts shows empty tables with a short message such as "No completed attempts yet."

## 4. Set list (`/admin/sets`)

```
 Sets
┌──────────────────────────────────────────────────────────────────────────┐
│ Set                                              Accuracy                │
├──────────────────────────────────────────────────────────────────────────┤
│ [Practice set 01]                                52%   ▓▓▓▓▓░░░░░        │
│ [Practice set 02]                                —                       │
│ [Practice set 03]                                —                       │
│ ...                                                                      │
└──────────────────────────────────────────────────────────────────────────┘
```

Notes:
- Only title and accuracy are shown.
- Sets nobody has completed show `—`.
- The mock exam is not listed here.
- Clicking a set title opens the set detail page.

## 5. Set detail (`/admin/sets/:setId`)

```
 [← Sets]

 Practice set 01

┌────────────────────┐ ┌─────────────────────────┐
│        52%         │ │          3              │
│ Set accuracy       │ │ Students completed      │
└────────────────────┘ └─────────────────────────┘

 Questions
┌──────────────────────────────────────────────────────────────────────────┐
│ No.  Title                                              Correct / Total  │
├──────────────────────────────────────────────────────────────────────────┤
│ 1    A company wants to move its servers to AWS and...   3 / 3           │
│ 2    Which AWS service provides on-demand object...      1 / 3           │
│ 3    A team needs to restrict access to resources...     0 / 3           │
│ ...                                                                      │
│ 50   Which pricing model offers the largest discount...  2 / 3           │
└──────────────────────────────────────────────────────────────────────────┘
```

Notes:
- Title is the question prompt, cut to about 80 characters with an ellipsis. The full prompt shows as a tooltip and in an expandable row.
- Correct / Total counts each student's latest completed attempt only.
- Sets with no completed attempts show `0 / 0` for every question.
- Rows are ordered by question number.

## 6. States

```
 Loading                        Error
┌─────────────────────────┐    ┌──────────────────────────────────────────┐
│      ( spinner )        │    │ Dashboard data could not be loaded.      │
│  Loading all progress...│    │ <error message>                          │
└─────────────────────────┘    └──────────────────────────────────────────┘

 Empty list                     Unknown student or set id
┌─────────────────────────┐    ┌──────────────────────────────────────────┐
│ No students yet.        │    │ Student not found.      [← Students]     │
└─────────────────────────┘    └──────────────────────────────────────────┘
```

## 7. Navigation map

```
/admin ──► /admin/students ──► /admin/students/:studentId
   │             ▲  tabs
   │             ▼
   └─────► /admin/sets ─────► /admin/sets/:setId
```

Each detail page has a back link to its list. The tabs switch between the two lists at any time.
