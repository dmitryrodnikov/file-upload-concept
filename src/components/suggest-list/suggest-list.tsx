import React from 'react';
import styles from './suggest-list.module.scss';
import { SuggestItem } from '../suggest-item/suggest-item';

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
                    <SuggestItem key={index} data={data} label={data} onDragStart={onDragStart} onDragEnd={onDragEnd} />
                );
            })}
        </div>
    );
};
