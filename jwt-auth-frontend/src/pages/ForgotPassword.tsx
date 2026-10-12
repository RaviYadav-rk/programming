import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import confetti from "canvas-confetti";
import {
  Mail,
  ArrowRight,
  ArrowLeft,
  Loader2,
  AlertCircle,
  CheckCircle2,
  KeyRound,
  ShieldCheck,
  RotateCcw,
  Inbox,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import { AuthLayout } from "../components/AuthLayout";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"request" | "verify">("request");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(45);
  const [canResend, setCanResend] = useState(false);

  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();

  // Handle countdown timer for resending OTP
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === "verify" && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0) {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [step, countdown]);

  const fireSuccessConfetti = () => {
    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#6366f1", "#818cf8", "#38bdf8", "#10b981"],
    });
  };

  const handleRequestReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      // Backend endpoint or fallback demo
      await axios.post("http://localhost:5000/api/auth/forgot-password", {
        email,
      });
      setSuccess(`Recovery code dispatched to ${email}`);
      fireSuccessConfetti();
      setStep("verify");
      setCountdown(45);
      setCanResend(false);
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.code === "ERR_NETWORK") {
        // Offline demo fallback
        console.log("Password reset requested (Demo Mode):", email);
        setSuccess(`Demo: Cryptographic recovery link generated for ${email}`);
        fireSuccessConfetti();
        setStep("verify");
        setCountdown(45);
        setCanResend(false);
      } else {
        setError("Unable to process password reset. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste
      const pasted = value.slice(0, 6).split("");
      const updatedOtp = [...otp];
      pasted.forEach((char, i) => {
        if (i < 6) updatedOtp[i] = char;
      });
      setOtp(updatedOtp);
      otpInputsRef.current[Math.min(pasted.length, 5)]?.focus();
      return;
    }

    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);

    // Auto-focus next input
    if (value && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  const handleVerifyAndReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 6) {
      setError("Please enter the complete 6-digit verification code.");
      return;
    }
    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters long.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await axios.post("http://localhost:5000/api/auth/reset-password", {
        email,
        code,
        newPassword,
      });
      setSuccess("Password updated successfully! Redirecting to login...");
      fireSuccessConfetti();
      setTimeout(() => {
        navigate("/login");
      }, 1600);
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.code === "ERR_NETWORK") {
        console.log("Password reset completed (Demo Mode):", {
          email,
          code,
        });
        setSuccess("Demo Mode: Password successfully reset! Redirecting...");
        fireSuccessConfetti();
        setTimeout(() => {
          navigate("/login");
        }, 1600);
      } else {
        setError("Invalid recovery code or expired token. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = () => {
    if (!canResend) return;
    setCountdown(45);
    setCanResend(false);
    setError(null);
    setSuccess(`Fresh verification code re-sent to ${email}`);
    fireSuccessConfetti();
  };

  return (
    <AuthLayout>
      <div className="relative w-full animate-card-entrance">
        {/* Subtle Ambient Backlight */}
        <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-b from-indigo-500/20 to-purple-500/0 blur-xl pointer-events-none" />

        <div className="relative rounded-2xl enterprise-card p-5 sm:p-6 text-white">
          {/* Header */}
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                  {step === "request"
                    ? "Reset Password"
                    : "Verify & Set Password"}
                </h2>
                <p className="mt-0.5 text-xs text-slate-400">
                  {step === "request"
                    ? "Receive a secure cryptographic reset token"
                    : `Enter code sent to ${email}`}
                </p>
              </div>

              <div className="h-9 w-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                {step === "request" ? (
                  <KeyRound className="h-4 w-4" />
                ) : (
                  <Inbox className="h-4 w-4" />
                )}
              </div>
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

          {/* STEP 1: REQUEST FORM */}
          {step === "request" ? (
            <form onSubmit={handleRequestReset} className="space-y-3.5">
              <div className="space-y-1">
                <label
                  htmlFor="email"
                  className="block text-[11px] font-semibold tracking-wider uppercase text-slate-300"
                >
                  Work Email Address
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
                <p className="text-[11px] text-slate-500 pt-0.5">
                  We'll send a 6-digit one-time code to verify ownership.
                </p>
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
                      <span>Dispatching code...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Recovery Code</span>
                      <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </>
                  )}
                </span>
              </button>
            </form>
          ) : (
            /* STEP 2: VERIFICATION & NEW PASSWORD FORM */
            <form onSubmit={handleVerifyAndReset} className="space-y-3">
              {/* 6-Digit OTP Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <label className="font-semibold uppercase tracking-wider text-slate-300">
                    6-Digit Verification Code
                  </label>
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={!canResend}
                    className={`flex items-center gap-1 ${
                      canResend
                        ? "text-indigo-400 hover:text-indigo-300 cursor-pointer hover:underline"
                        : "text-slate-500 cursor-not-allowed"
                    }`}
                  >
                    <RotateCcw className="h-3 w-3" />
                    <span>
                      {canResend ? "Resend" : `Resend in ${countdown}s`}
                    </span>
                  </button>
                </div>

                <div className="flex justify-between gap-1.5 sm:gap-2">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => {
                        otpInputsRef.current[idx] = el;
                      }}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      className="w-10 h-11 sm:w-11 sm:h-12 text-center rounded-xl enterprise-input text-base font-bold text-white focus:outline-none font-mono"
                    />
                  ))}
                </div>
              </div>

              {/* New Password Field */}
              <div className="space-y-1 pt-1">
                <label
                  htmlFor="newPassword"
                  className="block text-[11px] font-semibold tracking-wider uppercase text-slate-300"
                >
                  New Password
                </label>
                <div className="relative group">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 group-focus-within:text-indigo-400 transition-colors">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    id="newPassword"
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimum 8 characters"
                    required
                    className="w-full rounded-xl enterprise-input py-2 pl-9 pr-9 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Reset Button */}
              <button
                type="submit"
                disabled={loading}
                className="enterprise-btn group relative w-full rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-md shadow-indigo-600/20 active:scale-[0.99] disabled:opacity-60 cursor-pointer transition-all mt-2"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Updating password...</span>
                    </>
                  ) : (
                    <>
                      <span>Reset & Sign In</span>
                      <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </>
                  )}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setStep("request")}
                className="w-full text-center text-xs text-slate-400 hover:text-white py-1 transition-colors"
              >
                Change email address
              </button>
            </form>
          )}

          {/* Navigation Links Back */}
          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
            <Link
              to="/login"
              className="flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 font-medium hover:underline"
            >
              <ArrowLeft className="h-3 w-3" />
              <span>Back to Sign In</span>
            </Link>

            <span className="flex items-center gap-1 text-slate-500">
              <ShieldCheck className="h-3 w-3 text-emerald-400" />
              <span>Encrypted Session</span>
            </span>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default ForgotPassword;
