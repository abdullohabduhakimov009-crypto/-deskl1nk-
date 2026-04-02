import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { HiPlus as Plus, HiDocumentText as FileText, HiXMark as X } from 'react-icons/hi2';
import { PremiumButton } from './PremiumButton';

interface FileUploadProps {
  onFilesSelected: (files: { name: string; type: string; data: string }[]) => void;
  existingFiles?: { name: string; type: string; data: string }[];
  onRemoveFile: (index: number) => void;
  multiple?: boolean;
  accept?: string;
  label?: string;
  maxSizeMB?: number;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFilesSelected,
  existingFiles = [],
  onRemoveFile,
  multiple = true,
  accept = ".pdf,.jpg,.jpeg,.png,.doc,.docx",
  label = "Attachments (Photos/Documents)",
  maxSizeMB = 10
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;

    const newFiles: { name: string; type: string; data: string }[] = [];
    const fileArray = Array.from(files);

    fileArray.forEach(file => {
      if (file.size > maxSizeMB * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size is ${maxSizeMB}MB.`);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        newFiles.push({
          name: file.name,
          type: file.type,
          data: reader.result as string
        });

        if (newFiles.length === fileArray.length) {
          onFilesSelected(newFiles);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div className="space-y-4">
      <label className="text-sm font-bold text-slate-700">{label}</label>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {existingFiles.map((file, idx) => (
          <div key={idx} className="relative aspect-square bg-slate-50 rounded-xl border border-slate-200 overflow-hidden group">
            {file.type.startsWith('image/') ? (
              <img src={file.data} alt={file.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400">
                <FileText className="w-8 h-8" />
              </div>
            )}
            <PremiumButton 
              variant="ghost"
              size="sm"
              onClick={() => onRemoveFile(idx)}
              className="absolute top-1 right-1 p-1 bg-white/80 rounded-full text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity min-w-0 w-6 h-6 z-10"
            >
              <X className="w-3 h-3" />
            </PremiumButton>
            <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-1">
              <p className="text-[8px] text-white truncate">{file.name}</p>
            </div>
          </div>
        ))}

        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center text-slate-400 cursor-pointer transition-all ${
            isDragging 
              ? 'border-[#009688] bg-teal-50 text-[#009688] scale-[1.02]' 
              : 'bg-slate-50 border-slate-200 hover:border-[#009688]/50 hover:text-[#009688]'
          }`}
        >
          <Plus className={`w-6 h-6 mb-1 transition-transform ${isDragging ? 'scale-125' : ''}`} />
          <span className="text-[10px] font-bold uppercase">{isDragging ? 'Drop Here' : 'Upload'}</span>
          <p className="text-[8px] mt-1 text-slate-400">Drag & Drop or Click</p>
          <input 
            ref={fileInputRef}
            type="file" 
            multiple={multiple}
            accept={accept}
            className="hidden" 
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>
      </div>
    </div>
  );
};
