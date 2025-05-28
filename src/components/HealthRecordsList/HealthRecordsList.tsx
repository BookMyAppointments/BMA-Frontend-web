import { useState, useRef } from 'react'
import type { FC } from 'react'

interface HealthRecord {
    id: string;
    fileName: string;
    fileSize: string;
    uploadDate: string;
    fileUrl: string;
    fileType: string;
}

const HealthRecordsList: FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [records, setRecords] = useState<HealthRecord[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files) return;

        // Handle multiple files
        Array.from(files).forEach(file => {
            const newRecord: HealthRecord = {
                id: Date.now().toString(),
                fileName: file.name,
                fileSize: formatFileSize(file.size),
                uploadDate: new Date().toLocaleDateString(),
                fileUrl: URL.createObjectURL(file),
                fileType: file.type
            };
            setRecords(prev => [...prev, newRecord]);
        });

        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const handleDelete = (id: string) => {
        setRecords(prev => prev.filter(record => record.id !== id));
    };

    const filteredRecords = records.filter(record =>
        record.fileName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="w-[97%] mx-auto mt-6 mb-8">
            <div className="bg-white rounded-lg p-4 md:p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <h2 className="text-2xl font-semibold text-gray-800">Health Records</h2>

                    <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                        <div className="relative flex-1 sm:w-64">
                            <input
                                type="text"
                                placeholder="Search files..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-4 py-2 pr-10 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                            />
                            <svg className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        
                        <div className="flex-shrink-0">
                            <input
                                ref={fileInputRef}
                                type="file"
                                multiple
                                onChange={handleFileUpload}
                                className="hidden"
                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                            />
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Upload Files
                            </button>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    {filteredRecords.map((record) => (
                        <div key={record.id} className="border border-gray-100 rounded-lg p-4 hover:border-gray-200">
                            <div className="flex items-start gap-4">
                                <div className="flex-1">
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-800">{record.fileName}</h3>
                                            <p className="text-sm text-gray-500">
                                                {record.fileSize} • Uploaded on {record.uploadDate}
                                            </p>
                                        </div>
                                        <div className="flex gap-2 w-full sm:w-auto">
                                            <button
                                                onClick={() => window.open(record.fileUrl, '_blank')}
                                                className="flex-1 sm:flex-none px-4 py-2 text-sm text-blue-600 hover:text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-50"
                                            >
                                                View
                                            </button>
                                            <a
                                                href={record.fileUrl}
                                                download={record.fileName}
                                                className="flex-1 sm:flex-none px-4 py-2 text-sm text-gray-600 hover:text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 text-center"
                                            >
                                                Download
                                            </a>
                                            <button
                                                onClick={() => handleDelete(record.id)}
                                                className="flex-1 sm:flex-none px-4 py-2 text-sm text-red-600 hover:text-red-700 border border-red-200 rounded-lg hover:bg-red-50"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {filteredRecords.length === 0 && (
                        <div className="text-center py-8">
                            <p className="text-gray-500">No records found</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default HealthRecordsList