import React, { useCallback, useEffect, useRef } from 'react';
import styles from './suggest-item.module.scss';
import cn from 'classnames';
import { ReactComponent as CheckIcon } from '../../assets/icon-check.svg';
import { useSpring, animated } from 'react-spring';

interface SuggestItemProps {
    label: string;
    data: string;
    amount?: number;
    onDragStart: VoidFunction;
    onDragEnd: VoidFunction;
}

const GHOST_ID = 'ghost';

interface CountProps {
    amount?: number;
}

const Count = ({ amount }: CountProps) => {
    const prevCountRef = useRef(amount);
    const shouldAnimate = amount !== prevCountRef.current;

    const { x } = useSpring({
        from: { x: 0 },
        x: shouldAnimate ? 1 : 0,
        config: { duration: 400 },
        reset: true,
    });

    useEffect(() => {
        prevCountRef.current = amount;
    });

    return (
        <div className={styles.count}>
            <div className={styles.amount}>{amount ? amount : <CheckIcon />}</div>
            <animated.div
                style={{
                    transform: x
                        .interpolate({
                            range: [0, 0.3, 1],
                            output: [1, 1.8, 1],
                        })
                        .interpolate(x => `scale(${x})`),
                    opacity: x
                        .interpolate({
                            range: [0, 0.2, 1],
                            output: amount ? [0.2, 0.5, 0.2] : [0.5, 0.7, 0.5],
                        })
                        .interpolate(x => x),
                }}
                className={cn(styles.bg)}
            />
        </div>
    );
};

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
                <Count amount={amount} />
            </div>
            <div className={styles.shadow} />
        </div>
    );
};
