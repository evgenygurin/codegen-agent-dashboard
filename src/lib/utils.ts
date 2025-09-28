import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, formatDistanceToNow, parseISO } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date, formatStr = "MMM dd, yyyy"): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, formatStr)
}

export function formatRelativeTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return formatDistanceToNow(dateObj, { addSuffix: true })
}

export function formatDuration(milliseconds: number): string {
  const seconds = Math.floor(milliseconds / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) return `${days}d ${hours % 24}h`
  if (hours > 0) return `${hours}h ${minutes % 60}m`
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`
  return `${seconds}s`
}

export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'completed':
    case 'success':
    case 'passed':
    case 'merged':
      return 'text-green-600 bg-green-100'
    case 'failed':
    case 'failure':
    case 'error':
      return 'text-red-600 bg-red-100'
    case 'pending':
    case 'queued':
      return 'text-yellow-600 bg-yellow-100'
    case 'running':
    case 'in_progress':
      return 'text-blue-600 bg-blue-100'
    case 'cancelled':
    case 'skipped':
      return 'text-gray-600 bg-gray-100'
    default:
      return 'text-gray-600 bg-gray-100'
  }
}

export function getPriorityColor(priority: string): string {
  switch (priority.toLowerCase()) {
    case 'critical':
      return 'text-red-700 bg-red-100 border-red-200'
    case 'high':
      return 'text-orange-700 bg-orange-100 border-orange-200'
    case 'medium':
      return 'text-yellow-700 bg-yellow-100 border-yellow-200'
    case 'low':
      return 'text-blue-700 bg-blue-100 border-blue-200'
    default:
      return 'text-gray-700 bg-gray-100 border-gray-200'
  }
}

export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

export function formatPercentage(value: number, total: number, decimals = 1): string {
  if (total === 0) return '0%'
  const percentage = (value / total) * 100
  return `${percentage.toFixed(decimals)}%`
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func.apply(null, args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

export function generateId(prefix = '', length = 8): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = prefix
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export function parseErrorMessage(error: any): string {
  if (typeof error === 'string') return error
  if (error?.message) return error.message
  if (error?.details?.message) return error.details.message
  if (error?.response?.data?.message) return error.response.data.message
  return 'An unknown error occurred'
}

export function isValidUrl(string: string): boolean {
  try {
    new URL(string)
    return true
  } catch {
    return false
  }
}

export function extractRepositoryInfo(url: string): { owner: string; repo: string } | null {
  const githubRegex = /github\.com\/([^\/]+)\/([^\/]+)/
  const match = url.match(githubRegex)

  if (match) {
    return {
      owner: match[1],
      repo: match[2].replace(/\.git$/, '')
    }
  }

  return null
}

export function getActionIcon(type: string): string {
  switch (type.toLowerCase()) {
    case 'review':
      return '👀'
    case 'fix':
      return '🔧'
    case 'improve':
      return '✨'
    case 'optimize':
      return '⚡'
    case 'test':
      return '🧪'
    case 'document':
      return '📝'
    case 'deploy':
      return '🚀'
    case 'monitor':
      return '📊'
    default:
      return '⚙️'
  }
}

export function calculateProgress(current: number, total: number): number {
  if (total === 0) return 0
  return Math.min(Math.round((current / total) * 100), 100)
}

export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((groups, item) => {
    const group = String(item[key])
    groups[group] = groups[group] || []
    groups[group].push(item)
    return groups
  }, {} as Record<string, T[]>)
}

export function sortBy<T>(array: T[], key: keyof T, direction: 'asc' | 'desc' = 'asc'): T[] {
  return [...array].sort((a, b) => {
    const aVal = a[key]
    const bVal = b[key]

    if (aVal < bVal) return direction === 'asc' ? -1 : 1
    if (aVal > bVal) return direction === 'asc' ? 1 : -1
    return 0
  })
}

export function filterBy<T>(array: T[], filters: Partial<Record<keyof T, any>>): T[] {
  return array.filter(item => {
    return Object.entries(filters).every(([key, value]) => {
      if (value === undefined || value === null || value === '') return true
      return item[key as keyof T] === value
    })
  })
}

export function searchItems<T>(items: T[], query: string, searchKeys: (keyof T)[]): T[] {
  if (!query) return items

  const lowerQuery = query.toLowerCase()
  return items.filter(item => {
    return searchKeys.some(key => {
      const value = String(item[key]).toLowerCase()
      return value.includes(lowerQuery)
    })
  })
}

export function exportToCSV<T extends Record<string, any>>(data: T[], filename: string): void {
  if (data.length === 0) return

  const headers = Object.keys(data[0])
  const csvContent = [
    headers.join(','),
    ...data.map(item =>
      headers.map(header => {
        const value = item[header]
        return typeof value === 'string' && value.includes(',')
          ? `"${value}"`
          : String(value)
      }).join(',')
    )
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)

  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}.csv`)
  link.style.visibility = 'hidden'

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text)
  } else {
    // Fallback for older browsers
    const textArea = document.createElement('textarea')
    textArea.value = text
    textArea.style.position = 'fixed'
    textArea.style.left = '-999999px'
    textArea.style.top = '-999999px'
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()

    return new Promise<void>((resolve, reject) => {
      if (document.execCommand('copy')) {
        resolve()
      } else {
        reject(new Error('Copy command failed'))
      }
      document.body.removeChild(textArea)
    })
  }
}