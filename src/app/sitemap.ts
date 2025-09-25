import { fetchCategories } from "@/utils/fetchCategories/fetchCategories";
import ProductCategories from "./shop/productCategories";

export default async function sitemap() {
    const collections = await fetchCategories();

    const productCollections =  collections.map((item) => {

        return {
            url: `https://www.reveillerstudios.com/shop/collections/${item.handle}`
        }
    })

    return [{
        url: 'https://www.reveillerstudios.com'
    },
     ...productCollections

    ]


}