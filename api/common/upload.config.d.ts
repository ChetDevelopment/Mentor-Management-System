export declare const avatarUploadConfig: {
    storage: import("multer").StorageEngine;
    limits: {
        fileSize: number;
        files: number;
    };
    fileFilter: (_req: any, file: any, cb: any) => any;
};
export declare const cvUploadConfig: {
    storage: import("multer").StorageEngine;
    limits: {
        fileSize: number;
        files: number;
    };
    fileFilter: (_req: any, file: any, cb: any) => any;
};
