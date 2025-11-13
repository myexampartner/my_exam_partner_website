
import Footer from "@/components/footer/Footer";
import Navbar from "@/components/navbar/Navbar";
import LandingPage from "@/components/website/landingPage/LandingPage";
import WhatsAppFloatButton from "@/components/WhatsAppFloatButton";



export default function Home() {
  return (
 <>
 <Navbar/>
 <WhatsAppFloatButton />
<LandingPage/>
<Footer/>
 </>
  );
}
