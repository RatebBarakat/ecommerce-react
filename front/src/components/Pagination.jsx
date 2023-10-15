import React from "react";
import ReactPaginate from "react-paginate";

export default function Pagination({ page, numberofPages, changePage }) {
  return (
    <ReactPaginate
      pageCount={numberofPages}
      initialPage={0}
      forcePage={page - 1}
      pageRangeDisplayed={2}
      marginPagesDisplayed={3}
      onPageChange={changePage}
      containerClassName={"flex my-6 items-center"}
      activeClassName={"!bg-indigo-600 text-white px-4 py-2 rounded"}
      pageClassName={"px-4 py-2 rounded hover:bg-indigo-400 hover:text-white"}
      previousLinkClassName={`mr-2 px-4 py-2 rounded ${
        page <= 1 ? "!cursor-not-allowed" : ""
      }`}
      nextLinkClassName={`ml-2 px-4 py-2 rounded ${
        page >= numberofPages ? "!cursor-not-allowed" : ""
      }`}
      breakClassName={"mx-2 px-4 py-2"}
      previousLabel={"Previous"}
      nextLabel={"Next"}
      disableInitialCallback={true}
    />
  );
}
