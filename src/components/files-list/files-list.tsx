import React from 'react';
import { FileItem } from '../file-item/file-item';
import { FileType } from '../file-type/file-type';
import { FileStatus } from '../../hooks/use-file-upload';
import styles from './files-list.module.scss';

interface FileData {
    id: string;
    name: string;
    status: FileStatus;
    size: number;
    loaded?: number;
    type?: string;
}

interface FileListProps {
    files: FileData[];
    isDragging: boolean;
    onDeleteFile: (id: string) => void;
    onDeleteType: (id: string) => void;
    onAddType: (data: FileData[]) => void;
}

export const FilesList = ({ files, isDragging, onDeleteFile, onDeleteType, onAddType }: FileListProps) => {
    return (
        <div className={styles.filesList}>
            {files.map(file => {
                return (
                    <FileItem
                        id={file.id}
                        key={file.id}
                        name={file.name}
                        size={file.size}
                        status={file.status}
                        type={<FileType id={file.id} type={file.type} onDelete={onDeleteType} />}
                        loaded={file.loaded}
                        isDragging={isDragging}
                        onDrop={e => {
                            const droppedType = e.dataTransfer.getData('fileType');
                            const updated = files.map(f => {
                                if (f.id === file.id) {
                                    return {
                                        ...f,
                                        type: droppedType,
                                    };
                                }
                                return f;
                            });
                            onAddType(updated);
                        }}
                        onDelete={onDeleteFile}
                    />
                );
            })}
        </div>
    );
};
