"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, X, FileText } from "lucide-react"
import api from "@/lib/axios"

export default function SignupPage() {
  const router = useRouter()
  const [username, setName] = useState("")
  const [studentId, setStudentId] = useState("")
  const [program, setProgram] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showTermsModal, setShowTermsModal] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    if (!agreeTerms) {
      setError("Please agree to the terms and conditions")
      setLoading(false)
      return
    }

    if (!program) {
      setError("Please select both program and specialization")
      setLoading(false)
      return
    }

    try {
      const res = await api.post("/auth/register", { username, studentId, program, password })
      if (res.status === 201) {
        router.push("/login")
      } else {
        setError(res.data.message || "Registration failed")
      }
    } catch (err: any) {
      console.error("❌ Registration error:", err)
      setError(err.response?.data?.message || "Network error")
    } finally {
      setLoading(false)
    }
  }

  const termsContent = [
    {
      title: "Platform Usage",
      content: "LearnBridge is exclusively for Gordon College College of Computer Studies students. You must provide accurate student information during registration."
    },
    {
      title: "Student Responsibilities",
      content: "You are responsible for maintaining the confidentiality of your account. All activities under your account are your responsibility. Do not share your credentials."
    },
    {
      title: "Academic Integrity",
      content: "LearnBridge promotes collaborative learning, not academic dishonesty. Using the platform to cheat or plagiarize is strictly prohibited."
    },
    {
      title: "Content Guidelines",
      content: "All shared resources must be original or properly cited. Inappropriate content, harassment, or misuse will result in account suspension."
    },
    {
      title: "Data Privacy",
      content: "We collect only necessary information for platform functionality. Your data is protected and will not be shared with third parties without consent."
    },
    {
      title: "Platform Availability",
      content: "LearnBridge is provided as-is. We strive for 24/7 availability but do not guarantee uninterrupted service."
    }
  ]

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
        <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col lg:flex-row">
          <div className="lg:hidden bg-gradient-to-br from-purple-600 via-purple-700 to-blue-700 p-6">
            <div className="flex items-center gap-2 text-white">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <span className="text-2xl font-bold text-purple-600">L</span>
              </div>
              <span className="text-2xl font-bold">LearnBridge</span>
            </div>
          </div>

          <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-600 via-purple-700 to-blue-700 p-12 flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-white mb-8">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                  <span className="text-2xl font-bold text-purple-600">L</span>
                </div>
                <span className="text-2xl font-bold">LearnBridge</span>
              </div>
              <h1 className="text-4xl font-bold text-white mb-4">Start your journey!</h1>
              <p className="text-purple-100 text-lg">Join thousands of Gordon College - CCS students learning with expert tutors.</p>
            </div>
            <div className="space-y-4 text-purple-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">✓</div>
                <span>Free account creation</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">✓</div>
                <span>Instant access to resources</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">✓</div>
                <span>Personalized learning path</span>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-1/2 p-6 sm:p-8 lg:p-12">
            <div className="max-w-md mx-auto">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
              <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">
                Sign up to start your learning journey
              </p>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={username}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="h-11 sm:h-12"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="Id" className="text-sm">
                    Student ID
                  </Label>
                  <Input
                    id="Id"
                    type="text"
                    placeholder="Enter your student ID"
                    value={studentId}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 9)
                      setStudentId(value)
                    }}
                    inputMode="numeric"
                    pattern="[0-9]{9}"
                    maxLength={9}
                    required
                    className="h-10"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="program">Program</Label>
                  <select
                    id="program"
                    value={program}
                    onChange={(e) => {
                      setProgram(e.target.value)
                    }}
                    className="w-full border rounded-md p-2 h-11 sm:h-12 border-input bg-background px-3 py-2 text-sm"
                    required
                  >
                    <option value="">Select your program</option>
                    <option value="BSIT">BS Information Technology</option>
                    <option value="BSCS">BS Computer Science</option>
                    <option value="BSEMC">BS Entertainment and Multimedia Computing</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="h-11 sm:h-12 pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="h-11 sm:h-12 pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Checkbox
                    id="terms"
                    checked={agreeTerms}
                    onCheckedChange={(checked) => setAgreeTerms(!!checked)}
                  />
                  <Label htmlFor="terms" className="text-sm font-normal cursor-pointer leading-relaxed">
                    I agree to the{" "}
                    <button
                      type="button"
                      onClick={() => setShowTermsModal(true)}
                      className="text-blue-600 hover:text-blue-700 underline font-medium inline-flex items-center gap-1"
                    >
                      <FileText className="w-3 h-3" />
                      Terms and Conditions
                    </button>
                  </Label>
                </div>

                <Button type="submit" className="w-full h-11 sm:h-12 text-base" disabled={loading}>
                  {loading ? "Creating account..." : "Create Account"}
                </Button>
              </form>

              <p className="mt-6 sm:mt-8 text-center text-sm text-gray-600">
                Already have an account?{" "}
                <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Terms and Conditions Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-purple-600" />
                <h2 className="text-2xl font-bold text-gray-900">Terms and Conditions</h2>
              </div>
              <button
                onClick={() => setShowTermsModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  LearnBridge - Gordon College CCS Platform
                </h3>
                <p className="text-gray-600">
                  By creating an account, you agree to the following terms and conditions:
                </p>
              </div>

              <div className="space-y-6">
                {termsContent.map((section, index) => (
                  <div key={index} className="border-l-4 border-purple-500 pl-4">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      {index + 1}. {section.title}
                    </h4>
                    <p className="text-gray-600">{section.content}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Important Notes:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• This platform is exclusively for Gordon College CCS students</li>
                  <li>• Violation of terms may result in account suspension</li>
                  <li>• Platform features may be updated or modified</li>
                  <li>• Contact CCS department for support</li>
                </ul>
              </div>
            </div>

            <div className="p-6 border-t flex flex-col sm:flex-row gap-3 justify-between items-center">
              <div className="text-sm text-gray-500">
                Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowTermsModal(false)}
                  className="min-w-[120px]"
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    setAgreeTerms(true)
                    setShowTermsModal(false)
                  }}
                  className="min-w-[120px] bg-purple-600 hover:bg-purple-700"
                >
                  I Agree
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}