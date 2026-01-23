import BrandingSidebar from "./BrandingSidebar";
import MobileLogo from "./MobileLogo";

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex">
      <BrandingSidebar />
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-lg">
          <MobileLogo />
          {children}
        </div>
      </div>
    </div>
  );
}
