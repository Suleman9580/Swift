export const BACKEND_URL="https://swift-inxn.onrender.com"
// export const BACKEND_URL="http://localhost:3000"


export const MOCK_FILE_DATA = `import React from 'react';
import { Menu, X } from 'lucide-react';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex justify-start lg:w-0 lg:flex-1">
            <a href="#" className="text-2xl font-bold text-gray-900">
              Your Logo
            </a>
          </div>
          
          <nav className="hidden md:flex space-x-10">
            <a href="#" className="text-base font-medium text-gray-500 hover:text-gray-900">
              Home
            </a>
            <a href="#" className="text-base font-medium text-gray-500 hover:text-gray-900">
              About
            </a>
            <a href="#" className="text-base font-medium text-gray-500 hover:text-gray-900">
              Services
            </a>
            <a href="#" className="text-base font-medium text-gray-500 hover:text-gray-900">
              Contact
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;`