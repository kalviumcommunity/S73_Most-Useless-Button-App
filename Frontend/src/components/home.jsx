import React from "react"


export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-4">Most Useless Button App</h1>
      <p className="text-lg mb-6">
        Click a button that does absolutely nothing useful... but you still want to try!
      </p>
      <button className="px-6 py-3 bg-blue-500 rounded-lg text-white text-lg hover:bg-blue-600">
        Click Me!
      </button>
    </div>
  );
}

