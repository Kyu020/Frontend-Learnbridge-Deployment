'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      title: "Peer-to-Peer Tutoring",
      description: "Connect with student tutors who excel in subjects you're struggling with across all disciplines",
      icon: "👥"
    },
    {
      title: "Academic Resource Hub",
      description: "Access and share study materials, notes, textbooks, and resources with students from all programs",
      icon: "📚"
    },
    {
      title: "Cross-Disciplinary Learning",
      description: "Bridge educational gaps through collaborative learning and knowledge sharing across different fields",
      icon: "🌉"
    }
  ];

  const popularSubjects = [
    "Mathematics & Statistics", "Programming & CS", "Natural Sciences", "Business & Economics", 
    "Engineering", "Social Sciences", "Humanities", "Languages"
  ];

  const programs = [
    { name: "Computer Studies", focus: "Programming, IT, and Digital Solutions", icon: "💻" },
    { name: "Engineering", focus: "Technical and Applied Sciences", icon: "⚙️" },
    { name: "Business", focus: "Management and Commerce", icon: "📊" },
    { name: "Arts & Sciences", focus: "Liberal Arts and Natural Sciences", icon: "🎓" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="flex items-center">
                <Image 
                  src="/logo.jpg" // Update this path to match your logo file
                  alt="LearnBridge Logo"
                  width={40}
                  height={40}
                  className="w-8 h-8 object-contain"
                  priority
                />
              </div>
              <span className="text-xl font-bold text-gray-900">LearnBridge</span>
            </div>
            <div className="flex items-center space-x-6">
              <Link href="/login" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Login
              </Link>
              <Link 
                href="/signup" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center space-x-2 text-sm text-blue-600 font-medium mb-4">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                <span>University-Wide Learning Community</span>
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Learn Together, 
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Grow Together</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Join a diverse community of students helping students. Access peer tutoring, 
                share academic resources, and bridge educational gaps through collaborative learning across all programs and disciplines.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/signup" 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 shadow-lg text-center"
                >
                  Start Learning Free
                </Link>
                <Link 
                  href="/login" 
                  className="border-2 border-gray-300 hover:border-blue-600 text-gray-700 hover:text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 text-center"
                >
                  I Have an Account
                </Link>
              </div>
              <div className="flex items-center space-x-4 mt-6 text-sm text-gray-500">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-8 h-8 bg-gray-300 rounded-full border-2 border-white"></div>
                  ))}
                </div>
                <span>Join 2,000+ students across all programs</span>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8 transform rotate-2 hover:rotate-0 transition-transform duration-300">
                <div className="grid grid-cols-2 gap-4">
                  {programs.map((program, index) => (
                    <div key={program.name} className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 text-center hover:shadow-md transition-shadow">
                      <div className="text-2xl mb-2">{program.icon}</div>
                      <h3 className="font-semibold text-gray-800 text-sm">{program.name}</h3>
                      <p className="text-xs text-gray-600 mt-1">{program.focus}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
                  <p className="text-sm text-green-800">
                    <strong>Live Now:</strong> Calculus study group with Engineering & CS students
                  </p>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 bg-blue-500 text-white px-4 py-2 rounded-full shadow-lg">
                <span className="text-sm font-medium">All Programs</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">For All Academic Programs</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Connecting students across disciplines for comprehensive learning support
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {programs.map((program, index) => (
              <div 
                key={program.name}
                className="bg-gray-50 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-blue-200 text-center"
              >
                <div className="text-4xl mb-4">{program.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{program.name}</h3>
                <p className="text-gray-600 leading-relaxed">{program.focus}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How LearnBridge Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Empowering students from all academic backgrounds through collaborative learning
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer border"
                onMouseEnter={() => setActiveFeature(index)}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Subjects Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Popular Subjects</h2>
            <p className="text-xl text-gray-600">Get help in courses students need most</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {popularSubjects.map((subject, index) => (
              <div key={subject} className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-4 text-center hover:shadow-md transition-all transform hover:-translate-y-1 border">
                <div className="text-2xl mb-2">{["🧮", "💻", "🔬", "📈", "⚙️", "🌍", "📚", "🗣️"][index]}</div>
                <h3 className="text-gray-800 font-medium text-sm">{subject}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <div className="text-4xl font-bold mb-2">2,000+</div>
              <div className="text-blue-100">Active Students</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">300+</div>
              <div className="text-blue-100">Student Tutors</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">1,500+</div>
              <div className="text-blue-100">Study Resources</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-blue-100">Programs Supported</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Ready to Enhance Your Learning Journey?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Join LearnBridge today and connect with students from all academic backgrounds
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/signup" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105"
            >
              Create Free Account
            </Link>
            <Link 
              href="/programs" 
              className="border-2 border-gray-600 hover:border-blue-600 text-gray-700 hover:text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg transition-all"
            >
              Explore Programs
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <Image 
                  src="/logo.png" // Update this path to match your logo file
                  alt="LearnBridge Logo"
                  width={32}
                  height={32}
                  className="w-8 h-8 object-contain"
                />
                <span className="text-xl font-bold">LearnBridge</span>
              </div>
              <p className="text-gray-400">
                Bridging educational gaps through peer-to-peer learning and collaboration across all academic programs.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/tutors" className="hover:text-white transition-colors">Find Tutors</Link></li>
                <li><Link href="/resources" className="hover:text-white transition-colors">Study Resources</Link></li>
                <li><Link href="/community" className="hover:text-white transition-colors">Community</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Programs</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/computer-studies" className="hover:text-white transition-colors">Computer Studies</Link></li>
                <li><Link href="/engineering" className="hover:text-white transition-colors">Engineering</Link></li>
                <li><Link href="/business" className="hover:text-white transition-colors">Business</Link></li>
                <li><Link href="/arts-sciences" className="hover:text-white transition-colors">Arts & Sciences</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/help" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 LearnBridge. Connecting students across all academic programs.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}