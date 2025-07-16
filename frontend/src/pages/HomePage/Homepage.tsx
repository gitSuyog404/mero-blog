import React from "react";

const Homepage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Welcome to MeroBlog
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover stories, thinking, and expertise from writers on any topic.
          </p>
          <button className="bg-gray-900 text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-gray-800 transition-colors duration-200">
            Start Reading
          </button>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Featured Stories
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-200"
              >
                <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Sample Blog Post {item}
                </h3>
                <p className="text-gray-600 mb-4">
                  This is a sample blog post description that gives readers an
                  idea of what the article is about...
                </p>
                <div className="flex items-center text-sm text-gray-500">
                  <span>John Doe</span>
                  <span className="mx-2">•</span>
                  <span>5 min read</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional content to test scroll behavior */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Join Our Community
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Connect with writers and readers from around the world.
          </p>
          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <button className="w-full sm:w-auto bg-gray-900 text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-gray-800 transition-colors duration-200">
              Sign Up
            </button>
            <button className="w-full sm:w-auto border border-gray-300 text-gray-700 px-8 py-3 rounded-full text-lg font-medium hover:bg-gray-50 transition-colors duration-200">
              Learn More
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Homepage;
