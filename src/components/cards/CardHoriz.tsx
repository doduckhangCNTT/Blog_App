import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { deleteBlog } from "../../redux/actions/blogAction";
import { IBlog, IUser, RootStore } from "../../utils/TypeScript";

interface IProps {
  blog: IBlog;
}

const CardHoriz: React.FC<IProps> = ({ blog }) => {
  const { slug } = useParams();

  const { auth } = useSelector((state: RootStore) => state);
  const dispatch = useDispatch();

  const handleDelete = () => {
    if (!auth.user || !auth.access_token) return;

    if (slug !== auth.user._id)
      return dispatch({
        type: "ALERT",
        payload: { errors: "Invalid Authentication" },
      });

    if (window.confirm("Do you really want to delete")) {
      dispatch(deleteBlog(blog, auth.access_token));
    }
  };

  return (
    <div className="card mb-3" style={{ minWidth: "280px" }}>
      <div className="row g-0 p-2">
        <div
          className="col-md-4"
          style={{
            minHeight: "150px",
            maxHeight: "170px",
            overflow: "hidden",
          }}
        >
          {blog.thumbnail && (
            <>
              {typeof blog.thumbnail === "string" ? (
                <Link to={`/blog/${blog._id}`}>
                  <img
                    src={blog.thumbnail}
                    alt=""
                    className="img-fluid rounded-start"
                  />
                </Link>
              ) : (
                <img
                  src={URL.createObjectURL(blog.thumbnail)}
                  alt=""
                  className="w-100 h-100"
                  style={{ objectFit: "cover" }}
                />
              )}
            </>
          )}
        </div>

        <div className="col-md-8">
          <div className="card-body">
            <h5 className="card-title">
              <Link to={`/blog/${blog._id}`}>{blog.title}</Link>
            </h5>
            <p className="card-text">{blog.description}</p>

            {blog.title && (
              <div className="card-text d-flex justify-content-between">
                {/* Xác minh người dùng có phải là chủ của blog */}
                {slug && (blog.user as IUser)._id === auth.user?._id && (
                  <div style={{ cursor: "pointer" }}>
                    <Link to={`/update_blog/${blog._id}`}>Update</Link>
                    <small onClick={handleDelete}>Delete</small>
                  </div>
                )}

                <small className="text-muted">
                  {new Date(blog.createdAt).toLocaleString()}
                </small>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardHoriz;
