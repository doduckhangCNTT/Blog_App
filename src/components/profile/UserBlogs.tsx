import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import { getBlogsByUserId } from "../../redux/actions/blogAction";
import { IBlog, RootStore } from "../../utils/TypeScript";
import Loading from "../alert/Loading";
import CardHoriz from "../cards/CardHoriz";
import Pagination from "../global/Pagination";

const UserBlogs = () => {
  const user_id = useParams().slug;

  const { blogsUser } = useSelector((state: RootStore) => state);

  const dispatch = useDispatch();
  const [blogs, setBlogs] = useState<IBlog[]>();
  const [total, setTotal] = useState(0);
  // const [page, setPage] = useState(1);
  const { search } = useLocation();

  useEffect(() => {
    if (!user_id) return;

    // Kiểm tra xem thông tin blogs của mỗi user đã được lưu trên store hay chưa
    if (blogsUser.every((item) => item.id !== user_id)) {
      dispatch(getBlogsByUserId(user_id ? user_id : "", search));
    } else {
      const data = blogsUser.find((item) => item.id === user_id);
      if (!data) return;

      setBlogs(data.blogs);
      setTotal(data.total);
    }
  }, [dispatch, user_id, blogsUser, search]);

  const handlePagination = (number: number) => {
    if (!number) return;
    const search = `?page=${number}`;
    dispatch(getBlogsByUserId(user_id ? user_id : "", search));
  };

  if (!blogs) return <Loading />;

  return (
    <div>
      <div>
        {blogs.map((blog) => (
          <CardHoriz key={blog._id} blog={blog} />
        ))}
      </div>

      <div>
        {total > 1 && <Pagination total={total} callback={handlePagination} />}
      </div>
    </div>
  );
};

export default UserBlogs;
