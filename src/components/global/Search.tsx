import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { ALERT } from "../../redux/types/alertType";
import { getAPI } from "../../utils/FetchData";
import { IBlog } from "../../utils/TypeScript";
import CardHoriz from "../cards/CardHoriz";

const Search = () => {
  const [search, setSearch] = useState("");
  const [blogs, setBlogs] = useState<IBlog[]>([]);
  const { pathname } = useLocation();

  console.log("PathName: ", pathname);

  const dispatch = useDispatch();

  useEffect(() => {
    if (search.length < 2) return setBlogs([]);

    const delayDebounce = setTimeout(async () => {
      if (search.length < 2) return setBlogs([]);

      try {
        const res = await getAPI(`/search/blogs?title=${search}`);
        // console.log("RES: ", res);
        setBlogs(res.data);
      } catch (error: any) {
        dispatch({ type: ALERT, payload: { errors: error.response.data.msg } });
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [search, dispatch]);

  useEffect(() => {
    setSearch("");
    setBlogs([]);
  }, [pathname]);

  return (
    <div className="search w-100 position-relative">
      <input
        type="text"
        className="form-control me-2 w-100"
        value={search}
        placeholder="Enter your search..."
        onChange={(e) => setSearch(e.target.value)}
      />

      {search.length >= 2 && (
        <div
          className="position-absolute pt-2 px-1 w-100 rounded me-4"
          style={{
            background: "#eee",
            zIndex: 10,
            maxHeight: "calc(100vh - 100px)",
            overflow: "auto",
          }}
        >
          {blogs.length ? (
            blogs.map((blog) => <CardHoriz key={blog._id} blog={blog} />)
          ) : (
            <h3 className="text-center">No Blogs</h3>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
