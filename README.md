# Green Pastures

A full-stack Christian/Godly content blog built with Next.js and Supabase, deployed at [greenpastureshub.com](https://greenpastureshub.com).

---

## About

Green Pastures is a faith-based blog platform where readers can explore Christian content across various categories, engage with posts through comments, and subscribe to the newsletter for updates.

---

## Features

- **Blog Homepage** — Posts fetched from Supabase with filtering by category, sorting, and search
- **Individual Post Pages** — Full post view with SEO metadata, view tracking, and rich content
- **View Tracking** — localStorage prevents duplicate view counts per user per post
- **Newsletter Subscription** — Email subscription with duplicate prevention
- **Admin System** — Protected admin login and post creation with React Quill rich text editor
- **User Authentication** — Register and login with email/password, display name, and email confirmation
- **Comment System** — Authenticated users can post, delete, and like comments on posts
- **Redirect After Login** — Users are returned to the post they came from after logging in
- **Responsive Design** — Mobile-friendly layout with animated scroll effects

---

## Tech Stack

| Technology | Purpose |
|---|---|
| Next.js 16.2.6 (App Router) | Frontend framework |
| React 19 | UI library |
| Supabase (PostgreSQL) | Database and authentication |
| Vercel | Deployment and hosting |
| React Quill | Rich text editor for admin |
| AOS (Animate on Scroll) | Scroll animations |

---

## Database Tables

| Table | Purpose |
|---|---|
| `posts` | Blog articles with metadata |
| `subscribers` | Newsletter email subscribers |
| `profiles` | Public user display names |
| `comments` | Post comments by authenticated users |
| `comment_likes` | Likes on comments |

---

## Getting Started

### Prerequisites

- Node.js v22+
- A Supabase project with the tables listed above

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Xlr8th/green-pastureshub.git
cd green-pastures
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_KEY=your_supabase_anon_key
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```
src/
├── app/
│   ├── admin/          ← Admin login and post creation
│   ├── post/[slug]/    ← Individual post pages
│   ├── login/          ← User authentication
│   ├── api/subscribe/  ← Newsletter API route
│   └── page.js         ← Homepage
├── components/         ← Reusable UI components
└── lib/
    ├── supabase.js     ← Supabase client
    └── AuthContext.jsx ← Global auth state
```

---

## 💡 Product Decisions

A few intentional design choices worth noting:

- **No email confirmation on signup** — Reduces friction for new readers, keeping the onboarding experience smooth
- **Display names instead of emails** — Protects user privacy in public comment sections
- **Post-login redirect** — Users are returned to the article they were reading after authenticating, rather than a generic dashboard

---

## Deployment

The project is deployed on Vercel. Environment variables are configured in the Vercel dashboard.

Live site: [greenpastureshub.com](https://greenpastureshub.com)

---

## Author

Built and designed by **Xlr8th**
GitHub: [@Xlr8th](https://github.com/Xlr8th)

---

## License

This project is private and built for a specific client. The codebase is shared publicly for portfolio purposes.
