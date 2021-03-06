import { StarIcon } from "@heroicons/react/solid";
import Image from "next/image";
import Currency from "react-currency-formatter";
import { useDispatch } from "react-redux";
import { basketActions } from "../slices/basketSlice";

const CheckoutProducts = ({
  id,
  title,
  price,
  description,
  rating,
  category,
  image,
  hasPrime,
}) => {
  const dispatch = useDispatch();

  const removeItemFromBasket = (id) => {
    dispatch(basketActions.removeFromBasket(id));
  };

  return (
    <div className="grid grid-cols-5">
      <Image src={image} height={200} width={200} objectFit="contain" />

      {/* {Middle} */}
      <div className="col-span-3 mx-5">
        <p>{title}</p>
        <div className="flex">
          {Array(rating)
            .fill()
            .map((_, i) => (
              <StarIcon className="h-5 text-yellow-500" key={i} />
            ))}
        </div>

        <p className="text-sm my-2 line-clamp-3">{description}</p>
        <Currency quantity={price} currency="VND" />

        {hasPrime && (
          <div className="flex items-center space-x-2">
            <img
              loading="lazy"
              className="w-12"
              src="https://links.papareact.com/fdw"
              alt=""
            />
            <p className="text-xs text-gray-500">FREE Next-day Delivery</p>
          </div>
        )}
      </div>

      {/* {Right} */}
      <div className="flex flex-col space-y-3 my-auto">
        <button className="button">Add to Basket</button>
        <button onClick={() => removeItemFromBasket(id)} className="button">
          Remove from Basket
        </button>
      </div>
    </div>
  );
};

export default CheckoutProducts;
