import Image from "next/image";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <Image
        src="https://cdn-icons-png.flaticon.com/512/2748/2748558.png"
        alt="404 Not Found"
        width={256}
        height={256}
        className="mb-6"
        priority // Optional: ensures it loads quickly since it's a key element
      />
      <h1 className="text-4xl font-bold text-gray-800 mb-2">404 - Page Not Found</h1>
      <p className="text-gray-600 text-lg">
        Sorry, the page you're looking for doesn't exist.
      </p>
    </div>
  );
}
