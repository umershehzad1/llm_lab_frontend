import { saveAs } from 'file-saver'
import { getExperiments } from '@/lib/api'
import { Download } from 'lucide-react'

interface ExportButtonProps {
  data: any[]
  iconOnly?: boolean
  className?: string
}

export default function ExportButton({ data, iconOnly = false, className = '' }: ExportButtonProps) {
  const handleExport = async () => {
    const res = await getExperiments()
    const exportData = res.data || data
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    saveAs(blob, 'llm-experiments.json')
  }

  return (
    <button
      onClick={handleExport}
      title="Export experiments"
      className={`flex items-center justify-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition ${className}`}
    >
      <Download size={18} />
      {!iconOnly && <span>Export</span>}
    </button>
  )
}
