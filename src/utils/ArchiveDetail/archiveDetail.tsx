
//Data object for accordion to maintain the reusability of it 

import { ArchiveDetail } from "../archiveTextObj/archiveTextObj";


export const getArchiveData = ( decodedPrefix: string | null) => {

    console.log('Decoded prefix in getArchiveData:', decodedPrefix);


    const resolvedTitle = decodedPrefix?.replace(/\/$/, '')?.toLowerCase();
    console.log('Resolved title:', resolvedTitle);

  const archiveData = ArchiveDetail.find((item) => item.title === resolvedTitle);

  return [
    {
      title: archiveData?.title || 'Archive Details',
      content: archiveData?.content || '<p>Content for Accordion 1</p>',

    },

  ]
  
} 