import React from "react";
import ServiceCard from "./ServiceCard";
import { Col } from "reactstrap";
import weatherImg from "../assets/images/weather.png";
import guideImg from "../assets/images/guide.png";
import customizationImg from "../assets/images/customization.png";

const ServiceData = [
  {
    imgUrl: weatherImg,
    title: "Farming News Updates",
    desc: 'Stay up-to-date with the latest in agriculture through "Farming News Updates," featuring breakthroughs in farming technology, market trends, and policy changes.',
  },
  {
    imgUrl: guideImg,
    title: "Farming Articles",
    desc: 'Stay up-to-date with the latest in agriculture through "Farming News Updates," featuring breakthroughs in farming technology, market trends, and policy changes.',
  },
  {
    imgUrl: customizationImg,
    title: "Fast and Easy Payment",
    desc: 'Stay up-to-date with the latest in agriculture through "Farming News Updates," featuring breakthroughs in farming technology, market trends, and policy changes.',
  },
];

const ServiceList = () => {
  return (
    <>
      {ServiceData.map((item, index) => (
        <Col lg="3" key={index}>
          <ServiceCard item={item} />
        </Col>
      ))}
    </>
  );
};

export default ServiceList;
