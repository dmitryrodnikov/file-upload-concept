import React, { useCallback } from 'react';
import styles from './suggest-item.module.scss';
import cn from 'classnames';
import { ReactComponent as CheckIcon } from '../../assets/icon-check.svg';

interface SuggestItemProps {
    label: string;
    data: string;
    amount?: number;
    onDragStart: VoidFunction;
    onDragEnd: VoidFunction;
}

const GHOST_ID = 'ghost';

export const SuggestItem = ({ label, data, amount, onDragStart, onDragEnd }: SuggestItemProps) => {
    const handleDragStart = useCallback(
        (e: React.DragEvent<HTMLDivElement>) => {
            const ghost = document.createElement('div');
            ghost.id = GHOST_ID;
            ghost.innerText = label;
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
        <div
            className={cn(styles.item, { [styles.disabled]: !amount })}
            draggable={Boolean(amount)}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className={styles.content}>
                <div>{label}</div>
                <div className={styles.count}>{amount ? amount : <CheckIcon />}</div>
            </div>
            <div className={styles.shadow} />
        </div>
    );
};
