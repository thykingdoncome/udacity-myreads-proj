import React from "react";
import SpinnerGif from "../assets/spinner.gif";

const Spinner = () => {
  return (
    <div className='spinner-container'>
      <img src={SpinnerGif} alt='spinner' />
    </div>
  );
};

export default Spinner;
