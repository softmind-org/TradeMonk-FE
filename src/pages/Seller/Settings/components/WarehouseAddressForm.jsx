import { Edit2, Check, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui'

const WarehouseAddressForm = ({
  warehouseAddress,
  setWarehouseAddress,
  isEditingWarehouse,
  setIsEditingWarehouse,
  handleWarehouseSave,
  isSavingProfile,
  COUNTRIES
}) => {
  const inputFields = [
    { key: 'contactName', label: 'Contact Name', placeholder: 'Johnny Doe', type: 'text', maxLength: 35 },
    { key: 'phone', label: 'Phone Number', placeholder: '+31 6 1234 5678', type: 'tel', maxLength: 20 },
    { key: 'addressLine1', label: 'Street Address & House Number', placeholder: 'Main St 123', type: 'text', colSpan: true, maxLength: 35 },
    { key: 'city', label: 'City', placeholder: 'Amsterdam', type: 'text', maxLength: 30 },
    { key: 'postalCode', label: 'Postal Code (No spaces)', placeholder: '1012AB', type: 'text', maxLength: 15 },
  ]

  const displayFields = [
    { label: 'Contact Name', key: 'contactName' },
    { label: 'Phone', key: 'phone' },
    { label: 'Street Address', key: 'addressLine1', colSpan: true },
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
         Shipping & Warehouse Address
      </h2>
      <p className="text-sm text-muted-foreground mb-4">
         This address is used by SendCloud to generate shipping labels and origin rates for your outgoing orders.
      </p>

      <div className="bg-[#111C2E] border border-white/5 rounded-2xl p-6 md:p-8 space-y-6">
        <div className="flex items-center justify-between mb-4">
           <h3 className="text-white font-bold">Pickup Address</h3>
           {!isEditingWarehouse && (
              <Button 
                 onClick={() => setIsEditingWarehouse(true)}
                 className="bg-[#0B1220] hover:bg-[#0B1220]/80 text-white border border-white/10 font-bold text-sm px-4 py-2"
              >
                 <Edit2 size={14} className="mr-2" /> Edit Address
              </Button>
           )}
        </div>

        {isEditingWarehouse ? (
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
              {inputFields.map((field) => (
                 <div key={field.key} className={`space-y-2 ${field.colSpan ? 'md:col-span-2' : ''}`}>
                    <label className="text-xs text-muted-foreground">{field.label}</label>
                    <input
                       type={field.type}
                       maxLength={field.maxLength}
                       value={warehouseAddress[field.key] || ''}
                       onChange={(e) => setWarehouseAddress({...warehouseAddress, [field.key]: e.target.value})}
                       className="w-full bg-[#0B1220] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#635BFF] transition-colors"
                       placeholder={field.placeholder}
                    />
                 </div>
              ))}
              <div className="space-y-2 md:col-span-2">
                 <label className="text-xs text-muted-foreground">Country</label>
                 <select
                    value={warehouseAddress.country || 'NL'}
                    onChange={(e) => setWarehouseAddress({...warehouseAddress, country: e.target.value})}
                    className="w-full bg-[#0B1220] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#635BFF] transition-colors"
                 >
                    {COUNTRIES.map((c) => (
                       <option key={c.code} value={c.code}>{c.name}</option>
                    ))}
                 </select>
              </div>
              <div className="md:col-span-2 flex justify-end gap-3 mt-4">
                 <Button 
                    onClick={() => setIsEditingWarehouse(false)}
                    variant="ghost"
                    className="text-muted-foreground hover:text-white"
                 >
                    Cancel
                 </Button>
                 <Button 
                    onClick={handleWarehouseSave}
                    disabled={isSavingProfile}
                    className="bg-[#D4A017] hover:bg-[#D4A017]/90 text-black font-bold px-6"
                 >
                    {isSavingProfile ? <Loader2 size={16} className="animate-spin mr-2" /> : <Check size={18} className="mr-2" />}
                    Save Address
                 </Button>
              </div>
           </div>
        ) : (
           <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12 p-4 bg-[#0B1220] rounded-lg border border-white/5">
              {displayFields.map((field) => (
                 <div key={field.key} className={field.colSpan ? 'md:col-span-2' : ''}>
                    <span className="text-xs text-muted-foreground uppercase tracking-widest block mb-1">{field.label}</span>
                    <span className="text-white text-sm">{warehouseAddress[field.key] || 'Not Set'}</span>
                 </div>
              ))}
              <div>
                 <span className="text-xs text-muted-foreground uppercase tracking-widest block mb-1">City & Postal Code</span>
                 <span className="text-white text-sm">
                    {warehouseAddress.city || 'Not Set'}, {warehouseAddress.postalCode || ''}
                 </span>
              </div>
              <div>
                 <span className="text-xs text-muted-foreground uppercase tracking-widest block mb-1">Country</span>
                 <span className="text-white text-sm">
                    {COUNTRIES.find(c => c.code === warehouseAddress.country)?.name || warehouseAddress.country || 'Not Set'}
                 </span>
              </div>
           </div>
        )}
      </div>
    </div>
  )
}

export default WarehouseAddressForm
