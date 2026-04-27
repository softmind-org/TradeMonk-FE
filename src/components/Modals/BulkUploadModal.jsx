import { useState, useRef, useEffect } from 'react'
import { X, Upload, FileText, CheckCircle, AlertCircle, Download, Table, ArrowRight, Loader2 } from 'lucide-react'
import { Button } from '@components/ui'
import { productService } from '@services/productService'
import Papa from 'papaparse'

const BulkUploadModal = ({ onClose, onUploadSuccess }) => {
  const [file, setFile] = useState(null)
  const [previewData, setPreviewData] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null)
  const [step, setStep] = useState(1) // 1: Select, 2: Preview, 3: Success
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef(null)

  // Handle file selection and parse for preview
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile && selectedFile.name.endsWith('.csv')) {
      setFile(selectedFile)
      setError(null)
      
      // Parse first 5 rows for preview (Checklist 3.4)
      Papa.parse(selectedFile, {
        header: true,
        delimiter: ';',
        preview: 5,
        skipEmptyLines: true,
        complete: (results) => {
          setPreviewData(results.data)
          setStep(2) // Move to preview step
        },
        error: (err) => {
          setError('Failed to parse CSV preview')
        }
      })
    } else {
      setFile(null)
      setError('Please select a valid .csv file')
    }
  }

  const handleSubmit = async () => {
    if (!file) return

    setError(null)
    setIsSubmitting(true)
    setUploadProgress(10) // Start progress

    const formData = new FormData()
    formData.append('file', file)

    try {
      // Simulate progress for UI (Checklist 3.2)
      const interval = setInterval(() => {
        setUploadProgress(prev => (prev < 90 ? prev + 10 : prev))
      }, 500)

      const response = await productService.bulkUploadProducts(formData)
      
      clearInterval(interval)
      setUploadProgress(100)

      if (response.success) {
        setResult(response.results)
        setStep(3) // Move to success step
        if (onUploadSuccess) onUploadSuccess()
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to upload file')
      setStep(1)
    } finally {
      setIsSubmitting(false)
    }
  }

  const downloadTemplate = () => {
    const headers = 'quantity;title;collectionName;setNumber;condition;language;gameSystem;finishType;price;Description;rarity;imageUrl;backImageUrl\n'
    const example1 = '1;Pikachu VMAX;Shining Fates;POK-001;MINT;English;Pokémon;Foil;150.00;Perfect condition;Secret Rare;; \n'
    const blob = new Blob([headers + example1], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'trademonk_bulk_template.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const downloadErrorReport = () => {
    if (!result || !result.errors) return
    const blob = new Blob([result.errors.join('\n')], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `error_report_${new Date().getTime()}.txt`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="rounded-3xl overflow-hidden bg-[#0F172A] border border-white/5 shadow-2xl max-w-2xl w-full">
      <div className="h-1.5 w-full bg-gradient-to-r from-[#8B6E1F] via-[#D4A017] to-[#8B6E1F]" />

      <div className="p-8">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h2 className="text-white font-black text-2xl tracking-tight">Bulk Inventory Import</h2>
            <p className="text-muted-foreground text-xs font-semibold mt-1">Checklist 3.0: High-Volume Seller Tools</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-muted-foreground transition-all">
            <X size={20} />
          </button>
        </div>

        {/* STEP 1: SELECT FILE */}
        {step === 1 && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div 
              onClick={() => fileInputRef.current.click()}
              className="relative border-2 border-dashed border-white/10 rounded-2xl p-12 hover:bg-white/[0.02] hover:border-white/20 transition-all group flex flex-col items-center justify-center cursor-pointer"
            >
              <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-muted-foreground group-hover:text-[#D4A017] transition-all mb-4">
                <Upload size={32} />
              </div>
              <p className="text-white font-bold">Drop CSV or Click to Browse</p>
              <p className="text-muted-foreground text-xs">Standardized .csv format only</p>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".csv" className="hidden" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/[0.02] p-4 rounded-xl border border-white/5">
                <div className="flex items-center gap-2 text-[#D4A017] mb-2">
                  <Download size={14} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Step 3.1</span>
                </div>
                <p className="text-white/60 text-[10px] leading-relaxed mb-3">Download the latest CSV template generator.</p>
                <button onClick={downloadTemplate} className="w-full py-2 bg-white/5 hover:bg-white/10 text-white text-[10px] font-bold rounded-lg border border-white/5">
                  Get .CSV Template
                </button>
              </div>
              <div className="bg-white/[0.02] p-4 rounded-xl border border-white/5">
                <div className="flex items-center gap-2 text-[#D4A017] mb-2">
                  <AlertCircle size={14} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Rules</span>
                </div>
                <ul className="text-white/40 text-[9px] space-y-1">
                  <li className="text-secondary font-bold">• Native TCG Powertools Format</li>
                  <li>• Semicolon (;) separated data</li>
                  <li>• Max 200 items per batch</li>
                  <li>• Exact Categories (Pokémon, etc.)</li>
                  <li>• Images Optional (Stock provided)</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: PREVIEW (Checklist 3.4) */}
        {step === 2 && (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-secondary">
                <Table size={18} />
                <h3 className="font-bold text-sm">Preview Interface (First 5 Rows)</h3>
              </div>
              <button 
                onClick={() => setStep(1)} 
                className="text-muted-foreground hover:text-white text-xs font-bold"
              >
                Change File
              </button>
            </div>

            <div className="overflow-x-auto rounded-xl border border-white/10 bg-black/20">
              <table className="w-full text-left text-[10px]">
                <thead className="bg-white/5 border-b border-white/10">
                  <tr>
                    <th className="px-4 py-3 text-muted-foreground uppercase tracking-widest font-black">Title</th>
                    <th className="px-4 py-3 text-muted-foreground uppercase tracking-widest font-black">Game</th>
                    <th className="px-4 py-3 text-muted-foreground uppercase tracking-widest font-black">Price</th>
                    <th className="px-4 py-3 text-muted-foreground uppercase tracking-widest font-black">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {previewData.map((row, i) => (
                    <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-3 text-white font-medium">{row.title || 'N/A'}</td>
                      <td className="px-4 py-3 text-white/70">{row.gameSystem || 'N/A'}</td>
                      <td className="px-4 py-3 text-secondary font-bold">€{row.price || '0.00'}</td>
                      <td className="px-4 py-3">
                        <span className="text-[8px] px-1.5 py-0.5 rounded bg-green-500/10 text-green-400 font-bold uppercase tracking-tighter">Valid</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col gap-4">
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full !h-14 !bg-[#D4A017] hover:!bg-[#D4A017]/90 !text-black !font-black !text-sm !uppercase !tracking-widest !rounded-2xl"
              >
                {isSubmitting ? (
                   <div className="flex items-center gap-3">
                     <Loader2 className="animate-spin" size={20} />
                     <span>Importing Data...</span>
                   </div>
                ) : 'Execute Bulk Import'}
              </Button>
              
              {isSubmitting && (
                <div className="space-y-2">
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-secondary transition-all duration-500 shadow-[0_0_15px_rgba(212,160,23,0.5)]"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-center text-[10px] text-muted-foreground font-black uppercase tracking-widest">
                    Processing Batch Size (Max 200)
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 3: RESULTS (Checklist 3.6) */}
        {step === 3 && result && (
          <div className="space-y-8 animate-in zoom-in-95 duration-500">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-green-500/10 rounded-3xl flex items-center justify-center text-green-500 mx-auto mb-4">
                <CheckCircle size={32} />
              </div>
              <h3 className="text-white font-black text-2xl tracking-tight">Processing Complete</h3>
              <p className="text-muted-foreground text-sm font-semibold">Bulk Import Processing (Checklist 3.5)</p>
            </div>

            <div className="grid grid-cols-3 gap-4 bg-white/[0.02] border border-white/5 rounded-2xl p-6">
              <div className="text-center space-y-1">
                <p className="text-muted-foreground text-[9px] font-black uppercase tracking-widest">Analyzed</p>
                <p className="text-white text-3xl font-black">{result.total}</p>
              </div>
              <div className="text-center space-y-1 border-x border-white/10">
                <p className="text-[#D4A017] text-[9px] font-black uppercase tracking-widest">Imported</p>
                <p className="text-[#D4A017] text-3xl font-black">{result.uploaded}</p>
              </div>
              <div className="text-center space-y-1">
                <p className="text-red-400 text-[9px] font-black uppercase tracking-widest">Failed</p>
                <p className="text-red-400 text-3xl font-black">{result.failed}</p>
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                onClick={downloadErrorReport}
                disabled={result.failed === 0}
                className="flex-1 !bg-white/5 hover:!bg-white/10 text-white !text-xs !font-bold !rounded-xl border border-white/5 flex items-center justify-center gap-2"
              >
                <FileText size={16} />
                Download Error Log
              </Button>
              <Button
                onClick={onClose}
                className="flex-1 !bg-secondary hover:!bg-secondary/90 !text-black !text-xs !font-black !rounded-xl"
              >
                Close Importer
              </Button>
            </div>
          </div>
        )}

        {error && step !== 3 && (
          <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3">
            <AlertCircle className="text-red-400" size={18} />
            <p className="text-red-400 text-xs font-bold leading-relaxed">{error}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default BulkUploadModal