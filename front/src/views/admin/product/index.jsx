import { useCallback, useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../contexts/auth";
import { Link, useNavigate } from "react-router-dom";
import Toast from "../../../components/Toast";
import Pagination from "../../../components/Pagination";
import "tw-elements-react/dist/css/tw-elements-react.min.css";
import Table from "../../../components/Table";
import createAxiosInstance from "../../../axios";
import { Permission } from "../../../helpers/permissions";

const Products = () => {
  const getInitialPage = () => {
    let page = new URLSearchParams(location.search).get("page");
    return page !== null && !isNaN(page) && page > 0 ? parseInt(page) : 1;
  };

  const auth = useContext(AuthContext);
  const axios = createAxiosInstance(auth);
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState([]);
  const [sort, setSort] = useState(null);
  const [links, setLinks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [numberofPages, setNumberOfPages] = useState(0);
  const [page, setPage] = useState(getInitialPage());
  // const [perPage, setPerPage] = useState(0);

  const changePage = ({ selected }) => {
    const newPage = selected + 1;
    setPage(newPage);
    fetchProducts(newPage);
  };

  const navigate = useNavigate();

  useEffect(() => {
    let params = new URLSearchParams(location.search);
    if (page !== 1 && typeof page === "number" && page > 0) {
      params.set("page", page);
      navigate(`?${params.toString()}`);
    } else {
      params.delete("page");
      navigate(`?${params.toString()}`);
    }

    return console.log("page changed finish", page);
  }, [page]);

  useEffect(() => {
    let params = new URLSearchParams(location.search);
    if (sort != null) {
      params.set("sort", sort);
      navigate(`?${params.toString()}`);
    } else {
      params.delete("sort");
      navigate(`?${params.toString()}`);
    }
    return console.log("sort changed finish", sort);
  }, [sort]);

  const handleDelete = (id) => {
    if (!confirm("are you sure you want to delete this product")) {
      return;
    }
    axios
      .delete(`/api/product/${id}`)
      .then(() => {
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
      .then(() => {
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
      })
      .finally(() => {
        setSelected([]);
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

  const handleCheckboxChange = useCallback(
    (event) => {
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
    },
    [setSelected]
  );

  const isSelected = (productId) => {
    return selected.includes(productId);
  };

  const handleSort = (newSort) => {
    setSort((prevSort) => (prevSort !== newSort ? newSort : null));
    fetchProducts(page, newSort);
  };

  const handleEdit = (id) => {
    navigate(`/admin/products/edit/${id}`);
  };

  const fetchProducts = async (forcePage = null, sort = null) => {
      !isLoading && setIsLoading(true);
      let paginateUrl = "api/product";
      let param = new URLSearchParams(location.search);

      forcePage && setPage(forcePage);

      param.set("page", forcePage || page);

      if (sort !== null) {
        param.set("sort", sort);
      }

      paginateUrl += `?${param.toString()}`;
      axios.get(paginateUrl)
        .then((response) => {
          console.log("response.data.data :>> ", response.data);
          setProducts(response.data.data);
          setNumberOfPages(response.data.meta.last_page);
          setLinks(response.data.meta);
          setIsLoading(false);
        })
        .catch(() => {
          setIsLoading(false);
        });
    };

  useEffect(() => {
    const CheckPoducts = async () => {
      if (products.length == 0) {
        await fetchProducts();
      }
    }
    if (!Permission.can(auth, "read-products")) {
      return navigate("/admin/dashboard", {
        replace: true,
      });
    } else {
      CheckPoducts();
    }

    return () => {
      console.log("Products component unmounted");
    };
  }, []);

  const columns = [
    { title: "Name", dataField: "name", sortable: true },
    { title: "Slug", dataField: "slug", sortable: true },
    {
      title: "Small Description",
      dataField: "small_description",
      sortable: true,
    },
    { title: "Description", dataField: "description", sortable: true },
    { title: "Price", dataField: "price", sortable: true },
    { title: "Quantity", dataField: "quantity", sortable: true },
    {
      title: "First Image",
      dataField: "images",
      type: "image",
      sortable: false,
    },
    {
      title: "Category",
      dataField: "category.name",
      type: "array",
      sortable: false,
    },
    { title: "Tags", dataField: "tags", sortable: false },
  ];

  return (
    <>
      <div className="container w-screen sm:!w-11/12 mx-auto">
        <div className="flex justify-between">
          <Link
            to="/admin/products/create"
            className="inline-block ml-3 rounded mt-3 bg-indigo-600 px-6 pb-2 pt-2.5 text-base font-medium leading-normal text-white"
          >
            Add product
          </Link>
          {selected.length > 0 && (
            <button
              className="inline-block ml-3 rounded mt-3 bg-red-600 px-6 pb-2 pt-2.5 text-base font-medium leading-normal text-white"
              onClick={() => handleDeleteMany()}
            >
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
          handleSort={handleSort}
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
