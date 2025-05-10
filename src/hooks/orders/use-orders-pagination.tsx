
import { useCallback } from 'react';

export const useOrdersPagination = (
  setPage: (page: number) => void
) => {
  const handlePageChange = useCallback((newPage: number) => {
    console.log("Changing to page:", newPage);
    setPage(newPage);
  }, [setPage]);

  return { handlePageChange };
};
