export const Header = () => {
  return (
    <header className="bg-white shadow">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            🗺️ IT Planet Map
          </h1>
          <div className="flex gap-4">
            <a href="#" className="text-gray-600 hover:text-gray-900 transition">
              About
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900 transition">
              Features
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900 transition">
              Contacts
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
};
