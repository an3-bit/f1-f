import React from 'react'
import Hero from '../hero/Hero'
import Bhero from '../Bhero/Bhero'
import Ready from '../Ready/Ready'
// import Testimonials from "../../pages/Testimonial/Testimonials";
import ProductManual from '../../pages/Product_manual/product_manual';


const Home = () => {
  return (
    <div>
<Hero/>
<Bhero/>
<ProductManual/>
<Ready/>

    </div>
  )
}

export default Home