"use client";
import { motion } from "framer-motion";
import { BookOpen, MapPin, Users, Recycle, Heart, TrendingUp, Star, Shield } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type GenericData = any;

export default function VidyarthHome() {
  const router = useRouter();
  const [activeUsers, setActiveUsers] = useState(0);
  const [itemsShared, setItemsShared] = useState(0);
  const [moneySaved, setMoneySaved] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Counter animation
  useEffect(() => {
    let u = 0, i = 0, m = 0;
    const interval = setInterval(() => {
      if (u < 2500) u += 50;
      if (i < 8000) i += 160;
      if (m < 500000) m += 10000;
      setActiveUsers(u);
      setItemsShared(i);
      setMoneySaved(m);
      if (u >= 2500 && i >= 8000 && m >= 500000) clearInterval(interval);
    }, 40);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 text-gray-800 relative overflow-hidden">
      {/* Animated Background Blobs */}
      <motion.div
        className="absolute top-0 -left-40 w-[600px] h-[600px] bg-gradient-to-r from-emerald-300 to-teal-300 rounded-full blur-3xl opacity-20"
        animate={{ y: [0, 40, 0], x: [0, 30, 0] }}
        transition={{ duration: 15, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-0 -right-40 w-[600px] h-[600px] bg-gradient-to-r from-blue-300 to-indigo-300 rounded-full blur-3xl opacity-20"
        animate={{ y: [0, -40, 0], x: [0, -30, 0] }}
        transition={{ duration: 18, repeat: Infinity }}
      />

      {/* Navbar */}
      <header className="flex items-center justify-between px-6 md:px-12 py-5 bg-white/80 backdrop-blur-xl sticky top-0 z-50 shadow-sm border-b border-gray-100">
        <div className="flex items-center gap-3">
          <Image src="/Vidyarth_single.png" alt="Vidyarth Logo" width={45} height={45} />
          <span className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Vidyarth
          </span>
        </div>
        <nav className="hidden md:flex gap-8 text-gray-700 font-medium">
          <a href="#features" className="hover:text-emerald-600 transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-emerald-600 transition-colors">How It Works</a>
          <a href="#impact" className="hover:text-emerald-600 transition-colors">Impact</a>
          <a href="#faq" className="hover:text-emerald-600 transition-colors">FAQ</a>
        </nav>
        <Link
        href="/sign-up"
        className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-6 py-2 rounded-full font-semibold shadow-lg transition-all">
          Join Now
        </Link>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between px-8 md:px-16 lg:px-24 py-20 md:py-32 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl text-center md:text-left"
        >
          {/* <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-block mb-4 px-4 py-2 bg-emerald-100 rounded-full text-emerald-700 font-semibold text-sm"
          >
            🌱 Share Karo, Care Karo!
          </motion.div> */}
          <Image src="/Vidyarth_main.png" alt="Vidyarth Logo" width={200} height={60} className="mb-6 mx-auto md:mx-0" />
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight text-gray-900 mb-6">
            Education Made{" "}
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 bg-clip-text text-transparent">
              Affordable & Sustainable
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            A community-driven platform where students share, exchange, borrow, rent, and sell academic resources. 
            Because learning shouldn&apos;t be limited by the cost of books and materials.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/sign-in")}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-4 rounded-full shadow-2xl text-lg font-semibold transition-all flex items-center justify-center gap-2"
            >
              <Heart className="w-5 h-5" />
              Start Sharing
            </motion.button>
            {/* <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white hover:bg-gray-50 text-gray-800 px-8 py-4 rounded-full shadow-xl text-lg font-semibold transition-all border-2 border-gray-200"
            >
              Watch Demo
            </motion.button> */}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="mt-12 md:mt-0 relative"
        >
          <div className="relative w-[400px] h-[400px]">
            {/* Floating Cards Animation */}
            <motion.div
              animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute top-0 right-0 w-48 h-32 bg-white rounded-2xl shadow-2xl p-4 border border-gray-100"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-emerald-600" />
                </div>
                <span className="font-semibold text-sm">Physics Textbook</span>
              </div>
              <p className="text-xs text-gray-500">Available for exchange</p>
              <div className="mt-2 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-gray-400" />
                <span className="text-xs text-gray-400">2.5 km away</span>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
              transition={{ duration: 5, repeat: Infinity, delay: 1 }}
              className="absolute bottom-0 left-0 w-48 h-32 bg-white rounded-2xl shadow-2xl p-4 border border-gray-100"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Recycle className="w-4 h-4 text-blue-600" />
                </div>
                <span className="font-semibold text-sm">Scientific Calculator</span>
              </div>
              <p className="text-xs text-gray-500">Available for rent</p>
              <div className="mt-2 flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                <span className="text-xs text-gray-600">4.9 rating</span>
              </div>
            </motion.div>

            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-2xl"
            >
              <Users className="w-16 h-16 text-white" />
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-emerald-600 to-teal-600 text-white relative z-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-8 text-center">
          <StatCard number={activeUsers.toLocaleString()} label="Active Students" icon="+" />
          <StatCard number={itemsShared.toLocaleString()} label="Items Shared" icon="+" />
          <StatCard number={`₹${(moneySaved / 1000).toFixed(0)}K`} label="Money Saved" icon="+" />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-8 md:px-16 lg:px-24 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Why Choose Vidyarth?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your all-in-one platform for academic resource sharing with sustainable impact
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
          {[
            {
              icon: <MapPin className="w-8 h-8" />,
              title: "Location-Aware Search",
              desc: "Find resources from students near you with our map-based interface",
              color: "emerald"
            },
            {
              icon: <Recycle className="w-8 h-8" />,
              title: "Multiple Trade Options",
              desc: "Lend, rent, share, exchange, or sell - choose what works for you",
              color: "teal"
            },
            {
              icon: <Shield className="w-8 h-8" />,
              title: "Secure & Verified",
              desc: "Institution-based authentication and review system for safety",
              color: "blue"
            },
            {
              icon: <Heart className="w-8 h-8" />,
              title: "Build Community",
              desc: "Connect with fellow students and foster a supportive learning environment",
              color: "pink"
            },
            {
              icon: <TrendingUp className="w-8 h-8" />,
              title: "Track Contributions",
              desc: "Get reminders and track your lending history and impact",
              color: "indigo"
            },
            {
              icon: <BookOpen className="w-8 h-8" />,
              title: "Beyond Books",
              desc: "Share textbooks, stationery, calculators, and all academic essentials",
              color: "purple"
            }
          ].map((feature, i) => (
            <FeatureCard key={i} {...feature} index={i} />
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-gradient-to-br from-gray-50 to-emerald-50 relative z-10">
        <div className="max-w-6xl mx-auto px-8">
          <h2 className="text-5xl font-bold text-center mb-16 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "1", title: "Sign Up", desc: "Create your account with institution verification" },
              { step: "2", title: "List or Search", desc: "Post items you want to share or find what you need nearby" },
              { step: "3", title: "Connect & Share", desc: "Chat, agree on terms, and make education more affordable" }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="text-center"
              >
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-xl">
                  {item.step}
                </div>
                <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section id="impact" className="py-24 px-8 md:px-16 lg:px-24 relative z-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl font-bold text-center mb-16 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Our Impact on SDGs
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { sdg: "SDG 4", title: "Quality Education", desc: "Making education accessible and affordable for all students" },
              { sdg: "SDG 11", title: "Sustainable Cities", desc: "Building inclusive and resilient student communities" },
              { sdg: "SDG 12", title: "Responsible Consumption", desc: "Promoting reuse and sustainable resource patterns" }
            ].map((impact, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100"
              >
                <div className="text-emerald-600 font-bold text-lg mb-2">{impact.sdg}</div>
                <h3 className="text-2xl font-bold mb-3">{impact.title}</h3>
                <p className="text-gray-600">{impact.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 bg-gradient-to-br from-emerald-50 to-white relative z-10">
        <div className="max-w-4xl mx-auto px-8">
          <h2 className="text-5xl font-bold text-center mb-16 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {[
              { q: "Is Vidyarth free to use?", a: "Yes! Vidyarth is completely free for all students. Our mission is to make education more accessible." },
              { q: "How does the verification work?", a: "We use Clerk authentication with institution-based verification to ensure all users are genuine students." },
              { q: "What if someone doesn't return my item?", a: "We have reminders, review systems, and admin support to handle disputes. Always communicate pickup/return dates clearly." },
              { q: "Can I use Vidyarth for items other than books?", a: "Absolutely! Share textbooks, stationery, calculators, lab equipment, and any academic resource." },
              { q: "How do I find items near me?", a: "Our map-based interface shows resources available near your location with distance indicators." }
            ].map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 cursor-pointer hover:shadow-xl transition-all"
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-lg text-gray-900">{faq.q}</h3>
                  <motion.div
                    animate={{ rotate: openFaq === i ? 180 : 0 }}
                    className="text-emerald-600 text-2xl font-bold"
                  >
                    {openFaq === i ? "−" : "+"}
                  </motion.div>
                </div>
                {openFaq === i && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="text-gray-600 mt-4"
                  >
                    {faq.a}
                  </motion.p>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 text-center text-white relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto px-8"
        >
          <h2 className="text-5xl font-bold mb-6">Ready to Make Education More Affordable?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of students building a sustainable, sharing community. Start today!
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-emerald-600 font-bold px-12 py-4 rounded-full shadow-2xl text-lg hover:bg-gray-50 transition-all"
          >
            Get Started Free →
          </motion.button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-6xl mx-auto px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Image src="/Vidyarth_single.png" alt="Vidyarth Logo" width={45} height={45} />
                <span className="text-2xl font-bold text-white">Vidyarth</span>
              </div>
              <p className="text-sm">Share Karo, Care Karo!</p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-3">Platform</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Safety</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-3">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Team</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-3">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community Guidelines</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>© 2025 Vidyarth. Developed by Team Nava. All rights reserved.</p>
            <p className="mt-2 text-xs text-gray-500">Mentored by Prof. Subhabrata Sengupta & Prof. Dr. Rupayan Das</p>
          </div>
        </div>
      </footer>
    </main>
  );
}

function StatCard({ number, label, icon }: { number: string; label: string; icon: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center"
    >
      <div className="text-5xl md:text-6xl font-extrabold mb-2">{number}{icon}</div>
      <div className="text-lg opacity-90">{label}</div>
    </motion.div>
  );
}

function FeatureCard({ icon, title, desc, color, index }: GenericData) {
  const colorMap: GenericData = {
    emerald: "from-emerald-500 to-emerald-600",
    teal: "from-teal-500 to-teal-600",
    blue: "from-blue-500 to-blue-600",
    pink: "from-pink-500 to-pink-600",
    indigo: "from-indigo-500 to-indigo-600",
    purple: "from-purple-500 to-purple-600"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.05 }}
      className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all"
    >
      <div className={`w-16 h-16 mb-6 bg-gradient-to-br ${colorMap[color]} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-3 text-gray-900">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{desc}</p>
    </motion.div>
  );
}