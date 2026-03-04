import { cn } from "@/common/utils/tailwind"
import { FileText, Upload, X } from "lucide-react"
import { useRef, useState } from "react"

interface BrandGuidelinesUploadProps {
  file: File | null
  onChange: (file: File | null) => void
}

const ACCEPTED_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
]

const ACCEPTED_EXTENSIONS = ".pdf,.doc,.docx"

export default function BrandGuidelinesUpload({
  file,
  onChange,
}: BrandGuidelinesUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [fileError, setFileError] = useState<string | null>(null)

  const validateAndSet = (selected: File) => {
    setFileError(null)
    if (!ACCEPTED_TYPES.includes(selected.type)) {
      setFileError("Only PDF or Word documents (.pdf, .doc, .docx) are accepted")
      return
    }
    if (selected.size > 10 * 1024 * 1024) {
      setFileError("File size must be under 10 MB")
      return
    }
    onChange(selected)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (selected) validateAndSet(selected)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const dropped = e.dataTransfer.files?.[0]
    if (dropped) validateAndSet(dropped)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => setIsDragging(false)

  const handleRemove = () => {
    onChange(null)
    setFileError(null)
    if (inputRef.current) inputRef.current.value = ""
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Brand Guidelines{" "}
        <span className="text-gray-500 font-normal">(optional)</span>
      </label>
      <p className="text-xs text-gray-500 mb-3">
        Upload your brand tone, dos and don'ts to personalise FAQ generation
      </p>

      {file ? (
        /* File preview */
        <div className="flex items-center gap-3 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3">
          <div className="flex-shrink-0 w-9 h-9 bg-violet-500/15 border border-violet-500/20 rounded-lg flex items-center justify-center">
            <FileText className="w-4 h-4 text-violet-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-200 font-medium truncate">{file.name}</p>
            <p className="text-xs text-gray-500">
              {(file.size / 1024).toFixed(0)} KB
            </p>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            aria-label="Remove file"
            className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-200 hover:bg-gray-700 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        /* Drop zone */
        <div
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={cn(
            "border-2 border-dashed rounded-xl px-6 py-8 text-center cursor-pointer transition-all",
            isDragging
              ? "border-violet-500/60 bg-violet-500/5"
              : "border-gray-700 hover:border-gray-600 hover:bg-gray-800/50"
          )}
        >
          <div className="flex flex-col items-center gap-2 pointer-events-none">
            <Upload
              className={cn(
                "w-7 h-7",
                isDragging ? "text-violet-400" : "text-gray-500"
              )}
            />
            <p className="text-sm text-gray-400">
              <span className="text-violet-400 font-medium">Click to upload</span>{" "}
              or drag and drop
            </p>
            <p className="text-xs text-gray-600">PDF, DOC or DOCX · max 10 MB</p>
          </div>
        </div>
      )}

      {fileError && (
        <p className="mt-2 text-sm text-red-400">{fileError}</p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_EXTENSIONS}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  )
}
