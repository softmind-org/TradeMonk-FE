import { AlertTriangle } from 'lucide-react'

const DeleteConfirmation = ({ listing, onConfirm, onCancel }) => (
  <div className="flex flex-col items-center gap-4 p-6 text-center bg-white rounded-2xl">
    <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
      <AlertTriangle size={28} className="text-red-500" />
    </div>
    <h3 className="text-lg font-bold text-gray-900">Delete Listing</h3>
    <p className="text-sm text-gray-500 max-w-xs">
      Are you sure you want to delete <strong className="text-gray-800">{listing?.name}</strong>? This action cannot be undone.
    </p>
    <div className="flex items-center gap-3 w-full mt-2">
      <button
        onClick={onCancel}
        className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
      >
        Cancel
      </button>
      <button
        onClick={onConfirm}
        className="flex-1 px-4 py-2.5 rounded-lg bg-red-500 text-sm font-semibold text-white hover:bg-red-600 transition-colors"
      >
        Delete
      </button>
    </div>
  </div>
)

export default DeleteConfirmation
