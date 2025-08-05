import Featured from "../../components/featured/Featured";
import FeaturedProperties from "../../components/featuredProperties/FeaturedProperties";
import Footer from "../../components/footer/Footer";
import Header from "../../components/header/Header";
import MailList from "../../components/mailList/MailList";
import MostBookedHotels from "../../components/mostBookedHotels/MostBookedHotels";
import Navbar from "../../components/navbar/Navbar";
import PropertyList from "../../components/propertyList/PropertyList";
import UserReviews from "../../components/userReviews/UserReviews";
import WhyToBookHere from "../../components/whytobook/WhyToBookHere"
import { useAuth } from "../../context/AuthContext";
import "./home.css";

const Home: React.FC = () => {
  const {isAuthenticated} = useAuth();
  return (
    <div className="bg-gradient-to-b from-indigo-50 to-white">
      {!isAuthenticated && <Navbar />}
      <Header />

      <div className="homeContainer">

        <h2 className="text-3xl text-gray-900 font-bold ml-4 mt-10">MOST BOOKED HOTELS</h2>
        <MostBookedHotels />

        <h2 className="text-3xl text-gray-900 font-bold ml-4 mt-10">TOP CITIES</h2>
        <Featured />

        <h2 className="text-3xl text-gray-900 font-bold ml-4 mt-10">EXPLORE PROPERTY TYPES</h2>
        <PropertyList />

        <WhyToBookHere />

        <UserReviews />
        {!isAuthenticated && <Footer />}
      </div>
    </div>
  );
};

export default Home;
