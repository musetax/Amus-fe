export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <img
        src="https://cdn-icons-png.flaticon.com/512/2748/2748558.png" // Replace with your preferred image
        alt="404 Not Found"
        className="w-64 h-64 mb-6"
      />
      <h1 className="text-4xl font-bold text-gray-800 mb-2">404 - Page Not Found</h1>
      <p className="text-gray-600 text-lg">
        Sorry, the page you're looking for doesn't exist.
      </p>
    </div>
  );
}
