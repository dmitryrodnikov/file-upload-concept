import { useCallback } from 'react';
import { v4 as uuid } from 'uuid';

export interface UploadProps {
    uploadService: FileUploadService;
    onFileAdd?: (file: File, id: string) => void;
    onFileUploaded?: (fileData: FileData, id: string) => void;
    onFileUploadError?: (error: string, id: string) => void;
    onFileReject?: (error: DropzoneFileError, index: number, arr: any) => void;
}

export interface FileData {
    fileId: string;
    status: FileStatus;
    meta: FileMeta;
    blob?: Blob;
}

export enum FileStatus {
    LOADING,
    UPLOADED,
    ERROR,
}

interface FileMeta {
    name?: string;
    originalFileName: string;
}

interface FileUploadService {
    upload: (file: File, id: string) => Promise<FileUploadResponse>;
}

interface FileUploadResponse {
    id: string;
}

interface DropzoneFileError {
    message: string;
    code: string;
}

export interface DropzoneFileRejection {
    file: File;
    errors: DropzoneFileError[];
}

export function useFileUpload({
    uploadService,
    onFileAdd,
    onFileUploaded,
    onFileUploadError,
    onFileReject,
}: UploadProps) {
    const handleDropReject = useCallback(
        (rejections: DropzoneFileRejection[]) => {
            if (onFileReject) {
                rejections.forEach(rejection => {
                    rejection.errors.forEach(onFileReject);
                });
            }
        },
        [onFileReject],
    );

    const handleDrop = useCallback(
        (files: File[]) => {
            files.forEach(file => {
                const generatedId = uuid();

                onFileAdd?.(file, generatedId);

                const fileData: FileData = {
                    fileId: '',
                    status: FileStatus.LOADING,
                    meta: { originalFileName: file.name },
                    blob: file,
                };

                uploadService
                    .upload(file, generatedId)
                    .then(response => {
                        fileData.status = FileStatus.UPLOADED;
                        fileData.fileId = response.id || generatedId;
                        onFileUploaded?.(fileData, generatedId);
                    })
                    .catch(e => {
                        fileData.status = FileStatus.ERROR;
                        onFileUploadError?.(e, generatedId);
                    });
            });
        },
        [onFileAdd, onFileUploaded, onFileUploadError, uploadService],
    );

    return { handleDrop, handleDropReject };
}
