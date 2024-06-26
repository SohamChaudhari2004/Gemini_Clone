import { createContext, useState } from "react";
import run from "../config/gemini";
export const Context = createContext();

const ContextProvider = (props) =>{

    const [input , setInput] = useState(""); // to save input data
    const [recentPrompt, setRecentPrompt] = useState(""); // after pressing send input data will be saved in this recent data
    const [prevPrompt , setPrevPrompt] = useState([]); // stores all the input history
    const [showRes  , setShowRes] = useState(false); // onTrue to hide boxes on homepage and show the output 
    const [loading , setLoading] =useState(false); // to await the response from gemini api
    const [resData , setResData] = useState(""); // after recieving data response to display it on website

    const delayPara = (index, nextWord)=>{
        setTimeout(function(){
            setResData(prev => prev + nextWord)
        }, 75*index)
    }

    const newChat = ()=>{
        setLoading(false)
        setShowRes(false)
    }

    const onSent = async (prompt)=>{

        setResData("")
        setLoading(true)
        setShowRes(true)
        let response;
        if (prompt !== undefined) {
            response = await run(prompt);
            setRecentPrompt(prompt)
        }
        else{
            setPrevPrompt(prev=>[...prev,input])
            setRecentPrompt(input)
            response = await run(input);
        }
        // setRecentPrompt(input)
        // setPrevPrompt(prev=> [...prev,input])
        // const response  = await run(input);
        let responseArray = response.split("**");
        let newResponse ="" ;
        for (let i  =0 ; i<responseArray.length;i++){
            if (i===0 || i%2 !==1) {
                newResponse +=responseArray[i]
            } else {
                newResponse += "<b>"+responseArray[i]+"</b>"
            }
        }
        let newResponse2  = newResponse.split("*").join("</br>")
        let newResponseArray = newResponse2.split(" ");
        for (let i = 0; i < newResponseArray.length; i++) 
        {
            const nextWord = newResponseArray[i];
            delayPara(i,nextWord+" ")
        }
        setLoading(false)
        setInput("")
        
    }

    
     const contextValue = {
    prevPrompt,
    setPrevPrompt,
    onSent,
    showRes,
    recentPrompt,
    setRecentPrompt,
    loading,
    resData,
    input,
    setInput,
    newChat,
  };

  return (
    <Context.Provider value={contextValue}>
      {props.children}
    </Context.Provider>
  );
};

export default ContextProvider;