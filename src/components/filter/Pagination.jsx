import React from 'react'

export default function Pagination({ currentPage, totalPages, onPageChange }) {
    if (!totalPages || totalPages <= 1) return null

    const getPageItems = () => {
        if (totalPages <= 7) {
            return Array.from({ length: totalPages }, (_, i) => i + 1)
        }

        const items = [1]
        const left = Math.max(2, currentPage - 1)
        const right = Math.min(totalPages - 1, currentPage + 1)

        if (left > 2) items.push('ellipsis-left')
        for (let i = left; i <= right; i += 1) items.push(i)
        if (right < totalPages - 1) items.push('ellipsis-right')

        items.push(totalPages)
        return items
    }

    const items = getPageItems()

    return (
        <div className="flex items-center justify-center gap-2 mt-8 select-none">
            <button
                className="h-9 px-3 rounded-lg text-sm border border-gray-700 text-gray-300 hover:text-white hover:border-gray-500 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                Prev
            </button>

            {items.map((item, index) => {
                if (typeof item === 'string') {
                    return (
                        <span key={`${item}-${index}`} className="w-9 h-9 flex items-center justify-center text-gray-500">
                            ...
                        </span>
                    )
                }

                const isActive = item === currentPage
                return (
                    <button
                        key={item}
                        onClick={() => onPageChange(item)}
                        className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm border transition-colors duration-150 ${isActive
                            ? 'bg-blue-600 border-blue-500 text-white'
                            : 'border-gray-700 text-gray-300 hover:text-white hover:border-gray-500'
                            }`}
                    >
                        {item}
                    </button>
                )
            })}

            <button
                className="h-9 px-3 rounded-lg text-sm border border-gray-700 text-gray-300 hover:text-white hover:border-gray-500 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                Next
            </button>
        </div>
    )
}
