import React from "react";
import Link from "antd/es/typography/Link";

const AdminPagination = ({ totalPages, recordsPerPage, setCurrentPage, currentPage }) => {

    const pages = [];

    for (let i = 1; i <= Math.ceil(totalPages / recordsPerPage); i++) {
        pages.push(i);
    }

    console.log("totalPages", totalPages);
    console.log("recordsPerPage", recordsPerPage);
    console.log("pages", pages.length);

    return (
        <div className="pagination dashboard-pagination" style={{ marginBottom: "20px" }}>
            <ul>
                <li>
                    <Link to="#" className="page-link">
                        <i className="fa-solid fa-chevron-left" />
                    </Link>
                </li>

                {pages.map((page) => {


                    <li>
                        <Link to="#" className="page-link">
                            {page}
                        </Link>
                    </li>



                    /*
                    return <button key={index} onClick={() => setCurrentPage(page)}
                        className={currentPage == page ? "pagination-button-active" : "pagination-button"}
                    >{page}</button>
                    */
                })}

                {pages.map((number) => (
                    <li key={number}>
                        <Link
                            to="#"
                            className={`page-link ${currentPage === number ? "active" : ""}`}
                            onClick={() => setCurrentPage(number)}
                        >
                            {number}
                        </Link>
                    </li>
                ))}


                <li>
                    <Link to="#" className="page-link">
                        <i className="fa-solid fa-chevron-right" />
                    </Link>
                </li>
            </ul>
        </div>
    )
}

export default AdminPagination