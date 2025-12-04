'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  const [activeFeature, setActiveFeature] = useState(0);

  const mvpFeatures = [
    {
      title: "Education Resource Library",
      description: "Access curated notes, videos, and practice exams from top students",
      icon: "📚",
      color: "from-blue-500 to-blue-600",
      details: ["1000+ curated resources", "Verified by faculty", "Subject-wise organization"]
    },
    {
      title: "Peer Tutoring Marketplace",
      description: "Offer or request tutoring sessions based on subjects and skill levels",
      icon: "👥",
      color: "from-green-500 to-green-600",
      details: ["Flexible scheduling", "Set your own rates", "All CS subjects covered"]
    },
    {
      title: "Smart Matching System",
      description: "AI-powered pairing with ideal tutors or study resources",
      icon: "🤖",
      color: "from-purple-500 to-purple-600",
      details: ["Personalized recommendations", "Skill level matching", "Learning style analysis"]
    },
    {
      title: "Virtual Classroom",
      description: "Interactive environment for real-time peer learning sessions",
      icon: "💻",
      color: "from-orange-500 to-orange-600",
      details: ["Live coding sessions", "Screen sharing", "Whiteboard collaboration"]
    },
    {
      title: "Rating & Reviews",
      description: "Feedback system for tutors, materials, and session quality",
      icon: "⭐",
      color: "from-yellow-500 to-yellow-600",
      details: ["Verified reviews", "Quality ratings", "Helpfulness scores"]
    },
    {
      title: "Learning Progress Tracker",
      description: "Performance metrics and learning milestones dashboard",
      icon: "📊",
      color: "from-indigo-500 to-indigo-600",
      details: ["Skill progression", "Achievement tracking", "Study analytics"]
    },
    {
      title: "Reward System",
      description: "Digital badges and tokens for top contributors and active learners",
      icon: "🏆",
      color: "from-red-500 to-red-600",
      details: ["Earn while learning", "Recognition system", "Community rewards"]
    }
  ];

  const howItWorks = [
    {
      step: "1",
      title: "Sign Up & Verify",
      description: "Join as a CCS student and verify your credentials"
    },
    {
      step: "2",
      title: "Browse or List",
      description: "Find resources or offer your tutoring services"
    },
    {
      step: "3",
      title: "Get Matched",
      description: "Use our AI system to find perfect learning matches"
    },
    {
      step: "4",
      title: "Learn & Earn",
      description: "Participate in sessions and earn rewards"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Image 
                src="/logo.jpg"
                alt="Gordon College CCS"
                width={40}
                height={40}
                className="w-10 h-10"
              />
              <div>
                <span className="text-xl font-bold text-gray-900">LearnBridge</span>
                <p className="text-xs text-gray-600">Gordon College CCS Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <Link href="/login" className="text-gray-700 hover:text-blue-600 font-medium">
                Login
              </Link>
              <Link 
                href="/signup" 
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:opacity-90 transition"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-16 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-6">
              🎓 Exclusive to Gordon College CCS
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              The Complete{' '}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Peer Learning Platform
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              7 essential features in one platform—designed specifically for Computer Studies students to learn together and succeed together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link 
                href="/signup" 
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-lg font-semibold text-lg hover:shadow-lg transition"
              >
                Start Free Today
              </Link>
              <Link 
                href="#features" 
                className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold text-lg hover:border-blue-600 transition"
              >
                Explore Features
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-blue-600">500+</div>
                <div className="text-sm text-gray-600">Active Students</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-green-600">1k+</div>
                <div className="text-sm text-gray-600">Learning Resources</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-purple-600">100+</div>
                <div className="text-sm text-gray-600">Peer Tutors</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-orange-600">4.8★</div>
                <div className="text-sm text-gray-600">Avg Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MVP Features Section */}
      <section id="features" className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              7 Essential Features for CCS Students
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need for effective peer learning in one platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {mvpFeatures.slice(0, 6).map((feature, index) => (
              <div 
                key={index}
                className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-200"
                onMouseEnter={() => setActiveFeature(index)}
              >
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center text-2xl mb-4`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <ul className="space-y-1">
                  {feature.details.map((detail, idx) => (
                    <li key={idx} className="text-sm text-gray-500 flex items-center">
                      <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Reward System Feature - Highlighted */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-8 border border-yellow-200">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              <div className="lg:w-1/4 text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center text-3xl mx-auto mb-4">
                  🏆
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Reward System</h3>
                <div className="text-sm text-gray-600">Feature #7</div>
              </div>
              <div className="lg:w-3/4">
                <p className="text-gray-700 text-lg mb-4">
                  <strong>Earn while you learn!</strong> Get recognized for your contributions with digital badges, tokens, and special rewards.
                </p>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white/50 rounded-lg p-3 text-center">
                    <div className="text-lg">🎯</div>
                    <div className="text-sm font-medium">Top Tutor Badges</div>
                  </div>
                  <div className="bg-white/50 rounded-lg p-3 text-center">
                    <div className="text-lg">📈</div>
                    <div className="text-sm font-medium">Learning Streaks</div>
                  </div>
                  <div className="bg-white/50 rounded-lg p-3 text-center">
                    <div className="text-lg">💎</div>
                    <div className="text-sm font-medium">Resource Tokens</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How LearnBridge Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorks.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-xl p-6 text-center shadow-sm border">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-xl mb-4 mx-auto">
                    {step.step}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-sm">{step.description}</p>
                </div>
                {index < 3 && (
                  <div className="hidden lg:block absolute top-1/2 right-0 w-8 h-0.5 bg-gray-300 transform translate-x-1/2"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Focus: Smart Matching */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <div className="text-white mb-6">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-sm mb-4">
                  🤖 AI-Powered Feature
                </div>
                <h2 className="text-3xl font-bold mb-4">Smart Matching System</h2>
                <p className="text-blue-100 mb-6">
                  Our AI analyzes your learning style, skill level, and goals to match you with the perfect tutor or learning resource.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center text-white">
                    <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                    Personalized tutor recommendations
                  </li>
                  <li className="flex items-center text-white">
                    <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                    Resource matching based on learning gaps
                  </li>
                  <li className="flex items-center text-white">
                    <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                    Schedule compatibility analysis
                  </li>
                </ul>
              </div>
            </div>
            <div className="lg:w-1/2">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white/20 rounded-lg">
                    <span className="text-white">Looking for:</span>
                    <span className="font-semibold text-white">Data Structures Help</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white/20 rounded-lg">
                    <span className="text-white">Skill Level:</span>
                    <span className="font-semibold text-white">Intermediate</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white/20 rounded-lg">
                    <span className="text-white">Match Found:</span>
                    <span className="font-semibold text-white">94% Compatibility</span>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg">
                    <span className="text-blue-600 font-bold">✓ Perfect Match Found!</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Focus: Virtual Classroom */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="bg-gray-900 rounded-2xl p-4 mb-6">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="bg-gray-800 rounded-lg p-4 h-64 flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <div className="text-4xl mb-2">💻</div>
                    <div className="text-lg">Live Coding Session</div>
                    <div className="text-sm">Screen sharing enabled</div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Virtual Classroom Tools</h2>
              <p className="text-gray-600 mb-6">
                Interactive environment designed specifically for CS students with features that make remote learning effective and engaging.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-2xl mb-2">📝</div>
                  <div className="font-medium text-gray-900">Live Code Editor</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-2xl mb-2">🗣️</div>
                  <div className="font-medium text-gray-900">Audio/Video Chat</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-2xl mb-2">🖊️</div>
                  <div className="font-medium text-gray-900">Shared Whiteboard</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-2xl mb-2">📁</div>
                  <div className="font-medium text-gray-900">File Sharing</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Experience All 7 Features Today
            </h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Join hundreds of CCS students who are already using LearnBridge to enhance their learning journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/signup" 
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-lg font-semibold text-lg hover:shadow-xl transition"
              >
                Start Free Account
              </Link>
              <Link 
                href="/demo" 
                className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-blue-50 transition"
              >
                Watch Platform Demo
              </Link>
            </div>
            <p className="text-sm text-gray-500 mt-6">
              Free for Gordon College CCS students • Verified student ID required
            </p>
          </div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="bg-gray-800 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <Image 
                  src="/logo.jpg"
                  alt="Gordon College"
                  width={40}
                  height={40}
                  className="w-10 h-10"
                />
                <div>
                  <div className="text-xl font-bold">LearnBridge</div>
                  <div className="text-sm text-gray-400">7 Features • 1 Platform</div>
                </div>
              </div>
              <p className="text-gray-400 text-sm max-w-md">
                The complete peer learning platform designed specifically for Gordon College Computer Studies students.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold mb-4">Platform</h3>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li><Link href="/features" className="hover:text-white transition">All Features</Link></li>
                  <li><Link href="/resources" className="hover:text-white transition">Resource Library</Link></li>
                  <li><Link href="/tutoring" className="hover:text-white transition">Tutoring Marketplace</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Access</h3>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li><Link href="/login" className="hover:text-white transition">Student Login</Link></li>
                  <li><Link href="/signup" className="hover:text-white transition">Join Platform</Link></li>
                  <li><a href="mailto:ccs-support@gordoncollege.edu.ph" className="hover:text-white transition">Support</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>© 2024 LearnBridge • Gordon College College of Computer Studies</p>
            <p className="mt-1">Built with all 7 MVP features for optimal peer learning</p>
          </div>
        </div>
      </footer>
    </div>
  );
}