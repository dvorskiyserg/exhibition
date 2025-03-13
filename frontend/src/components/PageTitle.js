import React from "react";

const PageTitle = ({ title, backgroundImage }) => {
  return (
    <div
      style={{
        marginTop: "10px", // Щоб не перекривався навбаром та прехедером
        height: "80px",
        background: `linear-gradient(rgba(0, 0, 0, 0.26), rgba(0, 0, 0, 0.2)), url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#ffffff",
        fontSize: "24px",
        fontWeight: "100",
        textTransform: "uppercase",
        letterSpacing: "0px",
      }}
    >
      {title}
    </div>
  );
};

export default PageTitle;
