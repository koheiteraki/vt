import React from "react";

// interface PageTitleProps {
//     title: string;
//     description: string;
// }

const PageTitle: React.FC<PageTitleProps> = ({ title, description }) => {
    return (
        <section className="bg-white py-[70px] dark:bg-dark">
            <div>
                <div className="border-stroke dark:border-dark-3 border-b">
                    <h2 className="mb-2 text-2xl font-semibold text-dark dark:text-white">
                        {title}
                    </h2>
                    <p className="text-body-color dark:text-dark-6 mb-6 text-sm font-medium">
                        {description}
                    </p>
                </div>
            </div>
        </section>
    );
};

export default PageTitle;