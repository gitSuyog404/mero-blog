import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import {
  FaUser,
  FaEdit,
  FaBookOpen,
  FaCog,
  FaChevronLeft,
  FaChevronRight,
  FaHome,
  FaInfoCircle,
  FaCrown,
} from "react-icons/fa";

interface SidebarProps {
  className?: string;
  isMobileOpen?: boolean;
  onMobileToggle?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  className = "",
  isMobileOpen = false,
  onMobileToggle,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const { userInfo } = useSelector((state: RootState) => state.auth);

  const getDisplayName = (user: any) => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    } else if (user?.firstName) {
      return user.firstName;
    } else if (user?.lastName) {
      return user.lastName;
    }
    return user?.username || "User";
  };

  const getInitials = (user: any) => {
    const displayName = getDisplayName(user);
    return displayName
      .split(" ")
      .map((word: string) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const baseSidebarItems = [
    {
      name: "Home",
      href: "/",
      icon: FaHome,
      description: "Go to homepage",
    },
    {
      name: "Stories",
      href: "/blogs",
      icon: FaBookOpen,
      description: "Browse all stories",
    },
    {
      name: "Write",
      href: "/write",
      icon: FaEdit,
      description: "Create your first story",
    },
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: FaUser,
      description: "Manage your content",
    },
    {
      name: "Profile",
      href: "/profile",
      icon: FaCog,
      description: "Account settings",
    },
  ];

  const adminSidebarItems = [
    {
      name: "Admin Panel",
      href: "/admin",
      icon: FaCrown,
      description: "Manage platform",
    },
  ];

  const aboutItem = {
    name: "About",
    href: "/about",
    icon: FaInfoCircle,
    description: "Learn more about us",
  };

  const sidebarItems = [
    ...baseSidebarItems,
    ...(userInfo?.role === "admin" ? adminSidebarItems : []),
    aboutItem,
  ];

  return (
    <>
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            className="fixed inset-0 z-5 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onMobileToggle?.()}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            className="fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 shadow-lg z-10 lg:hidden flex flex-col"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="p-4 sm:p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <motion.div
                    className="w-10 h-10 bg-gradient-to-br from-gray-900 to-gray-700 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    {getInitials(userInfo)}
                  </motion.div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {getDisplayName(userInfo)}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {userInfo?.email}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <motion.div
                    key={item.name}
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link
                      to={item.href}
                      className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? "bg-gray-900 text-white shadow-md"
                          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      }`}
                      onClick={() => onMobileToggle?.()}
                    >
                      <Icon
                        className={`w-5 h-5 ${
                          isActive ? "text-white" : "text-gray-500"
                        }`}
                      />
                      <span className="truncate">{item.name}</span>
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            <div className="p-4 border-t border-gray-100 bg-gray-50">
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-2">MeroBlog Dashboard</p>
                <p className="text-xs text-gray-400">
                  © 2024 All rights reserved
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className={`h-full bg-white border-r border-gray-200 shadow-sm flex-col ${className}`}
        animate={isCollapsed ? { width: 80 } : { width: 256 }}
        initial={{ width: 256 }}
        transition={{ duration: 0.3 }}
      >
        <div className="p-4 sm:p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center justify-between">
            <AnimatePresence>
              {!isCollapsed && (
                <motion.div
                  className="flex items-center space-x-3"
                  initial={{ opacity: 1, width: "auto", x: 0 }}
                  animate={{ opacity: 1, width: "auto", x: 0 }}
                  exit={{ opacity: 0, width: 0, x: -10 }}
                  transition={{ duration: 0.3, delay: 0.15 }}
                >
                  <motion.div
                    className="relative w-10 h-10 bg-gradient-to-br from-gray-800 to-gray-900 text-white rounded-full flex items-center justify-center text-sm font-semibold shadow-md ring-2 ring-white"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {userInfo ? getInitials(userInfo) : "U"}

                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {userInfo ? getDisplayName(userInfo) : "User"}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      @{userInfo?.username || "username"}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors shadow-sm border border-gray-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isCollapsed ? (
                <FaChevronRight className="w-4 h-4 text-gray-600" />
              ) : (
                <FaChevronLeft className="w-4 h-4 text-gray-600" />
              )}
            </motion.button>
          </div>
        </div>

        <div className="flex-1 py-4 sm:py-6">
          <nav className="space-y-1 px-3 sm:px-4">
            <AnimatePresence>
              {!isCollapsed && (
                <motion.div
                  className="px-3 py-2"
                  initial={{ opacity: 1, width: "auto", x: 0 }}
                  animate={{ opacity: 1, width: "auto", x: 0 }}
                  exit={{ opacity: 0, width: 0, x: -10 }}
                  transition={{ duration: 0.3, delay: 0.15 }}
                >
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Navigation
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;

              return (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                >
                  <Link
                    to={item.href}
                    className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative ${
                      isActive
                        ? "bg-gray-900 text-white shadow-md"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full"
                        layoutId="activeIndicator"
                        transition={{ duration: 0.2 }}
                      />
                    )}

                    <Icon
                      className={`w-5 h-5 flex-shrink-0 ${
                        isActive
                          ? "text-white"
                          : "text-gray-500 group-hover:text-gray-700"
                      }`}
                    />
                    <AnimatePresence>
                      {!isCollapsed && (
                        <motion.div
                          className="flex-1 min-w-0"
                          initial={{ opacity: 1, width: "auto", x: 0 }}
                          animate={{ opacity: 1, width: "auto", x: 0 }}
                          exit={{ opacity: 0, width: 0, x: -10 }}
                          transition={{ duration: 0.3, delay: 0.15 }}
                        >
                          <p className="text-sm font-medium truncate">
                            {item.name}
                          </p>
                          <p
                            className={`text-xs truncate ${
                              isActive ? "text-gray-300" : "text-gray-500"
                            }`}
                          >
                            {item.description}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Link>
                </motion.div>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-gray-100">
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                className="text-center"
                initial={{ opacity: 1, width: "auto", x: 0 }}
                animate={{ opacity: 1, width: "auto", x: 0 }}
                exit={{ opacity: 0, width: 0, x: -10 }}
                transition={{ duration: 0.3, delay: 0.15 }}
              >
                <p className="text-xs text-gray-500 mb-2">
                  Start your writing journey
                </p>
                <Link
                  to="/write"
                  className="inline-flex items-center justify-center w-full px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <FaEdit className="w-4 h-4 mr-2" />
                  Write Now
                </Link>
              </motion.div>
            )}
          </AnimatePresence>

          {isCollapsed && (
            <motion.div
              className="flex justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Link
                to="/write"
                className="p-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                title="Write Now"
              >
                <FaEdit className="w-4 h-4" />
              </Link>
            </motion.div>
          )}
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;
