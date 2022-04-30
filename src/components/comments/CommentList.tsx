import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteComment,
  replyComment,
  updateComment,
} from "../../redux/actions/commentAction";
import { IComment, RootStore } from "../../utils/TypeScript";
import Input from "./Input";

interface IProps {
  comment: IComment;
  showReply: IComment[];
  setShowReply: (showReply: IComment[]) => void;
  children: any;
}

const CommentList: React.FC<IProps> = ({
  children,
  comment,
  showReply,
  setShowReply,
}) => {
  const [onReply, setOnReply] = useState(false);
  const [edit, setEdit] = useState<IComment>();

  const { auth } = useSelector((state: RootStore) => state);
  const dispatch = useDispatch();

  const Nav = (comment: IComment) => {
    return (
      <div>
        <span onClick={() => handleDelete(comment)}>Delete</span>
        <span onClick={() => setEdit(comment)}>Update</span>
      </div>
    );
  };

  const handleReply = (body: string) => {
    if (!auth.user || !auth.access_token) {
      return;
    }
    const data = {
      user: auth.user, // Thông tin người trả lời tin nhắn
      blog_id: comment.blog_id, // Id của blog đang reply
      blog_user_id: comment.blog_user_id, // Id của user đã tạo ra blog
      content: body, // Nội dung reply
      replyCM: [],
      reply_user: comment.user, // Thông tin của người được trả lời
      comment_root: comment.comment_root || comment._id, // Id của tin nhắn gốc (tin nhắn đang đc trả lời)
      createdAt: new Date().toISOString(),
    };
    // console.log("Data: ", data);
    dispatch(replyComment(data, auth.access_token));

    setShowReply([data, ...showReply]);
    setOnReply(false);
  };

  const handleUpdate = (body: string) => {
    if (!auth.user || !auth.access_token || !edit) return;

    if (body === edit.content) {
      return setEdit(undefined);
    }
    const newComment = { ...edit, content: body };
    // console.log("New Comment: ", newComment);
    dispatch(updateComment(newComment, auth.access_token));
    setEdit(undefined);
  };

  const handleDelete = (comment: IComment) => {
    if (!auth.user || !auth.access_token) return;

    dispatch(deleteComment(comment, auth.access_token));
  };

  return (
    <div className="w-100">
      {edit ? (
        <Input callback={handleUpdate} edit={edit} setEdit={setEdit} />
      ) : (
        <div className="comment_box">
          <div
            className="p-2"
            dangerouslySetInnerHTML={{
              __html: comment.content,
            }}
          />

          <div className="d-flex justify-content-between p-2">
            <small
              style={{ cursor: "pointer" }}
              onClick={() => setOnReply(!onReply)}
            >
              {onReply ? "-Cancel-" : "- Reply -"}
            </small>

            <small className="d-flex">
              <div className="comment_nav" style={{ cursor: "pointer" }}>
                {
                  comment.blog_user_id === auth.user?._id ? ( // Kiem tra là chủ của blog nay
                    comment.user._id === auth.user._id ? ( // Kiem tra là người tạo ra comment này
                      Nav(comment) // vừa là chủ blog và là người comment
                    ) : (
                      <span onClick={() => handleDelete(comment)}>Delete</span>
                    )
                  ) : (
                    comment.user._id === auth.user?._id && Nav(comment)
                  ) // Ko phai là chủ blog này nhưng có tin nhắn của bản thân trong blog này
                }
              </div>
              <div>{new Date(comment.createdAt).toLocaleString()}</div>
            </small>
          </div>
        </div>
      )}

      {onReply && <Input callback={handleReply} />}

      {children}
    </div>
  );
};

export default CommentList;
