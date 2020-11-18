import React, { useCallback, useMemo, useState } from 'react';
import './App.css';
import { FileStatus, useFileUpload } from './hooks/use-file-upload';
import axios from 'axios';
import { DropZone } from './components/dropzone/dropzone';
import { SuggestList } from './components/suggest-list/suggest-list';
import { FilesList } from './components/files-list/files-list';

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
}

export const FILE_TYPE_DICTIONARY = {
    [FileTypes.passport]: 'Паспорт',
    [FileTypes.snils]: 'Снилс',
    [FileTypes.contract]: 'Договор',
    [FileTypes.legal]: 'Доверенность',
};

const initialSuggestState = {
    [FileTypes.passport]: 2,
    [FileTypes.snils]: 1,
    [FileTypes.contract]: 2,
    [FileTypes.legal]: 2,
};

function App() {
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

    return (
        <div className="container">
            <div className="files-column">
                <DropZone onDrop={handleDrop} disabled={isDragging} />
                {files.length > 0 && (
                    <div className="files">
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
            <div className="suggest-column">
                <SuggestList
                    items={suggestionsView}
                    onDragEnd={() => setDragging(false)}
                    onDragStart={() => setDragging(true)}
                />
            </div>
        </div>
    );
}

export default App;
