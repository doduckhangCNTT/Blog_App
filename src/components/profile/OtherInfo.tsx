import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getOtherInfo } from "../../redux/actions/userAction";
import { IUser, RootStore } from "../../utils/TypeScript";
import Loading from "../global/Loading";

interface IProps {
  id: string;
}

const OtherInfo: React.FC<IProps> = ({ id }) => {
  const { otherInfo } = useSelector((state: RootStore) => state);

  const dispatch = useDispatch();
  const [other, setOther] = useState<IUser>();

  useEffect(() => {
    // Kiểm tra thông tin của user của blog đã tồn tại trên store hay chưa
    if (otherInfo.every((item) => item._id !== id)) {
      dispatch(getOtherInfo(id));
    } else {
      const newUser = otherInfo.find((item) => item._id === id);
      if (newUser) {
        setOther(newUser);
      }
    }
  }, [id, dispatch, otherInfo]);

  if (!other) return <Loading />;

  return (
    <div className="profile_info text-center rounded">
      <div className="info_avatar">
        <img src={other.avatar} alt="avatar" />
      </div>

      <h5 className="text-uppercase text-danger">{other.role}</h5>

      <div>
        Name: <span className="text-info">{other.name}</span>
      </div>

      <div>Email / Phone number</div>
      <span className="text-info">{other.account}</span>

      <div>
        Join Date:{" "}
        <span style={{ color: "#ffc107" }}>
          {new Date(other.createdAt).toLocaleString()}
        </span>
      </div>
    </div>
  );
};

export default OtherInfo;
