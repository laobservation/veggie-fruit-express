
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { Order } from '@/types/order';
import { OrderCard } from './OrderCard';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';

interface OrdersListProps {
  orders: Order[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  onRefresh: () => void;
  onView: (order: Order) => void;
  onDelete: (orderId: number) => void;
  onUpdateStatus: (orderId: number, status: string) => void;
  onGeneratePDF: (order: Order) => void;
  onPageChange: (page: number) => void;
}

export const OrdersList: React.FC<OrdersListProps> = ({
  orders,
  loading,
  onRefresh,
  onView,
  onDelete,
  onUpdateStatus,
  onGeneratePDF,
  currentPage,
  totalPages,
  onPageChange
}) => {
  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    // Always show first page
    pageNumbers.push(1);
    
    if (totalPages <= maxVisiblePages) {
      // If we have 5 or fewer pages, show all of them
      for (let i = 2; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // For many pages, show current page and some neighbors
      if (currentPage > 3) {
        pageNumbers.push('...');
      }
      
      // Show neighbors
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }
      
      if (currentPage < totalPages - 2) {
        pageNumbers.push('...');
      }
      
      // Always show last page if more than 1 page
      if (totalPages > 1) {
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Gestion des Commandes</h2>
        <Button 
          onClick={onRefresh} 
          variant="outline" 
          className="flex items-center"
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Actualiser
        </Button>
      </div>

      {orders.length === 0 ? (
        <p className="text-center py-8 text-gray-500">
          {loading ? 'Chargement des commandes...' : 'Aucune commande trouvée.'}
        </p>
      ) : (
        <div className="space-y-4">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Adresse</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onView={onView}
                    onDelete={onDelete}
                    onUpdateStatus={onUpdateStatus}
                    onGeneratePDF={onGeneratePDF}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination className="mt-4">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => currentPage > 1 && onPageChange(currentPage - 1)} 
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
                
                {getPageNumbers().map((pageNumber, index) => (
                  <PaginationItem key={index}>
                    {pageNumber === '...' ? (
                      <span className="flex h-9 w-9 items-center justify-center">...</span>
                    ) : (
                      <PaginationLink
                        isActive={currentPage === pageNumber}
                        onClick={() => typeof pageNumber === 'number' && onPageChange(pageNumber)}
                        className="cursor-pointer"
                      >
                        {pageNumber}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      )}
    </div>
  );
};
