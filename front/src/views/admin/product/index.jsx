// Products.jsx
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../contexts/auth";
import { Link, useNavigate } from "react-router-dom";
import Toast from "../../../components/Toast";
import Pagination from "../../../components/Pagination";
import "tw-elements-react/dist/css/tw-elements-react.min.css";
import Table from "../../../components/Table";
import createAxiosInstance from "../../../axios";

const Products = () => {
  const auth = useContext(AuthContext);
  const axios = createAxiosInstance(auth);
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState([]);
  const [links, setLinks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [numberofPages, setNumberOfPages] = useState(0);
  const [page, setPage] = useState(
    new URLSearchParams(location.search).get("page") || 1
  );
  const [perPage, setPerPage] = useState(0);

  const changePage = ({ selected }) => {
    const newPage = selected + 1;
    setPage(newPage);
    fetchProducts(newPage);
  };

  const navigate = useNavigate();

  useEffect(() => {
    let params = new URLSearchParams();
    params.set("page", page);
    navigate(`?${params.toString()}`);
  }, [page]);


  const handleDelete = (id) => {
    if (!confirm("are you sure you want to delete this product")) {
      return;
    }
    axios
      .delete(`/api/product/${id}`)
      .then((response) => {
        fetchProducts(1);
        Toast.notifyMessage("success", "product delted");
      })
      .catch((error) => {
        Toast.notifyMessage(
          "error",
          error.response?.data?.message,
          toString() ?? "cant delete"
        );
      });
  };

  const handleDeleteMany = () => {
    if (!confirm("are you sure you want to delete selected products")) {
      return;
    }
    console.log("selected :>> ", selected);
    axios
      .post(`/api/product/deleteMany`, { ids: Array.from(selected) })
      .then((response) => {
        setSelected([]);
        fetchProducts(1);
        Toast.notifyMessage("success", "products delted");
      })
      .catch((error) => {
        Toast.notifyMessage(
          "error",
          error.response?.data?.message,
          toString() ?? "cant delete"
        );
      });
  };

  const handleSelectAll = (event) => {
    const selectedAll = event.target.checked;
    if (selectedAll) {
      const allIds = products.map((product) => product.id);
      setSelected(allIds);
    } else {
      setSelected([]);
    }
  };

  const handleCheckboxChange = (event) => {
    const productId = parseInt(event.target.value);
    console.log("productId :>> ", productId);
    const isChecked = event.target.checked;

    setSelected((prevSelected) => {
      if (isChecked) {
        return [...prevSelected, productId];
      } else {
        return prevSelected.filter((id) => id !== productId);
      }
    });
  };

  const isSelected = (productId) => {
    return selected.includes(productId);
  };

  const handlePaginate = (page) => {
    fetchProducts(page);
  };

  const handleEdit = (id) => {
    navigate(`/user/products/edit/${id}`);
  };

  const fetchProducts = async (page = null) => {
    !isLoading && setIsLoading(true);
    page !== null && setPage(page);
    let paginateUrl = "api/product";
    if (page !== null) {
      paginateUrl += `?page=${page}`;
    }
    axios
      .get(paginateUrl)
      .then((response) => {
        console.log('response.data.data :>> ', response.data);
        setProducts(response.data.data);
        setNumberOfPages(response.data.meta.last_page);
        setPerPage(response.data.meta.per_page);
        setLinks(response.data.meta);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (!auth.permissions.includes("read-products")) {
      return navigate("/");
    } else {
      let params = new URLSearchParams(location.search);
      fetchProducts(page);
    }
  }, [auth.permissions]);

  const columns = [
    { title: "Name", dataField: "name" },
    { title: "Slug", dataField: "slug" },
    { title: "small description", dataField: "small_description" },
    { title: "description", dataField: "description" },
    { title: "price", dataField: "price" },
    { title: "quantity", dataField: "quantity" },
    { title: "first image", dataField: "images", type: "image" },
    { title: "category", dataField: "category.name", type: "array" },
  ];

  return (
    <>
      <div className="container w-screen sm:!w-11/12 mx-auto">
        <div className="flex justify-between">
          <Link to='/user/products/create' className="inline-block ml-3 rounded mt-3 bg-indigo-600 px-6 pb-2 pt-2.5 text-base font-medium leading-normal text-white">
            Add product
          </Link>
          {selected.length > 0 && (
            <button onClick={(event) => handleDeleteMany()}>
              delete selected
            </button>
          )}
        </div>
        <Table
          columns={columns}
          data={products}
          selected={selected}
          canEdit="update-products"
          canDelete="delete-products"
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          handleCheckboxChange={handleCheckboxChange}
          handleSelectAll={handleSelectAll}
          isSelected={isSelected}
          isLoading={isLoading}
        />
        {Object.keys(links).length > 0 && (
          <Pagination
            page={page}
            numberofPages={numberofPages}
            changePage={changePage}
          ></Pagination>
        )}
      </div>
    </>
  );
};

export default Products;
