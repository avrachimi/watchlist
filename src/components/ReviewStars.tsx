import { BsStar, BsStarFill, BsStarHalf } from "react-icons/bs";

const ReviewStars = ({ rating }: { rating: number }) => {
  let reviewComponent = [];

  console.log(rating);
  for (let i = 0; i < 5; i++) {
    if (rating - i >= 0.9) {
      reviewComponent.push(<BsStarFill key={i} />);
    } else if (rating - i > 0 && rating - i <= 0.9) {
      reviewComponent.push(<BsStarHalf key={i} />);
    } else {
      reviewComponent.push(<BsStar key={i} />);
    }
  }

  return <div className="left-0 flex gap-1 text-left">{reviewComponent}</div>;
};

export default ReviewStars;
