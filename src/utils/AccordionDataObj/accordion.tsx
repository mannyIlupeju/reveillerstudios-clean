//Data object for accordion to maintain the reusability of it 

import { getSizeChart } from "../SizeChartGuide/sizechartObj"


export const getAccordionData = (descriptionHtml: string | null, collectionItem: string | null) => {

  const sizeChartData = getSizeChart.find((item) => item.category === collectionItem)

  return [
    {
      id: '1',
      title: 'Product Description',
      content: descriptionHtml || '<p>Content for Accordion 1</p>',

    },
    {
      id: '2',
      title: 'Size Chart',

      content: sizeChartData ||  {id: '', category: '', sizeChart: '<p>No size chart available.</p>' },
    },
  ]
  
} 
 

