import React from "react";
import { Link } from "react-router-dom";

const Pagination = ({ currentPage, itemsPerPage, setCurrentPage, data }) => {
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="pagination dashboard-pagination">
      <ul>
        <li>
          <Link
            to="#"
            className="page-link"
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <i className="fa-solid fa-chevron-left" />
          </Link>
        </li>
        {pageNumbers.map((number) => (
          <li key={number}>
            <Link
              to="#"
              className={`page-link ${currentPage === number ? "active" : ""}`}
              onClick={() => paginate(number)}
            >
              {number}
            </Link>
          </li>
        ))}
        <li>
          <Link
            to="#"
            className="page-link"
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <i className="fa-solid fa-chevron-right" />
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Pagination;
