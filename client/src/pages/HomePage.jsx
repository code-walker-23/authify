import React from "react";
import Menubar from "../components/MenuBar";
import Header from "../components/Header";

const HomePage = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Menubar />
      <Header />
    </div>
  );
};

export default HomePage;
