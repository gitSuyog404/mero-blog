import React from "react";
import { motion } from "framer-motion";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false,
  className = "",
}) => {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    range.push(1);

    const start = Math.max(2, currentPage - delta);
    const end = Math.min(totalPages - 1, currentPage + delta);

    if (start > 2) {
      rangeWithDots.push(1);
      if (start > 3) {
        rangeWithDots.push("...");
      }
    } else {
      rangeWithDots.push(1);
    }

    for (let i = start; i <= end; i++) {
      if (i !== 1 && i !== totalPages) {
        rangeWithDots.push(i);
      }
    }

    if (end < totalPages - 1) {
      if (end < totalPages - 2) {
        rangeWithDots.push("...");
      }
      rangeWithDots.push(totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return [...new Set(rangeWithDots)].sort((a, b) => {
      if (typeof a === "number" && typeof b === "number") {
        return a - b;
      }
      return 0;
    });
  };

  const visiblePages = getVisiblePages();

  const handlePageClick = (page: number) => {
    if (page !== currentPage && !isLoading) {
      onPageChange(page);

      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1 && !isLoading) {
      handlePageClick(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages && !isLoading) {
      handlePageClick(currentPage + 1);
    }
  };

  return (
    <motion.div
      className={`flex items-center justify-center space-x-2 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.button
        onClick={handlePrevious}
        disabled={currentPage === 1 || isLoading}
        className={`flex items-center justify-center w-10 h-10 rounded-lg border transition-all duration-200 ${
          currentPage === 1 || isLoading
            ? "border-gray-200 text-gray-400 cursor-not-allowed"
            : "border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
        }`}
        whileHover={currentPage > 1 && !isLoading ? { scale: 1.05 } : {}}
        whileTap={currentPage > 1 && !isLoading ? { scale: 0.95 } : {}}
      >
        <FaChevronLeft className="w-4 h-4" />
      </motion.button>

      <div className="flex items-center space-x-1">
        {visiblePages.map((page, index) => {
          if (page === "...") {
            return (
              <span
                key={`dots-${index}`}
                className="px-3 py-2 text-gray-500 select-none"
              >
                ...
              </span>
            );
          }

          const pageNumber = page as number;
          const isCurrentPage = pageNumber === currentPage;

          return (
            <motion.button
              key={pageNumber}
              onClick={() => handlePageClick(pageNumber)}
              disabled={isLoading}
              className={`w-10 h-10 rounded-lg border font-medium transition-all duration-200 ${
                isCurrentPage
                  ? "bg-gray-900 text-white border-gray-900"
                  : isLoading
                  ? "border-gray-200 text-gray-400 cursor-not-allowed"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
              }`}
              whileHover={!isCurrentPage && !isLoading ? { scale: 1.05 } : {}}
              whileTap={!isCurrentPage && !isLoading ? { scale: 0.95 } : {}}
            >
              {pageNumber}
            </motion.button>
          );
        })}
      </div>

      <motion.button
        onClick={handleNext}
        disabled={currentPage === totalPages || isLoading}
        className={`flex items-center justify-center w-10 h-10 rounded-lg border transition-all duration-200 ${
          currentPage === totalPages || isLoading
            ? "border-gray-200 text-gray-400 cursor-not-allowed"
            : "border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
        }`}
        whileHover={
          currentPage < totalPages && !isLoading ? { scale: 1.05 } : {}
        }
        whileTap={currentPage < totalPages && !isLoading ? { scale: 0.95 } : {}}
      >
        <FaChevronRight className="w-4 h-4" />
      </motion.button>

      {isLoading && (
        <div className="flex items-center space-x-2 ml-4">
          <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
          <span className="text-sm text-gray-500">Loading...</span>
        </div>
      )}
    </motion.div>
  );
};

export default Pagination;
