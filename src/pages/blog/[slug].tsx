import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { showErrMsg } from "../../components/alert/Alert";
import Loading from "../../components/alert/Loading";
import DisplayBlog from "../../components/blog/DisplayBlog";
import { getAPI } from "../../utils/FetchData";
import { IBlog, RootStore } from "../../utils/TypeScript";

const Blog = () => {
  const id = useParams().slug;
  const [blog, setBlog] = useState<IBlog>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { socket } = useSelector((state: RootStore) => state);

  useEffect(() => {
    if (!id) return;

    setLoading(true);

    getAPI(`blog/${id}`)
      .then((res) => {
        setBlog(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response.data.msg);
        setLoading(false);
      });

    // Tránh trường hợp memory leak
    return () => setBlog(undefined);
  }, [id]);

  useEffect(() => {
    if (!id || !socket) return;
    // Tạo phòng tương ứng cho mỗi blog
    socket && socket.emit("joinRoom", id);

    return () => {
      socket.emit("outRoom", id);
    };
  }, [socket, id]);

  if (loading) return <Loading />;
  return (
    <div className="my-4">
      {error && showErrMsg(error)}

      {blog && <DisplayBlog blog={blog} />}
    </div>
  );
};

export default Blog;
