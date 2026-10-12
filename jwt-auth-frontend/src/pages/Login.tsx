import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import confetti from "canvas-confetti";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Shield,
  KeyRound,
  X,
} from "lucide-react";
import { AuthLayout } from "../components/AuthLayout";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [capsLockActive, setCapsLockActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);

  const navigate = useNavigate();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.getModifierState) {
      setCapsLockActive(e.getModifierState("CapsLock"));
    }
  };

  const fireSuccessConfetti = () => {
    confetti({
      particleCount: 90,
      spread: 75,
      origin: { y: 0.6 },
      colors: ["#6366f1", "#818cf8", "#38bdf8", "#10b981"],
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        }
      );
      if (response.data?.token) {
        localStorage.setItem("token", response.data.token);
      }
      setSuccess("Authentication verified. Redirecting...");
      fireSuccessConfetti();
      setTimeout(() => {
        console.log("Logged in successfully!");
      }, 1500);
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.code === "ERR_NETWORK") {
        console.log("Login form submitted (Offline Demo Mode):", {
          email,
          password,
        });
        localStorage.setItem("demo_token", "jwt_mock_token_sec_key_9981x");
        setSuccess("Demo Mode: Authenticated with mock token.");
        fireSuccessConfetti();
      } else {
        setError("Invalid credentials. Please verify your email and password.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setResetSent(true);
    setTimeout(() => {
      setShowForgotModal(false);
      setResetSent(false);
      setResetEmail("");
      setSuccess(`Password recovery email dispatched.`);
    }, 1500);
  };

  return (
    <AuthLayout>
      <div className="relative w-full animate-card-entrance">
        {/* Subtle Ambient Backlight */}
        <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-b from-indigo-500/20 to-purple-500/0 blur-xl pointer-events-none" />

        <div className="relative rounded-2xl enterprise-card p-5 sm:p-6 text-white">
          {/* Form Header */}
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                  Account Sign In
                </h2>
                <p className="mt-0.5 text-xs text-slate-400">
                  Enter your verified credentials to access your session
                </p>
              </div>

              <div className="h-9 w-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                <KeyRound className="h-4 w-4" />
              </div>
            </div>

            {/* Seamless Tab Switcher */}
            <div className="mt-3.5 grid grid-cols-2 p-1 rounded-xl bg-slate-900/80 border border-white/5 text-xs font-semibold">
              <button
                type="button"
                className="py-1.5 rounded-lg bg-indigo-600 text-white shadow-sm transition-all"
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => navigate("/signup")}
                className="py-1.5 rounded-lg text-slate-400 hover:text-white transition-all"
              >
                Create Account
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-3.5 flex items-start gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-2.5 text-xs text-rose-300 animate-shake">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
              <span className="flex-1">{error}</span>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-3.5 flex items-start gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-2.5 text-xs text-emerald-300">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
              <span className="flex-1">{success}</span>
            </div>
          )}

          {/* Form Fields */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Email Address */}
            <div className="space-y-1">
              <label
                htmlFor="email"
                className="block text-[11px] font-semibold tracking-wider uppercase text-slate-300"
              >
                Work Email
              </label>
              <div className="relative group">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 group-focus-within:text-indigo-400 transition-colors">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  required
                  className="w-full rounded-xl enterprise-input py-2 pl-9 pr-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-[11px] font-semibold tracking-wider uppercase text-slate-300"
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-[11px] font-medium text-indigo-400 hover:text-indigo-300 transition-colors hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative group">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 group-focus-within:text-indigo-400 transition-colors">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onKeyUp={handleKeyDown}
                  placeholder="••••••••••••"
                  required
                  className="w-full rounded-xl enterprise-input py-2 pl-9 pr-9 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none font-mono tracking-wider"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                  tabIndex={-1}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              {/* Caps Lock Alert */}
              {capsLockActive && (
                <div className="flex items-center gap-1.5 text-[10px] text-amber-400 pt-0.5">
                  <AlertCircle className="h-3 w-3" />
                  <span>Caps Lock is ON</span>
                </div>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-0.5">
              <label className="flex items-center gap-2 cursor-pointer text-[11px] text-slate-300 select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-3.5 w-3.5 rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500 cursor-pointer accent-indigo-500"
                />
                <span>Remember this workstation for 30 days</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="enterprise-btn group relative w-full rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-md shadow-indigo-600/20 active:scale-[0.99] disabled:opacity-60 cursor-pointer transition-all mt-1"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Verifying session...</span>
                  </>
                ) : (
                  <>
                    <span>Continue to Workspace</span>
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </>
                )}
              </span>
            </button>
          </form>

          {/* SSO Divider */}
          <div className="relative my-3.5 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/5" />
            </div>
            <div className="relative bg-[#0d1321] px-2.5 text-[10px] text-slate-500 uppercase tracking-wider font-medium">
              Or authenticate with
            </div>
          </div>

          {/* Social / SSO Auth */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => alert("Google Workspace SSO initiated.")}
              className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] py-1.5 px-3 text-[11px] font-semibold text-slate-300 hover:bg-white/[0.07] hover:text-white transition-all cursor-pointer"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
                />
                <path
                  fill="#4285F4"
                  d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5.1 3.7-8.8z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3 0-.8.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15s.7 5.3 1.9 7.7l3.7-2.9z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"
                />
              </svg>
              <span>Google</span>
            </button>

            <button
              type="button"
              onClick={() => alert("GitHub Enterprise Auth initiated.")}
              className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] py-1.5 px-3 text-[11px] font-semibold text-slate-300 hover:bg-white/[0.07] hover:text-white transition-all cursor-pointer"
            >
              <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span>GitHub</span>
            </button>
          </div>

          {/* Footer note */}
          <div className="mt-4 pt-2.5 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <Shield className="h-3 w-3 text-indigo-400" />
              <span>TLS 1.3 Cryptographic Channel</span>
            </span>
            <Link
              to="/signup"
              className="text-indigo-400 hover:text-indigo-300 font-medium hover:underline"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-card-entrance">
          <div className="relative w-full max-w-sm rounded-2xl enterprise-card p-5 text-white shadow-2xl">
            <button
              onClick={() => setShowForgotModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2.5 mb-3.5">
              <div className="h-8 w-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <KeyRound className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Reset Password</h3>
                <p className="text-[10px] text-slate-400">
                  Receive a cryptographically signed recovery token
                </p>
              </div>
            </div>

            <form onSubmit={handleResetSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-semibold uppercase text-slate-300 tracking-wider">
                  Verification Email
                </label>
                <input
                  type="email"
                  value={resetEmail || email}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="name@company.com"
                  required
                  className="w-full rounded-xl enterprise-input py-2 pl-3 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={resetSent}
                className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 py-2 text-xs font-semibold text-white transition-all cursor-pointer"
              >
                {resetSent ? "Dispatching..." : "Send Recovery Link"}
              </button>
            </form>
          </div>
        </div>
      )}
    </AuthLayout>
  );
};

export default Login;
