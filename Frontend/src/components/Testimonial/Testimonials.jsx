import React from "react";
import Slider from "react-slick";
import ava01 from "../../assets/images/farmer1.jpg";
import ava02 from "../../assets/images/farmer2.jpg";
import ava03 from "../../assets/images/farmer3.jpg";

const Testimonials = () => {
  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    speed: 1000,
    swipeToSlide: true,
    autoplaySpeed: 2000,
    slidesToShow: 3,

    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  return (
    <Slider {...settings}>
      <div className="testimonial py-4 px-3">
        <p className="fst-italic">
          "The products I purchased from this marketplace have significantly
          improved my crop yield. The quality and service are unmatched, and I
          couldn't be happier with the results."
        </p>
        <div className="d-flex align-items-center gap-4 mt-3">
          <img src={ava01} className="w-25 h-25 rounded-2" alt="" />
          <div>
            <h6 className="mb-0 mt-3">Ram Bahadur</h6>
            <p>Farmer</p>
          </div>
        </div>
      </div>
      <div className="testimonial py-4 px-3">
        <p className="fst-italic">
          "This platform has made it easy for me to find all the tools I need in
          one place. The customer service is always ready to help, and the
          delivery is quick and reliable."
        </p>
        <div className="d-flex align-items-center gap-4 mt-3">
          <img src={ava02} className="w-25 h-25 rounded-2" alt="" />
          <div>
            <h6 className="mb-0 mt-3">Hari Bahadur</h6>
            <p>Farmer</p>
          </div>
        </div>
      </div>
      <div className="testimonial py-4 px-3">
        <p className="fst-italic">
          "I was able to find organic seeds that I couldn’t get anywhere else.
          The marketplace is a game-changer for small farmers like me who are
          looking for sustainable options."
        </p>
        <div className="d-flex align-items-center gap-4 mt-3">
          <img src={ava03} className="w-25 h-25 rounded-2" alt="" />
          <div>
            <h6 className="mb-0 mt-3">Sita Bhandari</h6>
            <p>Farmer</p>
          </div>
        </div>
      </div>
      <div className="testimonial py-4 px-3">
        <p className="fst-italic">
          "I've been using this marketplace for a few months, and it has
          revolutionized how I manage my farm. The range of products is
          impressive, and the prices are very competitive."
        </p>
        <div className="d-flex align-items-center gap-4 mt-3">
          <img src={ava01} className="w-25 h-25 rounded-2" alt="" />
          <div>
            <h6 className="mb-0 mt-3">Ram Bahadur</h6>
            <p>Farmer</p>
          </div>
        </div>
      </div>
      <div className="testimonial py-4 px-3">
        <p className="fst-italic">
          "The support team is fantastic. They helped me choose the right tools
          for my farm, and I’ve seen a big difference in efficiency and
          productivity. Highly recommended!"
        </p>
        <div className="d-flex align-items-center gap-4 mt-3">
          <img src={ava02} className="w-25 h-25 rounded-2" alt="" />
          <div>
            <h6 className="mb-0 mt-3">Hari Bahadur</h6>
            <p>Farmer</p>
          </div>
        </div>
      </div>
      <div className="testimonial py-4 px-3">
        <p className="fst-italic">
          "As a new farmer, I found everything I needed here to get started. The
          educational resources were especially helpful, and the prices are fair
          for the quality."
        </p>
        <div className="d-flex align-items-center gap-4 mt-3">
          <img src={ava03} className="w-25 h-25 rounded-2" alt="" />
          <div>
            <h6 className="mb-0 mt-3">Sita Bhandari</h6>
            <p>Farmer</p>
          </div>
        </div>
      </div>
    </Slider>
  );
};

export default Testimonials;
