import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import CardVert from "../../components/cards/CardVert";
import NotFound from "../../components/global/NotFound";
import Pagination from "../../components/global/Pagination";
import { getBlogsByCategoryId } from "../../redux/actions/blogAction";
import { IBlog, RootStore } from "../../utils/TypeScript";

const BlogsByCategory = () => {
  const { categories, blogsCategory } = useSelector(
    (state: RootStore) => state
  );
  const dispatch = useDispatch();
  const { search } = useLocation();
  // console.log("Search [Slug]: ", search);
  const { slug } = useParams();
  const navigate = useNavigate();

  const [categoryId, setCategoryId] = useState("");
  const [blogs, setBlogs] = useState<IBlog[]>();
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const category = categories.find((item) => item.name === slug);
    console.log({ category, categoryId: category?._id });
    if (category) {
      setCategoryId(category._id ? category._id : "");
    }
  }, [categories, slug]);

  let countRef = useRef(0);

  useEffect(() => {
    if (!categoryId) {
      return;
    }

    console.log("Count ref: ", countRef.current++);
    if (blogsCategory.every((item) => item.id !== categoryId)) {
      dispatch(getBlogsByCategoryId(categoryId, search));
    } else {
      const data = blogsCategory.find((item) => item.id === categoryId);
      // console.log("Data: ", data);
      if (!data) return;

      setBlogs(data.blogs);
      setTotal(data.total);
      if (data.search) navigate(`${search}`);
    }
  }, [dispatch, categoryId, blogsCategory, search, navigate]);

  const handlePagination = (number: number) => {
    // console.log("Number: ", number);
    const search = `?page=${number}`;
    dispatch(getBlogsByCategoryId(categoryId, search));
  };

  if (!blogs) return <NotFound />;
  return (
    <div className="blogs_category">
      <div className="show_blogs">
        {blogs.map((blog) => (
          <CardVert key={blog._id} blog={blog} />
        ))}
      </div>

      <Pagination total={total} callback={handlePagination} />
    </div>
  );
};

export default BlogsByCategory;
