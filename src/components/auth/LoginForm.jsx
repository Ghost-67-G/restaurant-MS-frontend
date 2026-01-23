import { useState } from "react";
import { Link } from "react-router-dom";
import { useLogin } from "../../hooks/useAuth";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent } from "../ui/card";
import { Loader2 } from "lucide-react";

export default function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const loginMutation = useLogin();

  loginMutation.error && !error && setError(
    loginMutation.error.response?.data?.message || "Login failed. Please try again."
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    loginMutation.mutate(formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Card className="border-0 shadow-none">
      <CardContent className="p-0">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back</h2>
          <p className="text-slate-600">Login to manage your restaurant</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-700 font-medium">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@restaurant.com"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loginMutation.isPending}
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-slate-700 font-medium">
              Password
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loginMutation.isPending}
              className="h-11"
            />
          </div>
          <Button
            type="submit"
            className="w-full h-11 bg-orange-500 hover:bg-orange-600 text-white"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Login"
            )}
          </Button>
          <div className="text-center text-sm">
            <span className="text-slate-600">Don't have an account? </span>
            <Link
              to="/register"
              className="text-orange-600 hover:text-orange-700 font-semibold"
            >
              Register
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
