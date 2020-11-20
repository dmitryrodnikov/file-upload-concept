import React, { useMemo } from 'react';
import styles from './suggest-list.module.scss';
import { SuggestItem } from '../suggest-item/suggest-item';

interface SuggestListProps {
    items: { label: string; data: string; amount?: number }[];
    onDragStart: () => void;
    onDragEnd: () => void;
}

export const SuggestList = ({ items, onDragStart, onDragEnd }: SuggestListProps) => {
    const list = useMemo(() => {
        return items.map(({ data, label, amount }) => {
            return (
                <SuggestItem
                    key={data}
                    data={data}
                    label={label}
                    amount={amount}
                    onDragStart={onDragStart}
                    onDragEnd={onDragEnd}
                />
            );
        });
    }, [items, onDragStart, onDragEnd]);

    return (
        <div className={styles.list}>
            <div className={styles.title}>Assign document type</div>
            {list}
        </div>
    );
};
