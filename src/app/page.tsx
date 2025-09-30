"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const [colleges, setColleges] = useState(0);
  const [students, setStudents] = useState(0);
  const [events, setEvents] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Counter animation
  useEffect(() => {
    let c = 0, s = 0, e = 0;
    const interval = setInterval(() => {
      if (c < 100) c++;
      if (s < 10000) s += 200;
      if (e < 500) e += 10;
      setColleges(c);
      setStudents(s);
      setEvents(e);
      if (c >= 100 && s >= 10000 && e >= 500) clearInterval(interval);
    }, 40);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 text-gray-800 relative overflow-hidden">
      {/* Animated Background */}
      <motion.div
        className="absolute top-0 -left-40 w-[500px] h-[500px] bg-gradient-to-r from-blue-300 to-pink-300 rounded-full blur-3xl opacity-30"
        animate={{ y: [0, 30, 0], x: [0, 20, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-0 -right-40 w-[500px] h-[500px] bg-gradient-to-r from-pink-300 to-purple-300 rounded-full blur-3xl opacity-30"
        animate={{ y: [0, -30, 0], x: [0, -20, 0] }}
        transition={{ duration: 12, repeat: Infinity }}
      />

      {/* Navbar */}
      <header className="flex items-center justify-between px-6 md:px-12 py-4 bg-white/70 backdrop-blur-lg sticky top-0 z-50 shadow-md">
        <div className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent tracking-wide">
          Vidyarth
        </div>
        <nav className="hidden md:flex gap-8 text-gray-700 font-medium">
          <Link href="#features" className="hover:text-blue-600">Features</Link>
          <Link href="#testimonials" className="hover:text-blue-600">Testimonials</Link>
          <Link href="#faq" className="hover:text-blue-600">FAQ</Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between px-8 md:px-16 lg:px-24 py-24 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-xl text-center md:text-left"
        >
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight text-gray-900">
            One Platform.{" "}
            <span className="bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent">
              Every College Event.
            </span>
          </h1>
          <p className="mt-6 text-lg text-gray-600">
            Discover, create, and celebrate college events like never before.
            Karyasetu brings students and colleges together on a single stage.
          </p>
          <div className="mt-8">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/sign-in")}
              className="bg-gradient-to-r from-blue-600 to-pink-600 hover:from-blue-700 hover:to-pink-700 text-white px-8 py-3 rounded-full shadow-xl transition-all"
            >
              🚀 Get Started Free
            </motion.button>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="mt-12 md:mt-0"
        >
          <Image
            src="/karyasetu_main.png"
            alt="Karyasetu Logo"
            width={400}
            height={400}
            className="drop-shadow-2xl"
          />
        </motion.div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-white/80 text-center backdrop-blur-lg relative z-10">
        <h2 className="text-3xl font-bold mb-12 bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent">
          Trusted by Students Across India
        </h2>
        <div className="flex justify-center gap-12 flex-wrap">
          <Stat number={`${colleges}+`} label="Colleges" color="blue" />
          <Stat number={`${students.toLocaleString()}+`} label="Students" color="pink" />
          <Stat number={`${events}+`} label="Events" color="purple" />
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-gradient-to-r from-blue-50 to-pink-50 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent">
            Why Karyasetu?
          </h2>
        </div>
        <div className="grid gap-10 px-8 md:px-16 lg:px-24 md:grid-cols-2 lg:grid-cols-4">
          {[
            { title: "📅 Manage Events in Minutes", desc: "Create and update your college events effortlessly." },
            { title: "🤝 Team Up Across Colleges", desc: "Find and collaborate with peers from different campuses." },
            { title: "🎓 Discover Every Fest", desc: "Stay updated with cultural & tech fests near you." },
            { title: "🏆 Celebrate Together", desc: "Share memories, results, and wins with the community." },
          ].map((f, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.08 }}
              className="p-6 bg-white rounded-2xl shadow-lg transition-transform hover:shadow-2xl"
            >
              <h3 className="text-xl font-semibold">{f.title}</h3>
              <p className="text-gray-600 mt-2">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 bg-white relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent">
            Loved by Students
          </h2>
        </div>
        <div className="grid gap-8 px-8 md:px-16 lg:px-24 md:grid-cols-3">
          {[
            { name: "Priya, XYZ College", text: "Karyasetu made event management so easy! Our fest saw 3x participation.", img: "/avatar.png" },
            { name: "Rahul, ABC University", text: "Finally a platform that connects students across colleges. I found my hackathon team here!", img: "/avatar.png" },
            { name: "Simran, DEF Institute", text: "Super smooth and fun to use. It feels like Instagram for college events!", img: "/avatar.png" },
          ].map((t, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="p-6 border rounded-2xl shadow-lg bg-gradient-to-br from-blue-50 to-pink-50"
            >
              <div className="flex items-center gap-3 mb-3">
                <Image src={t.img} alt={t.name} width={48} height={48} className="rounded-full" />
                <div>
                  <p className="font-semibold text-blue-600">{t.name}</p>
                  <p className="text-yellow-500 text-sm">★★★★★</p>
                </div>
              </div>
              <p className="text-gray-700 italic">“{t.text}”</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 bg-gray-50 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent">
            Frequently Asked Questions
          </h2>
        </div>
        <div className="max-w-3xl mx-auto space-y-4 px-6">
          {[
            { q: "Is Karyasetu free?", a: "Yes, it’s 100% free for students and colleges." },
            { q: "Can I join events from other colleges?", a: "Absolutely! That’s the fun part." },
            { q: "What if my college isn’t listed?", a: "You can add it in minutes and start hosting." },
          ].map((faq, i) => (
            <motion.div
              key={i}
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
              className="p-6 bg-white rounded-xl shadow-md border cursor-pointer hover:shadow-lg transition-all"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-gray-900">{faq.q}</h3>
                <motion.span
                  animate={{ rotate: openFaq === i ? 180 : 0 }}
                  className="text-2xl font-bold text-blue-600"
                >
                  {openFaq === i ? "−" : "+"}
                </motion.span>
              </div>
              {openFaq === i && <p className="text-gray-600 mt-2">{faq.a}</p>}
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-pink-600 text-center text-white relative z-10">
        <h2 className="text-4xl font-bold">🚀 Ready to explore college events?</h2>
        <p className="mt-4 text-lg">Join thousands of students making events unforgettable with Karyasetu.</p>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push("/sign-in")}
          className="mt-8 bg-white text-blue-600 font-semibold px-10 py-3 rounded-full shadow-lg hover:bg-gray-100 transition"
        >
          Get Started Free →
        </motion.button>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-10 text-center space-y-3">
        <p className="text-sm">© {new Date().getFullYear()} Karyasetu. All rights reserved.</p>
        <div className="flex justify-center gap-6 text-sm">
          <Link href="/about" className="hover:text-white">About</Link>
          <Link href="/contact" className="hover:text-white">Contact</Link>
          <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
        </div>
      </footer>
    </main>
  );
}

// Stat Component
function Stat({ number, label, color }: { number: string; label: string; color: string }) {
  return (
    <motion.div whileHover={{ scale: 1.15 }} className="transition-transform">
      <div className={`text-5xl font-extrabold text-${color}-600 drop-shadow-lg`}>{number}</div>
      <p className="text-gray-600 mt-2">{label}</p>
    </motion.div>
  );
}
