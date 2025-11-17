"use client"

import { mockUsers, type User } from "./mock-data"

const AUTH_STORAGE_KEY = "learnbridge_auth"

export function login(email: string, password: string): User | null {
  const user = mockUsers.find((u) => u.email === email && u.password === password)
  if (user) {
    // Store user in localStorage (mock authentication)
    if (typeof window !== "undefined") {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user))
    }
    return user
  }
  return null
}

export function signup(email: string, password: string, name: string): User {
  const newUser: User = {
    id: String(mockUsers.length + 1),
    email,
    password,
    name,
    avatar: "/default-avatar.jpg",
    role: "student",
  }
  mockUsers.push(newUser)
  if (typeof window !== "undefined") {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser))
  }
  return newUser
}

export function logout(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(AUTH_STORAGE_KEY)
  }
}

export function getCurrentUser(): User | null {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  }
  return null
}

export function isAuthenticated(): boolean {
  return getCurrentUser() !== null
}
