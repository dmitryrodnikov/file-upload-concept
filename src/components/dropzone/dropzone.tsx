import React from 'react';
import { useDropzone } from 'react-dropzone';
import cn from 'classnames';
import styles from './dropzone.module.scss';

interface DropZoneProps {
    disabled?: boolean;
    onDrop: (files: File[]) => void;
}

export const DropZone = ({ onDrop, disabled }: DropZoneProps) => {
    const { getInputProps, getRootProps, isDragActive } = useDropzone({ onDrop, disabled });

    return (
        <div
            {...getRootProps()}
            className={cn(styles.dropZone, { [styles.disabled]: disabled, [styles.dragging]: isDragActive })}
        >
            <input {...getInputProps()} />
            Press or drop files here
        </div>
    );
};
