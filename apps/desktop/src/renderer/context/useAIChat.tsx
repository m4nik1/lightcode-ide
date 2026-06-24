import { createContext, ReactNode, useState, useContext } from 'react'

type AIContext = {
    message: string
}

const aiContext = createContext<AIContext | undefined>(undefined)

export function aiChatProvider({ children } : { children: ReactNode }) {
    const [message, setMessage] = useState('')
    return (
        <aiContext.Provider
            value={{
                message
            }}
        >
            {children}
        </aiContext.Provider>
    )
}

export function useAIChat() {
    const context = useContext(aiContext)

    if(!context) {
        throw new Error("useEditorTabs must be used within an aiChatProvider!");
    }

    return context
}

