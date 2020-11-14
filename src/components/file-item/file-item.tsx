import React, { useCallback, useState } from 'react';
// @ts-ignore
import byteSize from 'byte-size';
import { FileStatus } from '../../hooks/use-file-upload';
import cn from 'classnames';
import styles from './file-item.module.scss';
import { ReactComponent as CrossIcon } from '../../assets/icon-cross.svg';

export const FileItem = ({
    id,
    name,
    size,
    status,
    loaded = 0,
    type,
    onDrop,
    onDelete,
    isDragging,
}: {
    id: string;
    name: string;
    status: FileStatus;
    size: number;
    type?: React.ReactElement;
    loaded?: number;
    onDrop?: React.DragEventHandler;
    onDelete: (id: string) => void;
    isDragging: boolean;
}) => {
    const [isDragHover, setDragHover] = useState(false);
    const handleDelete = useCallback(() => {
        onDelete(id);
    }, [onDelete, id]);

    return (
        <div
            className={cn(styles.file, {
                [styles.dragging]: isDragging,
                [styles.dragHover]: isDragHover,
                [styles.loading]: status === FileStatus.LOADING,
            })}
            onDragEnter={e => {
                setDragHover(true);
            }}
            onDragLeave={e => {
                console.log('LEAVE');
                setDragHover(false);
            }}
            onDrop={e => {
                setDragHover(false);
                onDrop?.(e);
                console.info('drop file', e);
            }}
        >
            <div className={styles.dataContainer}>
                <div className={styles.data}>
                    <div className={styles.fileData}>
                        <div className={styles.fileName}>{name}</div>
                        <div className={styles.fileMeta}>
                            <div className={styles.size}>{byteSize(size).toString()}</div>
                            {status === FileStatus.LOADING && <div className={styles.loaded}>{loaded}%</div>}
                            {type}
                        </div>
                    </div>

                    <div className={styles.controls}>
                        <div className={styles.delete} onClick={handleDelete}>
                            <CrossIcon />
                        </div>
                    </div>
                </div>
            </div>
            <div
                className={cn(styles.progressBar, {
                    [styles.fileDropable]: isDragging,
                    [styles.fileDropHover]: isDragHover,
                })}
                style={{ transform: `translateX(${loaded - 100}%)` }}
            />
        </div>
    );
};
