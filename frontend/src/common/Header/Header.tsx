
import { Link } from "react-router-dom";

function Header() {


  return (
    <nav className="fixed top-0 left-0 w-full flex justify-between items-center px-6 md:px-12 py-3 bg-white border-b shadow-sm">
      <Link
        to="/"
        className="text-lg sm:text-xl font-bold font-serif text-blue-600"
      >
        Cognocore
      </Link>

      <div className="flex items-center space-x-2 md:space-x-4 w-full">
        <Link
          to="/createTask"
          className="hover:text-teal-500 text-base font-medium w-full"
        >
          Create Task
        </Link>
        <Link
          to="/"
          className="hover:text-teal-500 text-base font-medium w-full"
        >
          Dashboard
        </Link>

        
      </div>
    </nav>
  );
}

export default Header;
