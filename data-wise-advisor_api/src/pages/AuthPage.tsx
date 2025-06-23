import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

const ADMIN_EMAIL = "admin@example.com";
const ADMIN_PASSWORD = "admin123";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [forgotMode, setForgotMode] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (isLogin) {
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        localStorage.setItem("admin_session", "true");
        navigate("/");
      } else {
        setError("Invalid admin credentials");
      }
    } else {
      setError("Sign up is disabled. Only admin login is allowed.");
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (forgotEmail === ADMIN_EMAIL) {
      setForgotSuccess(true);
    } else {
      setError("Email not found");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <div className="h-10 w-10 rounded-full bg-bizoracle-blue flex items-center justify-center">
              <span className="font-bold text-white">BO</span>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">
            {forgotMode ? "Forgot Password" : isLogin ? "Admin Login" : "Create an Account"}
          </CardTitle>
          <CardDescription>
            {forgotMode
              ? "Enter your admin email to reset your password"
              : isLogin
              ? "Sign in as admin"
              : "Sign up is disabled"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && <div className="text-red-500 text-sm mb-2 text-center">{error}</div>}
          {forgotMode ? (
            forgotSuccess ? (
              <div className="text-green-600 text-center py-8">
                Password reset link sent to your email (demo only).
                <Button className="mt-4 w-full" onClick={() => { setForgotMode(false); setForgotSuccess(false); }}>Back to Login</Button>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="forgotEmail">Admin Email</Label>
                  <Input
                    id="forgotEmail"
                    type="email"
                    placeholder="admin@example.com"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">Send Reset Link</Button>
                <div className="mt-4 text-center text-sm">
                  <button
                    type="button"
                    className="text-bizoracle-blue hover:underline focus:outline-none"
                    onClick={() => { setForgotMode(false); setError(""); }}
                  >
                    Back to Login
                  </button>
                </div>
              </form>
            )
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-2.5 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full">
                Sign In
              </Button>
              <div className="mt-2 text-center text-sm">
                <button
                  type="button"
                  className="text-bizoracle-blue hover:underline focus:outline-none"
                  onClick={() => setForgotMode(true)}
                >
                  Forgot password?
                </button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;
