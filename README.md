# 🎓 Vidyarth - Share Karo, Care Karo!

**A community-driven platform where students share, exchange, borrow, rent, and sell academic resources.**

Vidyarth is revolutionizing how students access educational materials by creating a sustainable, affordable, and localized academic support system. No more expensive textbooks gathering dust—share resources, save money, and build a thriving student community.

## 🌟 Overview

Vidyarth addresses critical challenges in the academic ecosystem:
- **High Cost of Education**: Make learning affordable by reusing and sharing resources
- **Resource Wastage**: Give unused educational materials a second life
- **Lack of Community**: Connect students across campuses for mutual support
- **Environmental Impact**: Promote sustainable consumption through reuse

## ✨ Key Features

### 📍 Location-Aware Search
Find academic resources from students near you using our intelligent map-based interface with distance indicators.

### 🔄 Flexible Trade Options
- **Sell**: List items for sale at your price
- **Rent**: Rent out or rent items for a period
- **Lend**: Share freely with fellow students
- **Exchange**: Swap resources you need
- **Borrow**: Get what you need temporarily

### 🔒 Safe & Secure
- Institution-based verification via Clerk authentication
- User reviews and ratings system
- Admin support for dispute resolution
- Secure chat for communication

### 🔔 Smart Reminders
Automated notifications for pickup dates, return deadlines, and transaction updates.

### 📚 Beyond Books
Share textbooks, stationery, calculators, lab equipment, notes, and all academic essentials.

## 🎯 Mission & Impact

Vidyarth contributes to **UN Sustainable Development Goals**:

- **SDG 4 - Quality Education**: Democratizing access to educational tools
- **SDG 11 - Sustainable Cities**: Building inclusive, resilient student communities
- **SDG 12 - Responsible Consumption**: Promoting reuse and sustainable patterns

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Build Tool**: Turbopack

### Backend & Database
- **Database**: PostgreSQL with PostGIS for geolocation
- **ORM**: Prisma Client with Prisma Migrate
- **Authentication**: Clerk (RBAC with institution verification)

### Key Features Implementation
- **Maps**: Leaflet.js for interactive map display
- **Geolocation**: Browser Geolocation API + PostGIS
- **File Management**: Cloudinary for media uploads
- **Real-time Chat**: REST APIs with Prisma
- **Forms**: React Hook Form + Zod validation

### DevOps
- **Containerization**: Docker
- **Version Control**: Git + GitHub
- **Deployment**: Vercel
- **Testing**: ESLint + TypeScript + React Testing Library

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- PostgreSQL database setup
- Clerk account for authentication
- Cloudinary account for media storage

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/KartikTulsian/vidyarth.git
cd vidyarth
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/vidyarth"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
CLERK_SECRET_KEY=your_clerk_secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

4. **Run database migrations**
```bash
npx prisma migrate dev
```

5. **Start the development server**
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

6. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure
```
vidyarth/
├── app/                    # Next.js app router pages
├── components/             # Reusable React components
├── lib/                    # Utility functions and configs
├── prisma/                 # Database schema and migrations
├── public/                 # Static assets
├── styles/                 # Global styles
└── types/                  # TypeScript type definitions
```

## 🧪 Testing

Run tests with:
```bash
npm run test
# or
yarn test
```

Lint your code:
```bash
npm run lint
# or
yarn lint
```

## 📦 Building for Production
```bash
npm run build
npm start
```

## 🚢 Deployment

The easiest way to deploy Vidyarth is using [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Import your repository to Vercel
3. Configure environment variables
4. Deploy!

For detailed deployment instructions, see the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).

## 👥 Team

**Developed by IEM Software Engineering Lab (PCCCS594)**

- **Kartik Tulsian** (12023052004036) - Solution Architect & UI/UX Designer

**Mentored by:**
- Prof. Subhabrata Sengupta
- Prof. Dr. Rupayan Das

**Institution:** Institute of Engineering and Management

## 🤝 Contributing

We welcome contributions! Please feel free to submit pull requests or open issues for bugs and feature requests.

## 📄 License

This project is part of an academic curriculum at IEM and is subject to institutional guidelines.

## 📞 Contact & Support

For questions, support, or feedback:
- 📧 Email: [kartiktulsian@example.com]

---

**Made with ❤️ by students, for students**

*Share Karo, Care Karo! - Making education sustainable, one resource at a time.*