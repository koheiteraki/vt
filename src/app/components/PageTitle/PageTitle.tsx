import React from "react";
import "./PageTitle.scss"; // CSSファイルをインポート

interface PageTitleProps {
    title: string;
    description: string;
}

const PageTitle: React.FC<PageTitleProps> = ({ title, description }) => {
    return (
        <div className="l-hero" id="js-hero">
        <div className="l-hero__inner">
          <h1> {title}</h1>
          <p> {description}
          </p>
        </div>
      </div>
    );
};

export default PageTitle;