import { useParams } from "react-router-dom";

const ProductsId = () => {
  const { id } = useParams();

  return <div> ProductsId {id}</div>;
};

export default ProductsId;
