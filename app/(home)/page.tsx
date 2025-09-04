import Hero from "@/components/home/Hero";
import Products from "@/components/home/Products";


export default function Home() {
  return (
   <div className="flex  flex-col w-full h-fit ">
   <Hero/>
   <Products/>
   </div>
  );
}
