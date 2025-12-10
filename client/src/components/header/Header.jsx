import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function Header() {
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();

  return (
    <header className="bg-gray-100 border-b-3 shadow-md">
      <nav className="flex items-center ml-15 px-1 py-4 space-x-10">

        {/* Logo */}
        <NavLink
          to="/"
          className="flex items-center space-x-3 transform hover:scale-105 transition-transform duration-300"
        >
          <img
            src="/images/logo.png"
            alt="Library Logo"
            className="h-12 w-12 object-contain rounded-full border-2 border-gray-300 shadow-md"
          />
          <span className="text-2xl font-extrabold text-gray-800 drop-shadow-md">
            Online Library
          </span>
        </NavLink>

        {/* Navigation links */}
        <div className="flex items-center space-x-5">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `px-3 py-2 rounded-md font-medium transition ${
                isActive
                  ? "bg-blue-500 text-white"
                  : "bg-sky-200 text-sky-700 hover:bg-sky-200 hover:text-sky-900"
              }`
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/catalog"
            className={({ isActive }) => {
              const active =
                isActive || location.pathname.startsWith("/book/details");
              return `px-3 py-2 rounded-md font-medium transition ${
                active
                  ? "bg-blue-500 text-white"
                  : "bg-sky-200 text-sky-700 hover:bg-sky-200 hover:text-sky-900"
              }`;
            }}
          >
            Catalog
          </NavLink>

          {/* Authenticated links */}
          {isAuthenticated ? (
            <>
              <NavLink
                to="/addbook"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md font-medium transition ${
                    isActive
                      ? "bg-blue-500 text-white"
                      : "bg-sky-200 text-sky-700 hover:bg-sky-200 hover:text-sky-900"
                  }`
                }
              >
                Add Book
              </NavLink>
              
              <NavLink
                to="/borrowedbooks"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md font-medium transition ${
                    isActive
                      ? "bg-blue-500 text-white"
                      : "bg-sky-200 text-sky-700 hover:bg-sky-200 hover:text-sky-900"
                  }`
                }
              >
                Borrowed Books
              </NavLink>

              <NavLink
                to="/logout"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md font-medium transition ${
                    isActive
                      ? "bg-blue-500 text-white"
                      : "bg-sky-200 text-sky-700 hover:bg-sky-200 hover:text-sky-900"
                  }`
                }
              >
                Logout
              </NavLink>

              <div className="ml-4 px-3 py-2 bg-green-100 text-green-800 font-semibold rounded-lg shadow flex items-center">
                Hello,&nbsp;
                <span className="font-bold">{user.username}</span>
              </div>
            </>
          ) : (
            <>
              <NavLink
                to="/register"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md font-medium transition ${
                    isActive
                      ? "bg-blue-500 text-white"
                      : "bg-sky-200 text-sky-700 hover:bg-sky-200 hover:text-sky-900"
                  }`
                }
              >
                Register
              </NavLink>

              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md font-medium transition ${
                    isActive
                      ? "bg-blue-500 text-white"
                      : "bg-sky-200 text-sky-700 hover:bg-sky-200 hover:text-sky-900"
                  }`
                }
              >
                Login
              </NavLink>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}