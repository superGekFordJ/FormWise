import React from 'react';
import { Button } from '@/components/ui/button';

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const TablePagination: React.FC<TablePaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const handlePrevPage = () => {
    if (currentPage > 0) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="flex items-center justify-between_p-4_border-t">
      <Button onClick={handlePrevPage} disabled={currentPage === 0} variant="outline">
        Previous
      </Button>
      <span className="text-sm_text-muted-foreground">
        Page {currentPage + 1} of {totalPages}
      </span>
      <Button onClick={handleNextPage} disabled={currentPage >= totalPages - 1} variant="outline">
        Next
      </Button>
    </div>
  );
};

export default TablePagination;
