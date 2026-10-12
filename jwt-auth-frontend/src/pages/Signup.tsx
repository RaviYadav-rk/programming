import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import confetti from "canvas-confetti";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Check,
  ShieldCheck,
  UserPlus,
} from "lucide-react";
import { AuthLayout } from "../components/AuthLayout";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [capsLockActive, setCapsLockActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const navigate = useNavigate();

  // Password strength checks
  const hasMinLength = password.length >= 8;
  const hasNumberOrSymbol = /[0-9!@#$%^&*(),.?":{}|<>]/.test(password);
  const hasMixedCase = /[a-z]/.test(password) && /[A-Z]/.test(password);

  const strengthScore = [hasMinLength, hasNumberOrSymbol, hasMixedCase].filter(
    Boolean
  ).length;

  const getStrengthLabel = () => {
    if (!password) return { text: "Enter password", color: "text-slate-500", bar: 0 };
    if (strengthScore === 1)
      return { text: "Weak", color: "text-rose-400", bar: 1 };
    if (strengthScore === 2)
      return { text: "Medium", color: "text-amber-400", bar: 2 };
    if (strengthScore === 3 && password.length >= 10)
      return { text: "Enterprise Grade", color: "text-emerald-400", bar: 4 };
    return { text: "Good", color: "text-indigo-400", bar: 3 };
  };

  const strengthInfo = getStrengthLabel();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.getModifierState) {
      setCapsLockActive(e.getModifierState("CapsLock"));
    }
  };

  const fireSuccessConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 },
      colors: ["#6366f1", "#818cf8", "#38bdf8", "#10b981"],
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!agreedToTerms) {
      setError("Please accept the terms and privacy policy.");
      return;
    }

    setLoading(true);

    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        name,
        email,
        password,
      });

      setSuccess("Account provisioned! Redirecting...");
      fireSuccessConfetti();
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.code === "ERR_NETWORK") {
        console.log("Signup form submitted (Offline Demo Mode):", {
          name,
          email,
          password,
        });
        setSuccess("Demo Mode: Identity profile simulated! Redirecting...");
        fireSuccessConfetti();
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        setError("Failed to register enterprise account. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="relative w-full animate-card-entrance">
        {/* Subtle Ambient Backlight */}
        <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-b from-purple-500/15 to-indigo-500/0 blur-xl pointer-events-none" />

        <div className="relative rounded-2xl enterprise-card p-5 sm:p-6 text-white">
          {/* Header */}
          <div className="mb-3.5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                  Create Workspace
                </h2>
                <p className="mt-0.5 text-xs text-slate-400">
                  Provision your high-trust identity credentials
                </p>
              </div>

              <div className="h-9 w-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                <UserPlus className="h-4 w-4" />
              </div>
            </div>

            {/* Seamless Tab Switcher */}
            <div className="mt-3 grid grid-cols-2 p-1 rounded-xl bg-slate-900/80 border border-white/5 text-xs font-semibold">
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="py-1.5 rounded-lg text-slate-400 hover:text-white transition-all"
              >
                Sign In
              </button>
              <button
                type="button"
                className="py-1.5 rounded-lg bg-indigo-600 text-white shadow-sm transition-all"
              >
                Create Account
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-3 flex items-start gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-2.5 text-xs text-rose-300 animate-shake">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
              <span className="flex-1">{error}</span>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-3 flex items-start gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-2.5 text-xs text-emerald-300">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
              <span className="flex-1">{success}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-2.5">
            {/* Full Name */}
            <div className="space-y-1">
              <label
                htmlFor="name"
                className="block text-[11px] font-semibold tracking-wider uppercase text-slate-300"
              >
                Full Name
              </label>
              <div className="relative group">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 group-focus-within:text-indigo-400 transition-colors">
                  <User className="h-4 w-4" />
                </div>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Elena Rostova"
                  required
                  className="w-full rounded-xl enterprise-input py-1.5 pl-9 pr-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none"
                />
              </div>
            </div>

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
                  placeholder="elena@hyperscale.io"
                  required
                  className="w-full rounded-xl enterprise-input py-1.5 pl-9 pr-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <label
                htmlFor="password"
                className="block text-[11px] font-semibold tracking-wider uppercase text-slate-300"
              >
                Password
              </label>
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
                  placeholder="Create high-entropy password"
                  required
                  className="w-full rounded-xl enterprise-input py-1.5 pl-9 pr-9 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none font-mono tracking-wider"
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

              {/* Real-time Password Strength Meter */}
              {password && (
                <div className="pt-1 space-y-1">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-slate-400">Security Rating:</span>
                    <span className={`font-semibold ${strengthInfo.color}`}>
                      {strengthInfo.text}
                    </span>
                  </div>

                  {/* 4-Step Animated Bars */}
                  <div className="grid grid-cols-4 gap-1">
                    {[1, 2, 3, 4].map((step) => (
                      <div
                        key={step}
                        className={`h-1 rounded-full transition-all duration-300 ${
                          strengthInfo.bar >= step
                            ? step === 1
                              ? "bg-rose-500"
                              : step === 2
                              ? "bg-amber-400"
                              : step === 3
                              ? "bg-indigo-500"
                              : "bg-emerald-400"
                            : "bg-slate-800"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Requirements chips */}
                  <div className="grid grid-cols-3 gap-1 text-[9px] text-slate-400">
                    <div className="flex items-center gap-1">
                      <div
                        className={`flex h-2.5 w-2.5 items-center justify-center rounded-full ${
                          hasMinLength
                            ? "bg-emerald-500/20 text-emerald-400"
                            : "bg-slate-800 text-slate-500"
                        }`}
                      >
                        <Check className="h-2 w-2" />
                      </div>
                      <span className={hasMinLength ? "text-slate-200" : ""}>
                        8+ chars
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <div
                        className={`flex h-2.5 w-2.5 items-center justify-center rounded-full ${
                          hasNumberOrSymbol
                            ? "bg-emerald-500/20 text-emerald-400"
                            : "bg-slate-800 text-slate-500"
                        }`}
                      >
                        <Check className="h-2 w-2" />
                      </div>
                      <span className={hasNumberOrSymbol ? "text-slate-200" : ""}>
                        123 / symbol
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <div
                        className={`flex h-2.5 w-2.5 items-center justify-center rounded-full ${
                          hasMixedCase
                            ? "bg-emerald-500/20 text-emerald-400"
                            : "bg-slate-800 text-slate-500"
                        }`}
                      >
                        <Check className="h-2 w-2" />
                      </div>
                      <span className={hasMixedCase ? "text-slate-200" : ""}>
                        Aa / aA
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Terms Agreement */}
            <div className="pt-0.5">
              <label className="flex items-start gap-2 cursor-pointer text-[11px] text-slate-400 select-none">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-0.5 h-3.5 w-3.5 rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500 cursor-pointer accent-indigo-500"
                />
                <span>
                  I agree to the{" "}
                  <a
                    href="#terms"
                    onClick={(e) => {
                      e.preventDefault();
                      alert("Subscription Agreement: Standard B2B Terms.");
                    }}
                    className="text-indigo-400 hover:text-indigo-300 underline"
                  >
                    Terms
                  </a>{" "}
                  and{" "}
                  <a
                    href="#privacy"
                    onClick={(e) => {
                      e.preventDefault();
                      alert("Privacy Policy: Zero data selling, GDPR compliant.");
                    }}
                    className="text-indigo-400 hover:text-indigo-300 underline"
                  >
                    Privacy Policy
                  </a>
                </span>
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
                    <span>Provisioning identity...</span>
                  </>
                ) : (
                  <>
                    <span>Create Enterprise Account</span>
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </>
                )}
              </span>
            </button>
          </form>

          {/* SSO Options */}
          <div className="relative my-3 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/5" />
            </div>
            <div className="relative bg-[#0d1321] px-2.5 text-[10px] text-slate-500 uppercase tracking-wider font-medium">
              Or sign up with
            </div>
          </div>

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
          <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-3 w-3 text-emerald-400" />
              <span>SOC-2 Type II Certified</span>
            </span>
            <Link
              to="/login"
              className="text-indigo-400 hover:text-indigo-300 font-medium hover:underline"
            >
              Sign In Instead
            </Link>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Signup;
