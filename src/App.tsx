import React, { useCallback, useState } from 'react';
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

const metaData = [
    { label: FILE_TYPE_DICTIONARY[FileTypes.passport], data: FileTypes.passport, amount: 2 },
    { label: FILE_TYPE_DICTIONARY[FileTypes.snils], data: FileTypes.snils, amount: 2 },
    { label: FILE_TYPE_DICTIONARY[FileTypes.contract], data: FileTypes.contract, amount: 1 },
    { label: FILE_TYPE_DICTIONARY[FileTypes.legal], data: FileTypes.legal, amount: 1 },
];

function App() {
    const [isDragging, setDragging] = useState(false);
    const [files, setFiles] = useState<AppFileData[]>([]);

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

    const deleteFile = useCallback((id: string) => {
        setFiles(files => {
            return files.filter(file => file.id !== id);
        });
    }, []);

    const deleteType = useCallback((id: string) => {
        setFiles(files => {
            return files.map(file => {
                if (file.id === id) {
                    return { ...file, type: undefined };
                }
                return file;
            });
        });
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
    });

    return (
        <div className="container">
            <div className="files-column">
                <DropZone onDrop={handleDrop} disabled={isDragging} />
                <FilesList
                    files={files}
                    isDragging={isDragging}
                    onAddType={setFiles}
                    onDeleteFile={deleteFile}
                    onDeleteType={deleteType}
                />
            </div>
            <div className="suggest-column">
                <SuggestList
                    items={metaData}
                    onDragEnd={() => setDragging(false)}
                    onDragStart={() => setDragging(true)}
                />
            </div>
        </div>
    );
}

export default App;
