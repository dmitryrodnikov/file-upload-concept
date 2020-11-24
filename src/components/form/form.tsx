import React, { useCallback, useMemo, useState } from 'react';
import axios from 'axios';
import { FileStatus, useFileUpload } from '../../hooks/use-file-upload';
import { DropZone } from '../dropzone/dropzone';
import { SuggestList } from '../suggest-list/suggest-list';
import { FilesList } from '../files-list/files-list';
import styles from './form.module.scss';
import { Button } from '../button/button';

interface AppFileData {
    id: string;
    name: string;
    status: FileStatus;
    size: number;
    loaded?: number;
    type?: FileTypes;
}

export enum FileTypes {
    passport = 'passport',
    snils = 'snils',
    contract = 'contract',
    legal = 'legal',
    application = 'application',
}

export const FILE_TYPE_DICTIONARY = {
    [FileTypes.passport]: 'Identity',
    [FileTypes.snils]: 'Building plan',
    [FileTypes.contract]: 'Contract',
    [FileTypes.legal]: 'Certificate',
    [FileTypes.application]: 'Application form',
};

const initialSuggestState = {
    [FileTypes.application]: 1,
    [FileTypes.passport]: 2,
    [FileTypes.snils]: 1,
    [FileTypes.contract]: 1,
    [FileTypes.legal]: 2,
};

export const Form = () => {
    const [isDragging, setDragging] = useState(false);
    const [files, setFiles] = useState<AppFileData[]>([]);
    const [suggestions, setSuggestions] = useState<Record<FileTypes, number>>(initialSuggestState);

    const suggestionsView = useMemo(() => {
        return Object.entries(suggestions).map(([key, val]) => ({
            label: FILE_TYPE_DICTIONARY[key as FileTypes],
            data: key as FileTypes,
            amount: val,
        }));
    }, [suggestions]);

    const isSomeSuggestionLeft = useMemo(() => {
        return Object.values(suggestions).some(item => item > 0);
    }, [suggestions]);

    const isSomeFileLoading = useMemo(() => {
        return files.some(file => file.status === FileStatus.LOADING);
    }, [files]);

    const handleUploadProgress = useCallback((e, generatedId) => {
        setFiles(files => {
            return files.map(f => {
                if (f.id === generatedId) {
                    return {
                        ...f,
                        loaded: Math.round((e.loaded / e.total) * 100),
                    };
                }
                return f;
            });
        });
    }, []);

    const deleteFile = useCallback(
        (id: string) => {
            const updatedFiles = files.filter(file => file.id !== id);
            const updatedSuggestions = updatedFiles.reduce((acc, item) => {
                if (!item.type) {
                    return acc;
                }
                return { ...acc, [item.type]: acc[item.type] - 1 };
            }, initialSuggestState);
            setFiles(updatedFiles);
            setSuggestions(updatedSuggestions);
        },
        [files],
    );

    const deleteType = useCallback(
        (id: string, type?: FileTypes) => {
            const updatedFiles = files.map(file => {
                if (file.id === id) {
                    return { ...file, type: undefined };
                }
                return file;
            });

            const updatedSuggestions = updatedFiles.reduce<Record<FileTypes, number>>((acc, item) => {
                if (type && item.id === id) {
                    return {
                        ...acc,
                        [type]: acc[type] + 1,
                    };
                }
                return acc;
            }, suggestions);

            setFiles(updatedFiles);
            setSuggestions(updatedSuggestions);
        },
        [files, suggestions],
    );

    const addType = useCallback((data: AppFileData[]) => {
        const updatedSuggestions = data.reduce<Record<FileTypes, number>>((acc, item) => {
            if (item.type === undefined) {
                return acc;
            }
            return {
                ...acc,
                [item.type]: acc[item.type] - 1,
            };
        }, initialSuggestState);

        setFiles(data);
        setSuggestions(updatedSuggestions);
    }, []);

    const { handleDrop } = useFileUpload({
        uploadService: {
            upload: (file, generatedId) => {
                const data = new FormData();
                data.append('file', file);
                return axios.post('http://localhost:5000', data, {
                    onUploadProgress: e => handleUploadProgress(e, generatedId),
                });
            },
        },
        onFileAdd: (file, generatedId) => {
            setFiles(files => [
                { id: generatedId, name: file.name, status: FileStatus.LOADING, size: file.size },
                ...files,
            ]);
        },
        onFileUploaded: (fileData, generatedId) => {
            setFiles(files => {
                return files.map(f => {
                    if (f.id === generatedId) {
                        return {
                            ...f,
                            status: fileData.status,
                            id: fileData.fileId,
                        };
                    }
                    return f;
                });
            });
        },
        onFileUploadError: (error, generatedId) => {
            console.log(error, generatedId);
        },
    });

    const handleDragStart = useCallback(() => setDragging(true), []);
    const handleDragEnd = useCallback(() => setDragging(false), []);

    return (
        <div>
            <div className={styles.container}>
                <div className={styles.filesColumn}>
                    <DropZone onDrop={handleDrop} disabled={isDragging} />
                    {files.length > 0 && (
                        <div className={styles.files}>
                            <FilesList
                                files={files}
                                isDragging={isDragging}
                                onAddType={addType}
                                onDeleteFile={deleteFile}
                                onDeleteType={deleteType}
                            />
                        </div>
                    )}
                </div>
                <div className={styles.suggestColumn}>
                    <SuggestList items={suggestionsView} onDragStart={handleDragStart} onDragEnd={handleDragEnd} />
                </div>
            </div>
            <div className={styles.footer}>
                <Button disabled={isSomeSuggestionLeft || isSomeFileLoading}>Next</Button>
            </div>
        </div>
    );
};
