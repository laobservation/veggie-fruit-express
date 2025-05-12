
import React from 'react';
import { Slide } from '@/types/slider';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardFooter 
} from '@/components/ui/card';
import { Edit, Trash, MoveHorizontal } from 'lucide-react';

interface SlideCardProps {
  slide: Slide;
  onEdit: (slide: Slide) => void;
  onDelete: (slideId: string) => void;
  disableDelete: boolean;
  onMoveLeft?: (slideId: string) => void;
  onMoveRight?: (slideId: string) => void;
  isFirst?: boolean;
  isLast?: boolean;
}

const SlideCard: React.FC<SlideCardProps> = ({ 
  slide, 
  onEdit, 
  onDelete, 
  disableDelete,
  onMoveLeft,
  onMoveRight,
  isFirst,
  isLast
}) => {
  return (
    <Card key={slide.id} className="overflow-hidden">
      <div 
        className="h-[120px] bg-cover bg-center relative" 
        style={{ 
          backgroundImage: slide.image ? `url(${slide.image})` : undefined,
          backgroundColor: !slide.image ? 'gray' : undefined 
        }}
      >
        {!slide.image && (
          <div className="absolute bottom-2 right-2 bg-white/70 text-xs px-2 py-1 rounded">
            No image set
          </div>
        )}
      </div>
      <CardContent className="pt-4">
        <div className="flex gap-2 mb-2 flex-wrap">
          <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
            Position: {slide.position || 'left'}
          </span>
          <span 
            className="text-xs px-2 py-1 rounded-full text-white"
            style={{ backgroundColor: slide.color?.includes('bg-') ? 
              `var(--${slide.color.replace('bg-', '')})` : 
              slide.color 
            }}
          >
            {slide.color?.replace('bg-', '') || 'default'}
          </span>
        </div>
        <p className="text-sm font-medium mb-1 truncate">{slide.title}</p>
        <p className="text-sm text-gray-500 truncate">{slide.image || 'No image URL'}</p>
        
        {/* Reorder buttons */}
        {(onMoveLeft || onMoveRight) && (
          <div className="flex justify-center mt-3 gap-2 border-t pt-3">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onMoveLeft && onMoveLeft(slide.id)} 
              disabled={isFirst}
              className="px-2"
              title="Move left"
            >
              <MoveHorizontal className="h-4 w-4 mr-1 rotate-180" />
              <span className="sr-only">Move left</span>
            </Button>
            <Button
              variant="outline" 
              size="sm" 
              onClick={() => onMoveRight && onMoveRight(slide.id)} 
              disabled={isLast}
              className="px-2"
              title="Move right"
            >
              <MoveHorizontal className="h-4 w-4 mr-1" />
              <span className="sr-only">Move right</span>
            </Button>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end gap-2 pt-0">
        <Button variant="outline" size="sm" onClick={() => onEdit(slide)}>
          <Edit className="h-4 w-4 mr-1" />
          Edit
        </Button>
        <Button 
          variant="destructive" 
          size="sm" 
          onClick={() => onDelete(slide.id)}
          disabled={disableDelete}
        >
          <Trash className="h-4 w-4 mr-1" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SlideCard;
