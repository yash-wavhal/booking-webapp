import Featured from "../../components/featured/Featured";
import FeaturedProperties from "../../components/featuredProperties/FeaturedProperties";
import Footer from "../../components/footer/Footer";
import Header from "../../components/header/Header";
import MailList from "../../components/mailList/MailList";
import MostBookedHotels from "../../components/mostBookedHotels/MostBookedHotels";
import Navbar from "../../components/navbar/Navbar";
import PropertyList from "../../components/propertyList/PropertyList";
import "./home.css";

const Home: React.FC = () => {
  return (
    <div>
      <Navbar />
      <Header/>
      <div className="homeContainer">
        {/* <h1>Most Booked Hotels</h1> */}
        <MostBookedHotels/>
        <h1>Hotels from different cities</h1>
        <Featured/>
        <h1 className="homeTitle">Browse by property type</h1>
        <PropertyList/>
        <h1 className="homeTitle">Homes guests love</h1>
        <FeaturedProperties/>
        <MailList/>
        <Footer/>
      </div>
    </div>
  );
};

export default Home;
