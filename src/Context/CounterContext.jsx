import { useState } from "react";
import { counterCntext } from "./CounterContextValue";

export function CounterContextProvider({children}){
    
    const [counter , setCounter] = useState(0)

    return(
        <counterCntext.Provider value={{counter,setCounter}}>
            {children}
        </counterCntext.Provider>
    )
}
