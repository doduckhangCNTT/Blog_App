import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface IProps {
  total: number;
  callback: (number: number) => void;
}

const Pagination: React.FC<IProps> = ({ total, callback }) => {
  const [page, setPage] = useState(1);
  const { search } = useLocation();
  // console.log("Search: ", search);

  const navigate = useNavigate();

  useEffect(() => {
    const page = new URLSearchParams(search).get("page") || 1;
    // console.log("Page: ", page);
    setPage(Number(page));
  }, [search]);

  const newArr = [...Array(total)].map((_, i) => i + 1);

  const isActive = (index: number) => {
    if (index === page) return "active";
    return "";
  };

  const handlePagination = (number: number) => {
    navigate(`?page=${number}`);
    callback(number);
  };

  return (
    <nav aria-label="Page navigation example" style={{ cursor: "pointer" }}>
      <ul className="pagination">
        {page > 1 && (
          <li className="page-item" onClick={() => handlePagination(page - 1)}>
            <span className="page-link" aria-label="Previous">
              <span aria-hidden="true">&laquo;</span>
            </span>
          </li>
        )}

        {newArr.map((num) => (
          <li
            key={num}
            className={`page-item ${isActive(num)}`}
            onClick={() => handlePagination(num)}
          >
            <span className="page-link">{num}</span>
          </li>
        ))}

        {page < total && (
          <li className="page-item" onClick={() => handlePagination(page + 1)}>
            <span className="page-link" aria-label="Next">
              <span aria-hidden="true">&raquo;</span>
            </span>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Pagination;
