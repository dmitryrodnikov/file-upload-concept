import React, { useCallback, useState } from 'react';
import './App.css';
import { FileStatus, useFileUpload } from './hooks/use-file-upload';
import axios from 'axios';
import { FileItem } from './components/file-item/file-item';
import { DropZone } from './components/dropzone/dropzone';
import { SuggestList } from './components/suggest-list/suggest-list';
import { FileType } from './components/file-type/file-type';

interface AppFileData {
    id: string;
    name: string;
    status: FileStatus;
    size: number;
    loaded?: number;
    type?: string;
}

const metaData = ['Паспорт', 'СНИЛС', 'Договор', 'Доверенность'];

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

                <div className={'files-list'}>
                    {files.map(file => {
                        return (
                            <FileItem
                                id={file.id}
                                key={file.id}
                                name={file.name}
                                size={file.size}
                                status={file.status}
                                type={<FileType id={file.id} type={file.type} onDelete={deleteType} />}
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
                                    setFiles(updated);
                                }}
                                onDelete={deleteFile}
                            />
                        );
                    })}
                </div>
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
