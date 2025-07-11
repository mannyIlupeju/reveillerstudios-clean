import React, { createContext, useContext, useState, ReactNode } from 'react';
import { removeItem } from '../../store/cartSlice';
import { useDispatch } from 'react-redux';

// Define the shape of your global state
type GlobalState = {
  currentTime: string;
  currentYear: string;
};

 type SelectedOption = {
    name: string;
    value: string;
  };

 type SizeInfo = {
    availableForSale: boolean;
    id: string;
    priceV2: {
      amount: string;
      currencyCode: string;
    };
    quantityAvailable: number;
    title: string;
    selectedOptions: SelectedOption[]; // This ensures selectedOptions is always an array
  };

  type CartId = {
    cartId: string;
   
  }

  type LoginState = {
    loginClicked: boolean;
    registerClicked: boolean;
  }

  type confirmationMessage = {
    showMessage: boolean;
    setShowMessage: () => void
  }

// Define the shape of the context, including state and update functions
type GlobalContextType = {
  cartId: string;
  setCartId:React.Dispatch<React.SetStateAction<string>>;
  timeState: GlobalState;
  setCurrentTime: (currentTime: string) => void;
  setCurrentYear: (currentYear:string) => void;
  removeCart: (id:string) => void;
  toggleMenu: () => void;
  sizeInfo: SizeInfo;
  setSizeInfo:React.Dispatch<React.SetStateAction<SizeInfo>>;
  quantityAvailable: number | null;
  setQuantityAvailable: React.Dispatch<React.SetStateAction<number | null>>
  isHovered: boolean | null;
  setIsItemHovered: React.Dispatch<React.SetStateAction<boolean | null>>;
  isMenuOpen: boolean;
  setOpenMenu:  React.Dispatch<React.SetStateAction<boolean>>;
  isCartOpen: boolean;
  setIsCartOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenSideCart: React.Dispatch<React.SetStateAction<boolean>>;
  toggleCart:()=>void;
  setIsLoginClick:React.Dispatch<React.SetStateAction<boolean>>;
  setIsRegisterClick:React.Dispatch<React.SetStateAction<boolean>>;
  openCart:()=>void;
  loginClicked:boolean;
  registerClicked:boolean;
  LoginHere:()=>void;
  RegisterHere:()=>void;
  showMessage: boolean;
  setShowMessage: () => void;
  showConfirmationMessage: () => void;
  
};



// Create the context with an initial value of `null`
const GlobalContext = createContext<GlobalContextType | null>(null);

// Define the provider props
type ProviderProps = {
  children: ReactNode;
};

// Context provider implementation
export const GlobalProvider: React.FC<ProviderProps> = ({ children }) => {
  const [cartId, setCartId] = useState<string>("")
  const [timeState, setState] = useState<GlobalState>({
    currentTime: '',
    currentYear:new Date().getFullYear().toString()
  });
  const [isHovered, setIsItemHovered] = useState<boolean | null>(null)
  const [loginClicked, setIsLoginClick] = useState<boolean>(false)
  const [registerClicked, setIsRegisterClick] = useState<boolean>(false)
  const [isMenuOpen, setOpenMenu] = useState<boolean>(false)
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false)
  const [openSideCart, setOpenSideCart] = useState<boolean>(false);
  // const [quantity, setQuantity] = useState<number>(1)
  const [quantityAvailable, setQuantityAvailable] = useState<number | null>(null)
  const [sizeInfo, setSizeInfo] = useState<SizeInfo>({availableForSale:false, id:"", priceV2:{amount:"", currencyCode:""},quantityAvailable:0, title:"", selectedOptions:[]})
  const dispatch = useDispatch()
  const [showMessage, setShowMessage] = useState<boolean>(false);



  const LoginHere =() => {
    console.log('clicked')
    setIsLoginClick(prevState => !prevState)
    setIsRegisterClick(false)
  }

  const RegisterHere = () => {
    console.log('click register')
    setIsRegisterClick(prevState => !prevState)
    setIsLoginClick(false)
  }


  const removeCart = (id:string) => {
    console.log("remove Item")
    dispatch(removeItem(id))

  }

  const openCart = () => {
    console.log('open Cart')
    setOpenSideCart(prevState => !prevState)
  }

  // Function to update the current time
  const setCurrentTime = (currentTime: string) => {
    setState((prevState) => ({ ...prevState, currentTime }));
  };

  const setCurrentYear = (currentYear: string) => {
    setState((prevState) => ({ ...prevState, currentYear }));
  };

  const toggleMenu = () => {
    console.log("true")
    setOpenMenu((prevState) => !prevState);
  };


  const toggleCart = () => {
    setIsCartOpen((prevState) => !prevState)
  }

  const showConfirmationMessage = () => {
    setShowMessage(true);
    setTimeout(() => {
      setShowMessage(false);
    }, 3000); // Hide after 3 seconds
  };



  return (
    <GlobalContext.Provider 
      value={{ 
        cartId,
        setCartId,
        timeState, 
        setCurrentTime,
        setCurrentYear,
        isHovered,
        setIsItemHovered,
        isMenuOpen,
        setOpenMenu,
        toggleMenu,
        setOpenSideCart,
        setIsCartOpen,
        isCartOpen,
        removeCart,
        sizeInfo,
        setSizeInfo,
        quantityAvailable, 
        setQuantityAvailable,
        setIsLoginClick,
        setIsRegisterClick,
        loginClicked,
        registerClicked,
        LoginHere,
        RegisterHere,
        openCart,
        toggleCart,
        showMessage,
        setShowMessage: showConfirmationMessage,
        showConfirmationMessage
      }}>
      {children}
    </GlobalContext.Provider>
  );
};



// Custom hook for consuming the context
export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error('useGlobalContext must be used within a GlobalProvider');
  }
  return context;
};