import React, { createContext, useContext, useState } from 'react';

type FoldersContextType = {
  savedFolders: string[];
  setFolders: React.Dispatch<React.SetStateAction<string[]>>;
};

const FoldersContext = createContext<FoldersContextType | undefined>(undefined);

export const useFolders = () => {
  const ctx = useContext(FoldersContext);
  if (!ctx) throw new Error('useFolders must be used within FoldersProvider');
  return ctx;
};

export const FoldersProvider = ({ children }: { children: React.ReactNode }) => {
  const [savedFolders, setFolders] = useState<string[]>([]);
  return (
    <FoldersContext.Provider value={{ savedFolders, setFolders }}>
      {children}
    </FoldersContext.Provider>
  );
};