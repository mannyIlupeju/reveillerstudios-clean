import React from 'react'
import DOMPurify from 'isomorphic-dompurify';
import { FaPlus } from "react-icons/fa6";
import { FaMinus } from "react-icons/fa6";
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';




export default function Accordion({
    data, 
    isActive,
    toggleAccordion,
  }:{

    data:{ id:string, title:string; content:string | {id:string; category:string; sizeChart: string};};

    isActive:boolean;
    toggleAccordion: ()=> void
  }) {

  const prefersReducedMotion = useReducedMotion();

  const CleanMarkUp = ({markUpText}: {markUpText: string}) => {
    const sanitizeDescription = DOMPurify.sanitize(markUpText);
    return <div dangerouslySetInnerHTML={{__html: sanitizeDescription}} />
  }


  return (
    <div className="prodDetailsOptionsBox p-3 rounded-lg text-md">
        <div className="flex justify-between">
            <h3>{data.title}</h3>
            <motion.div
              className="flex items-center cursor-pointer"
              onClick={toggleAccordion}
              animate={{ rotate: isActive ? 180 : 0 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.2, ease: 'easeOut' }}
            >
              <AnimatePresence mode="wait" initial={false}>
                {isActive ? (
                  <motion.span
                    key="minus"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: prefersReducedMotion ? 0 : 0.15 }}
                  >
                    <FaMinus />
                  </motion.span>
                ) : (
                  <motion.span
                    key="plus"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: prefersReducedMotion ? 0 : 0.15 }}
                  >
                    <FaPlus />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
        </div>
        <AnimatePresence initial={false}>
          {isActive && (
            <motion.div
              key="accordion-content"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="leading-10 mt-8">
                {typeof data.content === "string" ? 
                (<CleanMarkUp markUpText= {data.content}/>) :
                (<CleanMarkUp markUpText={data.content.sizeChart}/>)
              }
              </div>
            </motion.div>
          )}
        </AnimatePresence>
    </div>
  )
}
