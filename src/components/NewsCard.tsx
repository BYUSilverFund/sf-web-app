import React from "react";

interface NewsCardProps {
  image: string;
  title: string;
  description: string;
  left: boolean;
}

const NewsCard: React.FC<NewsCardProps> = ({
  image,
  title,
  description,
  left,
}) => {
  return (
    <div
      className={`flex flex-col lg:flex-row justify-between ${
        left ? "lg:flex-row-reverse" : ""
      } items-center gap-10 px-10 py-6
       shadow-sm border-2 border-blue-900 relative z-20`}
    >
      <img
        src={image}
        alt={title}
        className="w-2/3 lg:w-1/3 object-cover rounded-md"
      />
      <div className="flex flex-col justify-center lg:w-1/2">
        <h2 className="text-xl font-bold mb-2">{title}</h2>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
};

export default NewsCard;
