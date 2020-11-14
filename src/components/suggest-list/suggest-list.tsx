import React from 'react';
import styles from './suggest-list.module.css';

interface SuggestListProps {
    items: any[];
    onDragStart: () => void;
    onDragEnd: () => void;
}

export const SuggestList = ({ items, onDragStart, onDragEnd }: SuggestListProps) => {
    return (
        <div className={styles.list}>
            <div className={styles.title}>Drag type to appropriate file</div>
            {items.map((data, index) => {
                return (
                    <div
                        key={index}
                        className={styles.item}
                        draggable
                        onDragStart={e => {
                            console.log('START', e);
                            // @ts-ignore
                            console.log('START this', this);
                            const ghost = document.createElement('div');
                            ghost.id = 'ghost';
                            ghost.innerText = data;
                            ghost.style.display = 'inline-block';
                            ghost.style.position = 'absolute';
                            ghost.style.left = '-9999px';
                            ghost.className = 'ghost';
                            document.body.appendChild(ghost);
                            e.dataTransfer.setData('fileType', data);
                            console.log(ghost.getBoundingClientRect());
                            const xOffset = ghost.getBoundingClientRect().width / 2;
                            e.dataTransfer.setDragImage(ghost, xOffset, 40);
                            onDragStart();
                        }}
                        onDragEnd={e => {
                            console.log('DRAG END', e);
                            document.getElementById('ghost')?.remove();
                            onDragEnd();
                        }}
                    >
                        {data}
                    </div>
                );
            })}
        </div>
    );
};
