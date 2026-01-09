import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import CountryCard from '../CountryCard';

export const ItemTypes = {
    CARD: 'card',
};

export const DraggableCard = ({ country, mode, statisticValue }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: ItemTypes.CARD,
        item: { country },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));

    return (
        <div
            ref={drag}
            style={{
                opacity: isDragging ? 0.5 : 1,
                cursor: 'move',
                width: '100%',
                maxWidth: '220px', // Match existing card width roughly
                display: 'flex', // Enable flex
                justifyContent: 'center', // Center content horizontally
                alignItems: 'center' // Center content vertically
            }}
        >
            <CountryCard
                country={country}
                mode={mode}
                statisticValue={statisticValue}
                isFlippable={false}
                isClickable={false}
            />
        </div>
    );
};

export const DropZone = ({ onDrop, index, isEmpty }) => {
    const [{ isOver, canDrop }, drop] = useDrop(() => ({
        accept: ItemTypes.CARD,
        drop: (item) => onDrop(index, item.country),
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
            canDrop: !!monitor.canDrop(),
        }),
    }));

    let className = 'drop-zone';
    if (isOver && canDrop) {
        className += ' active-drop';
    }
    if (isEmpty) {
        className += ' empty-drop';
    }

    return (
        <div
            ref={drop}
            className={className}
        >
            {/* Visual indicator handled by CSS */}
        </div>
    );
};
