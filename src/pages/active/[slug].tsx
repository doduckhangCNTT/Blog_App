import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { showErrMsg, showSuccessMsg } from "../../components/alert/Alert";
import { postAPI } from "../../utils/FetchData";

const Active = () => {
  const { slug } = useParams();
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (slug) {
      postAPI("active", { active_token: slug })
        .then((res) => setSuccess(res.data.msg))
        .catch((err) => setErr(err.response.data.msg));
    }
  }, [slug]);

  return (
    <div>
      {" "}
      {err && showErrMsg(err)} {success && showSuccessMsg(success)}
    </div>
  );
};

export default Active;
