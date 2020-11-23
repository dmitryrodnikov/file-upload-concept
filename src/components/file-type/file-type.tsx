import React, { memo, useCallback, useEffect, useRef } from 'react';
import styles from './file-type.module.scss';
import { ReactComponent as CrossIcon } from '../../assets/icon-cross.svg';
import { FILE_TYPE_DICTIONARY, FileTypes } from '../form/form';
import { animated, useSpring } from 'react-spring';
import cn from 'classnames';

interface FileTypeProps {
    id: string;
    type?: FileTypes;
    onDelete: (id: string, type?: FileTypes) => void;
}

const FileTypeComponent = ({ id, type, onDelete }: FileTypeProps) => {
    const prevCountRef = useRef(type);
    const shouldAnimate = type !== prevCountRef.current;

    const { x } = useSpring({
        from: { x: 0 },
        x: shouldAnimate ? 1 : 0,
        config: { duration: 300 },
        reset: true,
    });

    const animateVertical = x
        .interpolate({
            range: [0, 1],
            output: [0, -5],
        })
        .interpolate(x => `${x}px`);

    const animateHorizontal = x
        .interpolate({
            range: [0, 1],
            output: [0, -15],
        })
        .interpolate(x => `${x}px`);

    useEffect(() => {
        prevCountRef.current = type;
    });

    const handleDelete = useCallback(() => {
        onDelete(id, type);
    }, [onDelete, id, type]);

    if (!type) {
        return null;
    }

    return (
        <div className={styles.type}>
            <div className={styles.textBlock}>
                <div className={styles.text}>{FILE_TYPE_DICTIONARY[type]}</div>
                <animated.div
                    style={{
                        top: animateVertical,
                        bottom: animateVertical,
                        left: animateHorizontal,
                        right: animateHorizontal,
                        opacity: x
                            .interpolate({
                                range: [0, 0, 1],
                                output: [0, 0.5, 0],
                            })
                            .interpolate(x => x),
                    }}
                    className={cn(styles.bg)}
                />
            </div>
            <div className={styles.delete} onClick={handleDelete}>
                <CrossIcon />
            </div>
        </div>
    );
};

export const FileType = memo(FileTypeComponent);
