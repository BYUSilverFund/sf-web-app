import React from "react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center bg-gray-50">
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col items-center justify-center text-center">
          {/* 404 Number with BYU Blue gradient */}
          <div className="mb-8">
            <h1
              className="text-9xl font-bold bg-gradient-to-r from-[#002A5C] to-[#0057B8] bg-clip-text text-transparent"
              aria-label="404 Error"
            >
              404
            </h1>
          </div>

          {/* Error Message */}
          <div className="mb-8 max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 mb-4">
              Page Not Found
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-2">
              The page you&apos;re looking for doesn&apos;t exist or has been
              moved.
            </p>
            <p className="text-base text-gray-500">
              Check the URL or return to the homepage to continue exploring BYU
              Silver Fund.
            </p>
          </div>

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <Link
              href="/"
              className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white bg-[#002A5C] rounded-md hover:bg-[#003d7a] transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
