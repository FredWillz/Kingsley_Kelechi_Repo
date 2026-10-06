import { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import { baseNavItems, adminNavItems } from "./navItems.js";
import { CloseIcon } from "../Navbar/icons.jsx";
import { LogoutIcon } from "./icons.jsx";
import { structuredUserData } from "../../utils/data.js";

function getInitials(name) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  return parts
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // console.log(user);

  useEffect(() => {
    if (!open) return;
    function handleKeyDown(event) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  const navItems =
    user?.role === "admin" ? [...baseNavItems, ...adminNavItems] : baseNavItems;

  async function handleLogout() {
    await logout();
    // Deferred: clearing the session while still mounted under RequireAuth triggers its
    // own redirect to /login first. Navigating on the next tick lands on the landing page
    // afterward instead of racing it.
    setTimeout(() => navigate("/", { replace: true }), 0);
  }

  const structuredUser = structuredUserData.find(
    (item) => item.accountNumber === user?.accountNumber,
  );

  const profileImage = user?.profilePictureUrl || structuredUser?.image;

  return (
    <>
      {open && (
        <div
          onClick={onClose}
          aria-hidden="true"
          className="fixed inset-0 z-30 bg-text-primary/50 lg:hidden"
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 shrink-0 -translate-x-full flex-col overflow-y-auto border-r border-text-secondary/10 bg-background px-4 py-6 transition-transform duration-200 lg:static lg:z-0 lg:translate-x-0 ${
          open ? "translate-x-0" : ""
        }`}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="flex p-1 mb-4 ml-auto rounded-sm text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary lg:hidden"
        >
          <CloseIcon width="20" height="20" />
        </button>

        {/* <div className="flex items-center gap-3 pb-4 border-b border-text-secondary/10">
          {user?.accountNumber === "2799985143" ? (
            <img
              src={demoTestImageI}
              alt={user?.name}
              className="flex items-center justify-center object-cover text-sm font-semibold rounded-full h-11 w-11 shrink-0"
            />
          ) : user?.accountNumber === "5954522655" ? (
            <img
              src={demoTestImageII}
              alt={user?.name}
              className="flex items-center justify-center object-cover text-sm font-semibold rounded-full h-11 w-11 shrink-0"
            />
          ) : (
            <span className="flex items-center justify-center text-sm font-semibold rounded-full h-11 w-11 shrink-0 bg-primary font-heading text-text-on-primary">
              {getInitials(user?.name)}
            </span>
          )}
          
          
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate font-heading text-text-primary">
              {user?.name}
            </p>
            <p className="text-xs truncate font-body text-text-secondary">
              {user?.email}
            </p>
            <p className="mt-0.5 font-body text-xs text-text-secondary">
              Account:{" "}
              <span className="font-medium text-primary">
                {user?.accountNumber}
              </span>
            </p>
          </div>
        </div> */}

        <div className="flex items-center gap-3 pb-4 border-b border-text-secondary/10">
          {profileImage ? (
            <img
              src={profileImage}
              alt={user?.name}
              className="flex items-center justify-center object-cover text-sm font-semibold rounded-full h-11 w-11 shrink-0"
            />
          ) : (
            <span className="flex items-center justify-center text-sm font-semibold rounded-full h-11 w-11 shrink-0 bg-primary font-heading text-text-on-primary">
              {getInitials(user?.name)}
            </span>
          )}

          <div className="min-w-0">
            <p className="text-sm font-semibold truncate font-heading text-text-primary">
              {user?.name}
            </p>

            <p className="text-xs truncate font-body text-text-secondary">
              {user?.email}
            </p>

            <p className="mt-0.5 font-body text-xs text-text-secondary">
              Account:{" "}
              <span className="font-medium text-primary">
                {user?.accountNumber}
              </span>
            </p>
          </div>
        </div>

        <nav aria-label="Dashboard" className="flex flex-col flex-1 gap-1 mt-4">
          {navItems.map((item) => (
            <div key={item.to}>
              <NavLink
                to={item.to}
                end={item.end}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 rounded-md px-3 py-2 font-body text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-text-primary hover:bg-surface"
                  }`
                }
              >
                <item.icon className="w-5 h-5 shrink-0" />
                {item.label}
              </NavLink>
              {item.children && (
                <div className="flex flex-col gap-1 pl-3 mt-1 ml-8 border-l border-text-secondary/10">
                  {item.children.map((child) => (
                    <NavLink
                      key={child.to}
                      to={child.to}
                      onClick={onClose}
                      className={({ isActive }) =>
                        `rounded-sm px-2 py-1.5 font-body text-sm transition-colors ${
                          isActive
                            ? "font-medium text-primary"
                            : "text-text-secondary hover:text-primary"
                        }`
                      }
                    >
                      {child.label}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={handleLogout}
            className="mt-2 flex items-center gap-2.5 rounded-md px-3 py-2 text-left font-body text-sm font-medium text-text-primary transition-colors hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <LogoutIcon className="w-5 h-5 shrink-0" />
            Logout
          </button>
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;
