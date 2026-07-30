import React from "react";

const BackgroundGlows = () => (
  <>
    <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-primary-glow blur-[100px] pointer-events-none z-0" />
    <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-accent-glow blur-[100px] pointer-events-none z-0" />
  </>
);

export default BackgroundGlows;
