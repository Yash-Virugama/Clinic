import { useCallback, useEffect, useMemo, useState } from "react";
import { scrollClinicContentToTop } from "../utils/clinicFormatters";

const useClinicPagination = (items, pageSize, resetKey = "") => {
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [resetKey]);

  const totalPages = Math.ceil(items.length / pageSize);
  const pageItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, currentPage, pageSize]);

  const handlePageChange = useCallback((pageNumber) => {
    setCurrentPage(pageNumber);
    scrollClinicContentToTop();
  }, []);

  return {
    currentPage,
    pageItems,
    totalPages,
    handlePageChange,
  };
};

export default useClinicPagination;
