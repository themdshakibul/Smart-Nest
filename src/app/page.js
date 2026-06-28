import Banner from "@/components/shared/Banner";
import FeaturedProperties from "@/components/shared/FeaturedProperties";
import Footer from "@/components/shared/Footer";
import RentalStatistics from "@/components/shared/RentalStatistics";
import ReviewsSection from "@/components/shared/ReviewsSection";
import TopLocations from "@/components/shared/TopLocations";
import TrustedOwners from "@/components/shared/TrustedOwners";
import WhyChooseUs from "@/components/shared/WhyChooseUs";



const HomePage = () => {
  return (
    <div>
      <Banner/>
      <FeaturedProperties/>
      <WhyChooseUs/>
      <RentalStatistics/>
      <TopLocations/>
      <ReviewsSection/>
      <TrustedOwners/>
      <Footer/>
    </div>
  );
};

export default HomePage;
