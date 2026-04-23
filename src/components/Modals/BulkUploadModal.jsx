import { useState, useRef } from 'react'
import { X, Upload, FileText, CheckCircle, AlertCircle, Download } from 'lucide-react'
import { Button } from '@components/ui'
import { productService } from '@services/productService'

const BulkUploadModal = ({ onClose, onUploadSuccess }) => {
  const [file, setFile] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null)
  const fileInputRef = useRef(null)

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile && selectedFile.name.endsWith('.csv')) {
      setFile(selectedFile)
      setError(null)
    } else {
      setFile(null)
      setError('Please select a valid .csv file')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) return

    setError(null)
    setResult(null)
    setIsSubmitting(true)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await productService.bulkUploadProducts(formData)
      if (response.success) {
        setResult(response.results)
        if (onUploadSuccess) onUploadSuccess()
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to upload file')
    } finally {
      setIsSubmitting(false)
    }
  }

  const downloadTemplate = () => {
    const headers = 'title,collectionName,gameSystem,price,condition,quantity,setNumber,rarity,description,imageUrl,imageFilename\n'
    const example1 = 'Pikachu VMAX,Shining Fates,Pokémon,150.00,MINT,1,POK-001,Secret Rare,Perfect condition,https://assets.pokemon.com/assets/cms2/img/cards/web/SWSH45/SWSH45_EN_45.png,\n'
    const example2 = 'Charizard GX,Hidden Fates,Pokémon,450.00,NM,1,HIF-SVG,Shiny Rare,Slight wear,https://assets.pokemon.com/assets/cms2/img/cards/web/SM115/SM115_EN_SV49.png,\n'
    const blob = new Blob([headers + example1 + example2], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'trademonk_bulk_template.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="rounded-3xl overflow-hidden bg-[#0F172A] border border-white/5 shadow-2xl">
      {/* Premium Header Decoration */}
      <div className="h-1.5 w-full bg-gradient-to-r from-[#8B6E1F] via-[#D4A017] to-[#8B6E1F]" />

      <div className="p-8">
        <div className="flex items-start justify-between mb-8">
          <div className="space-y-1">
            <h2 className="text-white font-black text-2xl tracking-tight">Bulk Inventory Import</h2>
            <div className="flex items-center gap-2">
              <span className="bg-[#D4A017]/10 text-[#D4A017] text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">
                CSV Mode
              </span>
              <p className="text-muted-foreground text-xs font-semibold">Scale your store with 40k+ listings</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-white/5 rounded-full text-muted-foreground hover:text-white transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {!result ? (
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Upload Area */}
            <div 
              className={`relative border-2 border-dashed rounded-2xl p-10 transition-all group flex flex-col items-center justify-center space-y-4 ${
                file ? 'border-[#D4A017] bg-[#D4A017]/5' : 'border-white/10 hover:border-white/20 bg-white/[0.02] hover:bg-white/[0.04]'
              }`}
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                file ? 'bg-[#D4A017] text-black shadow-[0_0_20px_rgba(212,160,23,0.3)]' : 'bg-white/5 text-muted-foreground group-hover:text-white group-hover:scale-110'
              }`}>
                <Upload size={28} />
              </div>
              
              <div className="text-center space-y-1">
                <p className="text-white font-bold text-base">
                  {file ? file.name : 'Import your card data'}
                </p>
                <p className="text-muted-foreground text-xs font-medium">
                  {file ? `${(file.size / 1024).toFixed(1)} KB` : 'Spreadsheet (.csv) format required'}
                </p>
              </div>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".csv"
                className="hidden"
              />
              
              <Button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="!bg-white/10 hover:!bg-white/20 text-white !text-xs !font-black !px-6 !py-2 !rounded-full transition-all border border-white/5"
              >
                {file ? 'Replace File' : 'Browse Local Files'}
              </Button>
            </div>

            {/* Helper Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/[0.03] p-5 rounded-2xl border border-white/5 space-y-3">
                <div className="flex items-center gap-2 text-[#D4A017]">
                  <Download size={16} />
                  <span className="text-[10px] font-black uppercase tracking-wider">Preparation</span>
                </div>
                <p className="text-white/70 text-[11px] font-medium leading-relaxed">
                  Start by using our verified card template to ensure data compatibility.
                </p>
                <button
                  type="button"
                  onClick={downloadTemplate}
                  className="w-full py-2 bg-white/5 hover:bg-white/10 text-white text-[10px] font-bold rounded-lg transition-all border border-white/5"
                >
                  Download .CSV Template
                </button>
              </div>

              <div className="bg-white/[0.03] p-5 rounded-2xl border border-white/5 space-y-3">
                <div className="flex items-center gap-2 text-[#D4A017]">
                  <FileText size={16} />
                  <span className="text-[10px] font-black uppercase tracking-wider">Format Rules</span>
                </div>
                <ul className="text-white/50 text-[11px] font-semibold space-y-1.5 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <CheckCircle size={12} className="mt-0.5 text-[#D4A017]" />
                    <span>Price must be numerical</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={12} className="mt-0.5 text-[#D4A017]" />
                    <span>Exact card condition names</span>
                  </li>
                </ul>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="text-red-400 mt-0.5 shrink-0" size={18} />
                <p className="text-red-400 text-xs font-bold leading-relaxed">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={isSubmitting || !file}
              className="w-full !h-14 !bg-[#D4A017] hover:!bg-[#D4A017]/90 !text-black !font-black !text-sm !uppercase !tracking-widest !rounded-2xl shadow-lg shadow-[#D4A017]/10 disabled:opacity-30 transition-all active:scale-[0.98]"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  <span>Processing Collection...</span>
                </div>
              ) : 'Confirm and Execute Import'}
            </Button>
          </form>
        ) : (
          <div className="space-y-8 animate-in fade-in zoom-in-95 duration-300">
            <div className="text-center space-y-4">
              <div className="relative inline-block">
                <div className="w-20 h-20 bg-green-500/10 rounded-[2rem] flex items-center justify-center text-green-500 mx-auto transform rotate-12">
                  <CheckCircle size={40} className="-rotate-12" />
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-white font-black text-2xl tracking-tight">Execution Success</h3>
                <p className="text-muted-foreground text-sm font-semibold">
                  Your store inventory has been updated successfully.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6 bg-white/[0.02] border border-white/5 rounded-2xl p-6">
              <div className="text-center space-y-1">
                <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest">Total Found</p>
                <p className="text-white text-3xl font-black italic">{result.total}</p>
              </div>
              <div className="text-center space-y-1 border-x border-white/10">
                <p className="text-[#D4A017] text-[10px] font-bold uppercase tracking-widest">Imported</p>
                <p className="text-[#D4A017] text-3xl font-black italic">{result.uploaded}</p>
              </div>
              <div className="text-center space-y-1">
                <p className="text-red-400 text-[10px] font-bold uppercase tracking-widest">Conflicts</p>
                <p className="text-red-400 text-3xl font-black italic">{result.failed}</p>
              </div>
            </div>

            {result.errors.length > 0 && (
              <div className="space-y-3">
                <p className="text-white/50 text-[10px] font-black uppercase tracking-[0.2em] px-2">Conflict Log (Sample)</p>
                <div className="bg-red-500/[0.03] rounded-2xl border border-red-500/10 p-5 max-h-40 overflow-y-auto custom-scrollbar">
                  {result.errors.map((err, i) => (
                    <div key={i} className="flex gap-3 py-2 border-b border-red-500/5 last:border-0 items-start">
                      <span className="bg-red-500/20 text-red-100 text-[9px] font-bold px-1.5 py-0.5 rounded leading-none shrink-0 mt-0.5">ROW</span>
                      <p className="text-red-400/80 text-xs font-semibold">
                        {err}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button
              onClick={onClose}
              className="w-full !h-14 !bg-white/5 hover:!bg-white/10 !text-white !font-black !text-sm !uppercase !tracking-widest !rounded-2xl border border-white/5 transition-all"
            >
              Return to Catalog
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default BulkUploadModal
