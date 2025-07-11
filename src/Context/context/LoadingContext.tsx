import React, {useState, createContext, useContext, ReactNode} from 'react'

type LoadState = {
  load: boolean

}

type MyContextType = {
    loading: boolean;
    setIsLoading:(loading:boolean) => void;
}

const LoadingContext = createContext<MyContextType | null>({
    loading: true,
    setIsLoading: () => {}
});

type MyComponentProps = {
    children: ReactNode;
}

export const LoadingProvider: React.FC<MyComponentProps> = ({ children }: {children:ReactNode})=> {
    const [loading, setIsLoading] = useState<LoadState>({load:true})

      const handleSetLoading = (loading: boolean) => {
            setIsLoading({ load: loading });
        };

    

    return (
        <LoadingContext.Provider value={{
            loading: loading.load, 
            setIsLoading:handleSetLoading}}
        >
         {children}
        </LoadingContext.Provider>
    )

}

export const useLoading = () => {
    const context = useContext(LoadingContext);
    if(!context) {
        throw new Error ('useLoading must be used within a LoadingProvider');
    }
    return context; 
}