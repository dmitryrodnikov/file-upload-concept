import React, { useCallback } from 'react';
import styles from './file-type.module.scss';
import { ReactComponent as CrossIcon } from '../../assets/icon-cross.svg';
import { FILE_TYPE_DICTIONARY, FileTypes } from '../../App';

interface FileTypeProps {
    id: string;
    type?: FileTypes;
    onDelete: (id: string, type?: FileTypes) => void;
}

export const FileType = ({ id, type, onDelete }: FileTypeProps) => {
    const handleDelete = useCallback(() => {
        onDelete(id, type);
    }, [onDelete, id, type]);
    if (!type) {
        return null;
    }
    return (
        <div className={styles.type}>
            <div>{FILE_TYPE_DICTIONARY[type]}</div>
            <div className={styles.delete} onClick={handleDelete}>
                <CrossIcon />
            </div>
        </div>
    );
};
