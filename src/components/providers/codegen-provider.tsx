"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { createCodegenClient, type CodegenApiClient } from "@/lib/api/codegen-client"
import type { CodegenConfiguration } from "@/lib/types/codegen"

interface CodegenContextType {
  client: CodegenApiClient | null
  config: CodegenConfiguration | null
  isConfigured: boolean
  setConfig: (config: CodegenConfiguration) => void
  clearConfig: () => void
}

const CodegenContext = createContext<CodegenContextType | undefined>(undefined)

interface CodegenProviderProps {
  children: React.ReactNode
}

export function CodegenProvider({ children }: CodegenProviderProps) {
  const [client, setClient] = useState<CodegenApiClient | null>(null)
  const [config, setConfigState] = useState<CodegenConfiguration | null>(null)

  // Load config from localStorage on mount
  useEffect(() => {
    try {
      const storedConfig = localStorage.getItem('codegen-config')
      if (storedConfig) {
        const parsedConfig = JSON.parse(storedConfig) as CodegenConfiguration
        setConfigState(parsedConfig)

        // Create client with stored config
        const apiClient = createCodegenClient(parsedConfig)
        setClient(apiClient)
      }
    } catch (error) {
      console.error('Failed to load Codegen configuration:', error)
      // Clear invalid config
      localStorage.removeItem('codegen-config')
    }
  }, [])

  const setConfig = (newConfig: CodegenConfiguration) => {
    try {
      // Save to localStorage
      localStorage.setItem('codegen-config', JSON.stringify(newConfig))

      // Update state
      setConfigState(newConfig)

      // Create or update client
      const apiClient = createCodegenClient(newConfig)
      setClient(apiClient)
    } catch (error) {
      console.error('Failed to save Codegen configuration:', error)
      throw new Error('Failed to save configuration')
    }
  }

  const clearConfig = () => {
    try {
      localStorage.removeItem('codegen-config')
      setConfigState(null)
      setClient(null)
    } catch (error) {
      console.error('Failed to clear Codegen configuration:', error)
    }
  }

  const value: CodegenContextType = {
    client,
    config,
    isConfigured: !!client && !!config,
    setConfig,
    clearConfig,
  }

  return (
    <CodegenContext.Provider value={value}>
      {children}
    </CodegenContext.Provider>
  )
}

export function useCodegenContext() {
  const context = useContext(CodegenContext)
  if (context === undefined) {
    throw new Error('useCodegenContext must be used within a CodegenProvider')
  }
  return context
}