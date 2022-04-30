import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import { Alert } from "./components/alert/Alert";
import Header from "./components/global/Header";
import PageRender from "./PageRender";
import { refreshToken } from "./redux/actions/authAction";
import { getHomeBlogs } from "./redux/actions/blogAction";
import { getCategories } from "./redux/actions/categoryAction";

import io from "socket.io-client";
import SocketClient from "./SocketClient";
import { API_URL } from "./utils/config";

function App() {
  const dispatch = useDispatch();

  // Việc đẩy dữ liệu lên reducer ở đây là để khi mà vào trang web thì nó sẽ tự động được gọi và lấy giá trị
  useEffect(() => {
    dispatch(refreshToken());
    dispatch(getCategories());
    dispatch(getHomeBlogs());
  }, [dispatch]);

  useEffect(() => {
    const socket = io(API_URL);
    // console.log("Socket: ", socket);

    dispatch({ type: "SOCKET", payload: socket });

    return () => {
      socket.close();
    };
  }, [dispatch]);

  return (
    <div className="container">
      <SocketClient />
      <Router>
        <Alert />
        <Header />
        <Routes>
          <Route path="/" element={<PageRender />} />
          <Route path="/:page" element={<PageRender />} />
          <Route path="/:page/:slug" element={<PageRender />} />
          {/* <Route path="/products/:id" element={<ProductsId />} /> */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
