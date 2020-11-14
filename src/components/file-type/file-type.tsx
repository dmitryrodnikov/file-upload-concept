import React, { useCallback } from 'react';
import styles from './file-type.module.scss';
import { ReactComponent as CrossIcon } from '../../assets/icon-cross.svg';

interface FileTypeProps {
    id: string;
    type?: string;
    onDelete: (id: string) => void;
}

export const FileType = ({ id, type, onDelete }: FileTypeProps) => {
    const handleDelete = useCallback(() => {
        onDelete(id);
    }, [onDelete, id]);
    if (!type) {
        return null;
    }
    return (
        <div className={styles.type}>
            <div>{type}</div>
            <div className={styles.delete} onClick={handleDelete}>
                <CrossIcon />
            </div>
        </div>
    );
};
