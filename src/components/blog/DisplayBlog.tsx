import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { createComment, getComments } from "../../redux/actions/commentAction";
import { IBlog, IComment, IUser, RootStore } from "../../utils/TypeScript";
import Comments from "../comments/Comments";
import Input from "../comments/Input";
import Loading from "../global/Loading";
import Pagination from "../global/Pagination";

interface IProps {
  blog: IBlog;
}

const DisplayBlog: React.FC<IProps> = ({ blog }) => {
  const { auth, comments } = useSelector((state: RootStore) => state);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const [showComments, setShowComments] = useState<IComment[]>([]);

  const handleComment = (body: string) => {
    if (!auth.user || !auth.access_token) return;
    const data = {
      content: body,
      user: auth.user,
      blog_id: blog._id as string,
      blog_user_id: (blog.user as IUser)._id,
      replyCM: [],
      createdAt: new Date().toISOString(),
    };
    setShowComments([data, ...showComments]);

    dispatch(createComment(data, auth.access_token));
  };

  const { search } = useLocation();
  // const number = new URLSearchParams(search).get("page");
  // console.log("Number: ", number);

  useEffect(() => {
    if (comments.data.length === 0) return;
    setShowComments(comments.data);
  }, [comments.data]);

  const fetchComments = useCallback(
    (id: string, num = 1) => {
      setLoading(true);
      dispatch(getComments(id, num));
      setLoading(false);
    },
    [dispatch]
  );

  useEffect(() => {
    if (!blog._id) return;
    const num = new URLSearchParams(search).get("page") || 1;

    fetchComments(blog._id, Number(num));
  }, [blog._id, fetchComments, search]);

  const handlePagination = (num: number) => {
    if (!blog._id) return;
    fetchComments(blog._id, num);
  };

  return (
    <div>
      <h2
        className="text-center my-3 text-capitalize fs-1"
        style={{ color: "#ff7a00" }}
      >
        {blog.title}
      </h2>

      <div className="text-end fst-italic" style={{ color: "teal" }}>
        <small>
          {typeof blog.user !== "string" && `By: ${blog.user.name}`}
        </small>

        <small className="ms-2">
          {new Date(blog.createdAt).toLocaleString()}
        </small>
      </div>

      <div
        dangerouslySetInnerHTML={{
          __html: blog.content,
        }}
      />

      <hr className="my-1" />
      <h3 style={{ color: "#ff7a00" }}>✩ Comments ✩</h3>

      {auth.user ? (
        <Input callback={handleComment} />
      ) : (
        <h5>
          {/* Lí do viết dấu ?blog/${blog._id} để khi user chưa đăng nhập, mà muốn đăng nhập để comment thì khi đăng nhập xong sẽ tự động chuyển về cái blog đang định comment đó (được xử ở login.tsx) */}
          Please <Link to={`/login?blog/${blog._id}`}>login</Link> to comment.
        </h5>
      )}

      {loading ? (
        <Loading />
      ) : (
        showComments?.map((comment, index) => (
          <Comments key={index} comment={comment} />
        ))
      )}
      {comments.total > 1 && (
        <Pagination total={comments.total} callback={handlePagination} />
      )}
    </div>
  );
};

export default DisplayBlog;
