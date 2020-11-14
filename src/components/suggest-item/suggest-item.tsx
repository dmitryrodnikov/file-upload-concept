import React, { useCallback } from 'react';
import styles from './suggest-item.module.scss';

interface SuggestItemProps {
    label: string;
    data: string;
    onDragStart: VoidFunction;
    onDragEnd: VoidFunction;
}

const GHOST_ID = 'ghost';

export const SuggestItem = ({ label, data, onDragStart, onDragEnd }: SuggestItemProps) => {
    const handleDragStart = useCallback(
        (e: React.DragEvent<HTMLDivElement>) => {
            const ghost = document.createElement('div');
            ghost.id = GHOST_ID;
            ghost.innerText = label;
            ghost.style.display = 'inline-block';
            ghost.style.position = 'absolute';
            ghost.style.left = '-9999px';
            ghost.className = styles.ghost;
            document.body.appendChild(ghost);

            const xOffset = ghost.getBoundingClientRect().width / 2;

            e.dataTransfer.setData('fileType', data);
            e.dataTransfer.setDragImage(ghost, xOffset, 40);

            onDragStart();
        },
        [label, data, onDragStart],
    );

    const handleDragEnd = useCallback(() => {
        document.getElementById(GHOST_ID)?.remove();
        onDragEnd();
    }, [onDragEnd]);

    return (
        <div className={styles.item} draggable onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div>{label}</div>
            <div className={styles.shadow} />
        </div>
    );
};
