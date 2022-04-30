import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CardHoriz from "../components/cards/CardHoriz";
import CreateForm from "../components/cards/CreateForm";
import NotFound from "../components/global/NotFound";
import { IBlog, IUser, RootStore } from "../utils/TypeScript";
import ReactQuill from "../components/editor/ReactQuill";
import { shallowEqual, validCreateBlog } from "../utils/Valid";
import { ALERT } from "../redux/types/alertType";
import { createBlog, updateBlog } from "../redux/actions/blogAction";
import { getAPI } from "../utils/FetchData";

interface IProps {
  id?: string;
}

const CreateBlog: React.FC<IProps> = ({ id }) => {
  const initialState = {
    user: "",
    title: "",
    content: "",
    description: "",
    thumbnail: "",
    category: "",
    createdAt: new Date().toISOString(),
  };

  const [blog, setBlog] = useState<IBlog>(initialState);
  const [body, setBody] = useState("");

  const divRef = useRef<HTMLDivElement>(null);
  const [text, setText] = useState("");

  const { auth } = useSelector((state: RootStore) => state);
  const dispatch = useDispatch();

  const [oldData, setOldData] = useState<IBlog>(initialState);

  useEffect(() => {
    const div = divRef.current;
    // console.log("Text: ", div?.innerText);
    if (!div) return;
    const text = div?.innerText as string;
    setText(text);
  }, [body]);

  useEffect(() => {
    if (!id) return;

    getAPI(`blog/${id}`)
      .then((res) => {
        setBlog(res.data);
        setBody(res.data.content);

        setOldData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

    const initData = {
      user: "",
      title: "",
      content: "",
      description: "",
      thumbnail: "",
      category: "",
      createdAt: new Date().toISOString(),
    };

    return () => {
      setBody("");
      setBlog(initData);
      setOldData(initData);
    };
  }, [id]);

  const handleSubmit = async () => {
    // Kiem tra co phai nguoi dung cua trang
    if (!auth.access_token) return;

    const check = validCreateBlog({ ...blog, content: text });
    if (check.errLength !== 0)
      return dispatch({ type: ALERT, payload: { errors: check.errMsg } });

    let newData = { ...blog, content: body };

    if (id) {
      const result = shallowEqual(oldData, newData);
      // console.log("Result: ", result);
      if ((blog.user as IUser)._id !== auth.user?._id) {
        return dispatch({
          type: ALERT,
          payload: { errors: "Invalid Authentication" },
        });
      }

      if (result)
        return dispatch({
          type: ALERT,
          payload: { errors: "The data does not change" },
        });
      dispatch(updateBlog(newData, auth.access_token));
    } else {
      dispatch(createBlog(newData, auth.access_token));
    }
  };

  if (!auth.access_token) return <NotFound />;
  return (
    <div className="my-4 create_blog">
      <h2>Create Blog</h2>

      <div className="row mt-4">
        <div className="col-md-6">
          <h5>Create</h5>
          <CreateForm blog={blog} setBlog={setBlog} />
        </div>
        <div className="col-md-6">
          <h5>Preview</h5>
          <CardHoriz blog={blog} />
        </div>
      </div>

      <ReactQuill body={body} setBody={setBody} />

      {/* Lấy nội dung trong react quill  */}
      <div
        ref={divRef}
        dangerouslySetInnerHTML={{ __html: body }}
        style={{ display: "none" }}
      />
      <small>{text.length}</small>

      <button
        className="btn btn-dark mt-3 d-block mx-auto"
        onClick={handleSubmit}
      >
        {id ? "Update Post" : "Create Post"}
      </button>
    </div>
  );
};

export default CreateBlog;
