import { RefreshCw, X, Bell, HelpCircle, Calendar, Clock, Video, BarChart3, CreditCard, Users } from "lucide-react"

interface BookingsHeaderProps {
  onRefresh: () => void;
  refreshing: boolean;
  upcomingCount: number;
  inProgressCount: number;
  totalEarnings: number;
  completedCount: number;
  pendingEvaluationCount: number;
  declinedCount: number; // Changed from sentCount
  isTutor: boolean;
}

export function BookingsHeader({ 
  onRefresh, 
  refreshing,
  upcomingCount,
  inProgressCount,
  totalEarnings,
  completedCount,
  pendingEvaluationCount,
  declinedCount, // Changed from sentCount
  isTutor
}: BookingsHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 mb-8">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
              <p className="text-gray-600 mt-2">Manage your tutoring sessions and requests</p>
            </div>
          </div>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4"> {/* Changed to 5 columns */}
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Upcoming</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {upcomingCount}
                  </p>
                </div>
                <div className="p-2 bg-green-50 rounded-lg">
                  <Clock className="w-5 h-5 text-green-600" />
                </div>
              </div>
              <div className="mt-2 text-xs text-green-600 flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                Scheduled
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">In Progress</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {inProgressCount}
                  </p>
                </div>
                <div className="p-2 bg-purple-50 rounded-lg">
                  <Video className="w-5 h-5 text-purple-600" />
                </div>
              </div>
              <div className="mt-2 text-xs text-purple-600 flex items-center">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse mr-1"></div>
                Live
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Completed</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {completedCount}
                  </p>
                </div>
                <div className="p-2 bg-indigo-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-indigo-600" />
                </div>
              </div>
              <div className="mt-2 text-xs text-indigo-600">
                Finished sessions
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">To Review</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {pendingEvaluationCount}
                  </p>
                </div>
                <div className="p-2 bg-orange-50 rounded-lg">
                  <BarChart3 className="w-5 h-5 text-orange-600" />
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                Awaiting evaluation
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Declined</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {declinedCount}
                  </p>
                </div>
                <div className="p-2 bg-red-50 rounded-lg">
                  <X className="w-5 h-5 text-red-600" /> {/* Need to import X icon */}
                </div>
              </div>
              <div className="mt-2 text-xs text-red-600">
                Declined/Cancelled
              </div>
            </div>
          </div>

          {/* Earnings (Tutor only) */}
          {isTutor && totalEarnings > 0 && (
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <CreditCard className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-blue-700">Total Earnings</p>
                    <p className="text-2xl font-bold text-blue-900">₱{totalEarnings.toLocaleString()}</p>
                  </div>
                </div>
                <div className="text-sm text-blue-600">
                  From {completedCount} completed sessions
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onRefresh}
            disabled={refreshing}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all disabled:opacity-50 font-medium"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? 'Syncing...' : 'Sync'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}