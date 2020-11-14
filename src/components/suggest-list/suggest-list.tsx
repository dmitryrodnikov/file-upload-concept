import React from 'react';
import styles from './suggest-list.module.scss';
import { SuggestItem } from '../suggest-item/suggest-item';

interface SuggestListProps {
    items: { label: string; data: string; amount?: number }[];
    onDragStart: () => void;
    onDragEnd: () => void;
}

export const SuggestList = ({ items, onDragStart, onDragEnd }: SuggestListProps) => {
    return (
        <div className={styles.list}>
            <div className={styles.title}>Drag type to appropriate file</div>
            {items.map(({ data, label }, index) => {
                return (
                    <SuggestItem
                        key={index}
                        data={data}
                        label={label}
                        onDragStart={onDragStart}
                        onDragEnd={onDragEnd}
                    />
                );
            })}
        </div>
    );
};
