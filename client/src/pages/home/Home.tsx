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
import "./home.css";

const Home: React.FC = () => {
  return (
    <div className="bg-indigo-100">
      <Navbar />
      <Header/>
      <div className="homeContainer">
        <MostBookedHotels/>
        <Featured/>
        <PropertyList/>
        {/* <h1 className="homeTitle">Homes guests love</h1>
        <FeaturedProperties/> */}
        <WhyToBookHere />
        <UserReviews/>
        <MailList/>
        <Footer/>
      </div>
    </div>
  );
};

export default Home;
