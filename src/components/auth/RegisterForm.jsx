import { useState } from "react";
import { Link } from "react-router-dom";
import { useRegister } from "../../hooks/useAuth";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent } from "../ui/card";
import { Loader2, Store, User } from "lucide-react";

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    restaurantName: "",
    ownerName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const registerMutation = useRegister();

  registerMutation.error && !error && setError(
    registerMutation.error.response?.data?.message ||
      "Registration failed. Please try again."
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    if (!/(?=.*[a-zA-Z])(?=.*[0-9])/.test(formData.password)) {
      setError("Password must contain at least one letter and one number");
      return;
    }

    const registerData = {
      name: formData.ownerName,
      email: formData.email,
      password: formData.password,
      restaurantName: formData.restaurantName,
    };
    
    registerMutation.mutate(registerData);
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
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Create Your Restaurant Account</h2>
          <p className="text-slate-600">Start managing your restaurant today</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="restaurantName" className="text-slate-700 font-medium">
              Restaurant Name
            </Label>
            <div className="relative">
              <Store className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <Input
                id="restaurantName"
                name="restaurantName"
                type="text"
                placeholder="Your Restaurant Name"
                value={formData.restaurantName}
                onChange={handleChange}
                required
                disabled={registerMutation.isPending}
                className="h-11 pl-10"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="ownerName" className="text-slate-700 font-medium">
              Owner Name
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <Input
                id="ownerName"
                name="ownerName"
                type="text"
                placeholder="John Doe"
                value={formData.ownerName}
                onChange={handleChange}
                required
                disabled={registerMutation.isPending}
                className="h-11 pl-10"
              />
            </div>
          </div>
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
              disabled={registerMutation.isPending}
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
              placeholder="Create a strong password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={registerMutation.isPending}
              className="h-11"
            />
            <p className="text-xs text-slate-500">
              At least 8 characters with one letter and one number
            </p>
          </div>
          <Button
            type="submit"
            className="w-full h-11 bg-orange-500 hover:bg-orange-600 text-white"
            disabled={registerMutation.isPending}
          >
            {registerMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>
          <div className="text-center text-sm">
            <span className="text-slate-600">Already have an account? </span>
            <Link
              to="/login"
              className="text-orange-600 hover:text-orange-700 font-semibold"
            >
              Login
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
