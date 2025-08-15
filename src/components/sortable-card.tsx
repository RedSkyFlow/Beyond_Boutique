
'use client';

import * as React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { CardHeader } from './ui/card';

interface SortableCardProps {
  id: string;
  children: React.ReactNode;
}

export function SortableCard({ id, children }: SortableCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Find the CardHeader in children and add the drag handle
  const childrenWithHandle = React.Children.map(children, (child) => {
    if (React.isValidElement(child) && (child.type === 'div' || (child.type as any).displayName === 'Card')) {
        const cardChildren = React.Children.toArray((child.props as any).children);
        const headerIndex = cardChildren.findIndex((c: any) => c.type === CardHeader);
        
        if (headerIndex !== -1) {
            const header = cardChildren[headerIndex] as React.ReactElement;
            const newHeader = React.cloneElement(
                header,
                {},
                <>
                    <button {...attributes} {...listeners} className="absolute top-4 right-4 p-1 text-muted-foreground cursor-grab active:cursor-grabbing focus:outline-none focus:ring-2 focus:ring-ring rounded-sm">
                        <GripVertical className="h-5 w-5" />
                    </button>
                    {header.props.children}
                </>
            );
            cardChildren[headerIndex] = newHeader;
            return React.cloneElement(child, {}, ...cardChildren);
        }
    }
    return child;
  });

  return (
    <div ref={setNodeRef} style={style} className="relative touch-none">
      {childrenWithHandle}
    </div>
  );
}
