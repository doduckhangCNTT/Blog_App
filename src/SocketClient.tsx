import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  CREATE_COMMENT,
  DELETE_COMMENT,
  DELETE_REPLY,
  REPLY_COMMENT,
  UPDATE_COMMENT,
  UPDATE_REPLY,
} from "./redux/types/commentType";
import { IComment, RootStore } from "./utils/TypeScript";

const SocketClient = () => {
  const { socket } = useSelector((state: RootStore) => state);
  const dispatch = useDispatch();

  // Create Comment
  useEffect(() => {
    if (!socket) return;

    socket.on("createComment", (data: IComment) => {
      // console.log("DATA: ", data);
      dispatch({ type: CREATE_COMMENT, payload: data });
    });

    return () => {
      socket.off("createComment");
    };
  }, [socket, dispatch]);

  // Reply Comment
  useEffect(() => {
    if (!socket) return;

    socket.on("replyComment", (data: IComment) => {
      // console.log("DATA: ", data);
      dispatch({ type: REPLY_COMMENT, payload: data });
    });

    return () => {
      socket.off("replyComment");
    };
  }, [socket, dispatch]);

  // Update Comment
  useEffect(() => {
    if (!socket) return;

    socket.on("deleteComment", (data: IComment) => {
      // console.log("DATA: ", data);
      dispatch({
        type: data.comment_root ? DELETE_REPLY : DELETE_COMMENT,
        payload: data,
      });
    });

    return () => {
      socket.off("deleteComment");
    };
  }, [socket, dispatch]);

  // Delete Comment
  useEffect(() => {
    if (!socket) return;

    socket.on("updateComment", (data: IComment) => {
      // console.log("DATA: ", data);
      dispatch({
        type: data.comment_root ? UPDATE_REPLY : UPDATE_COMMENT,
        payload: data,
      });
    });

    return () => {
      socket.off("updateComment");
    };
  }, [socket, dispatch]);

  return <div>SocketClient</div>;
};

export default SocketClient;
