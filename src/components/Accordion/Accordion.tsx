import React, {useState} from 'react'
import DOMPurify from 'isomorphic-dompurify';
import { FaPlus } from "react-icons/fa6";
import { FaMinus } from "react-icons/fa6";




export default function Accordion({
    data, 
    isActive,
    toggleAccordion,
  }:{

    data:{ id:string, title:string; content:string | {id:string; category:string; sizeChart: string};};

    isActive:boolean;
    toggleAccordion: ()=> void
  }) {


  const CleanMarkUp = ({markUpText}: {markUpText: string}) => {
    const sanitizeDescription = DOMPurify.sanitize(markUpText);
    return <div dangerouslySetInnerHTML={{__html: sanitizeDescription}} />
  }


  return (
    <div className="prodDetailsOptionsBox p-3 rounded-lg text-md">
        <div className="flex justify-between">
            <h3>{data.title}</h3>
            <div className="flex items-center">
                {isActive ? 
                (<FaMinus onClick={toggleAccordion}/>)
                : 
                (<FaPlus onClick={toggleAccordion}/>) 
                }
            </div>
        </div>
        {isActive && (
          <div className="leading-10 mt-8">

            {typeof data.content === "string" ? 
            (<CleanMarkUp markUpText= {data.content}/>) :
            (<CleanMarkUp markUpText={data.content.sizeChart}/>)
          }

            </div>
         )
        }
    </div>
  )
}
