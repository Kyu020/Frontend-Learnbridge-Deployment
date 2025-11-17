interface WelcomeBannerProps {
    username?: string | null;
}

export const WelcomeBanner = ({ username }: WelcomeBannerProps) => {
    return (
    <div className="mb-6 lg:mb-8 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 p-4 sm:p-6 lg:p-8 text-white">
        <div className="max-w-4xl">
            <h1 className="mb-2 text-xl sm:text-2xl lg:text-3xl font-bold">
            Welcome back, {username || 'Student'}!
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-blue-50 opacity-90">
            Ready to continue your learning journey?
            </p>
        </div>
    </div>
    );
};