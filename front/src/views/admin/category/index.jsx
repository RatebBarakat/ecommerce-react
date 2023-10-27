// Categories.jsx
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../contexts/auth";
import Loading from "../../../components/Loading";
import Modal from "../../../components/Modal";
import { useNavigate } from "react-router-dom";
import Toast from "../../../components/Toast";
import ErrorHelper from "../../../helpers/errors";
import { Input } from "../../../components/input";
import { formToJSON } from "axios";
import Pagination from "../../../components/Pagination";
import ReactPaginate from "react-paginate";
import "tw-elements-react/dist/css/tw-elements-react.min.css";
import Table from "../../../components/Table";
import createAxiosInstance from "../../../axios";

const Categories = () => {
  const axios = createAxiosInstance();
  const auth = useContext(AuthContext);
  const [categories, setCategories] = useState([]);
  const [selected, setSelected] = useState([]);
  const [links, setLinks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setEditShowModal] = useState(false);
  const [numberofPages, setNumberOfPages] = useState(0);
  const [page, setPage] = useState(
    new URLSearchParams(location.search).get("page") || 1
  );
  const [perPage, setPerPage] = useState(0);
  const [errors, setErrors] = useState({
    add: {},
    edit: {},
  });
  const [form, setForm] = useState({
    name: "",
    slug: "",
  });

  const [editForm, setEditForm] = useState({
    id: "",
    name: "",
    slug: "",
  });

  const changePage = ({ selected }) => {
    const newPage = selected + 1;
    setPage(newPage);
    fetchCategories(newPage);
  };

  useEffect(() => {
    setForm({ ...form, slug: form.name.replace(/\s+/g, "-") });
  }, [form.name]);

  useEffect(() => {
    setEditForm({ ...editForm, slug: editForm.name.replace(/\s+/g, "-") });
  }, [editForm.name]);

  useEffect(() => {
    let params = new URLSearchParams();
    params.set("page", page);
    navigate(`?${params.toString()}`);
  }, [page]);

  const navigate = useNavigate();

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const toggleEditModal = () => {
    setEditShowModal(!showEditModal);
  };

  const resetErrors = () => {
    setErrors({ add: {}, edit: {} });
  };

  const resetInputs = (type) => {
    type == "add"
      ? setForm({ name: "", slug: "" })
      : setEditForm({ name: "", slug: "" });
  };

  const handleSubmit = async () => {
    resetErrors();
    axios
      .post(`/api/category`, form)
      .then((response) => {
        fetchCategories(1);
        resetInputs("add");
        setPage(1);
        toggleModal();
        Toast.notifyMessage("success", "category added");
      })
      .catch((error) => {
        const addErrors = ErrorHelper.extractErrorMessage(error);
        setErrors({ add: addErrors, edit: {} });
      });
  };

  const openEditForm = (id) => {
    resetErrors();
    axios
      .get(`/api/category/${id}`)
      .then((response) => {
        setEditForm(response.data.data);
        toggleEditModal();
      })
      .catch((error) => {
        Toast.notifyMessage("an error occur");
      });
  };

  const handleEditSubmit = () => {
    axios
      .put(`/api/category/${editForm.id}`, editForm)
      .then((response) => {
        fetchCategories(page);
        resetInputs("edit");
        toggleEditModal();
        Toast.notifyMessage("success", "category updated");
      })
      .catch((error) => {
        const editErrors = ErrorHelper.extractErrorMessage(error);
        setErrors({ edit: editErrors, add: {} });
      });
  };

  const handleDelete = (id) => {
    if (!confirm("are you sure you want to delete this category")) {
      return;
    }
    axios
      .delete(`/api/category/${id}`)
      .then((response) => {
        fetchCategories(1);
        Toast.notifyMessage("success", "category delted");
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
    if (!confirm("are you sure you want to delete selected categories")) {
      return;
    }
    axios
      .post(`/api/category/deleteMany`, { ids: Array.from(selected) })
      .then((response) => {
        fetchCategories(1);
        Toast.notifyMessage("success", "category delted");
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
      const allIds = categories.map((category) => category.id);
      setSelected(allIds);
    } else {
      setSelected([]);
    }
  };

  const handleCheckboxChange = (event) => {
    const categoryId = parseInt(event.target.value);
    const isChecked = event.target.checked;

    setSelected((prevSelected) => {
      if (isChecked) {
        return [...prevSelected, categoryId];
      } else {
        return prevSelected.filter((id) => id !== categoryId);
      }
    });
  };

  const isSelected = (categoryId) => {
    return selected.includes(categoryId);
  };

  const handlePaginate = (page) => {
    fetchCategories(page);
  };

  const fetchCategories = async (page = null) => {
    !isLoading && setIsLoading(true);
    page !== null && setPage(page);
    let paginateUrl = "api/category";
    if (page !== null) {
      paginateUrl += `?page=${page}`;
    }
    axios
      .get(paginateUrl)
      .then((response) => {
        setCategories(response.data.data);
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
    if (!auth.permissions.includes("read-categories")) {
      return navigate("/");
    } else {
      let params = new URLSearchParams(location.search);
      params.get("page") ? fetchCategories(page) : fetchCategories();
    }
  }, [auth.permissions]);

  const columns = [
    { title: "Name", dataField: "name" },
    { title: "Slug", dataField: "slug" },
  ];

  return (
    <>
      <div className="container w-screen sm:!w-11/12 mx-auto">
        <div className="flex justify-between">
          <button
            className="inline-block ml-3 rounded mt-3 bg-indigo-600 px-6 pb-2 pt-2.5 text-base font-medium leading-normal text-white"
            onClick={toggleModal}
          >
            Add Category
          </button>
          {selected.length > 0 && (
            <button onClick={(event) => handleDeleteMany()}>
              delete selected
            </button>
          )}
        </div>
        <Table
          columns={columns}
          data={categories}
          selected={selected}
          canEdit="update-categories"
          canDelete="delete-categories"
          handleEdit={openEditForm}
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

      <Modal
        identifier="add"
        errors={errors.add}
        header="add category"
        showModal={showModal}
        toggleModal={toggleModal}
        onSubmit={handleSubmit}
      >
        <Input
          label="name"
          type="text"
          value={form.name}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
          onChange={(event) => setForm({ ...form, name: event.target.value })}
          placeholder="name"
        />
        <Input
          label="slug"
          type="text"
          value={form.slug}
          classslug="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
          onChange={(event) => setForm({ ...form, slug: event.target.value })}
          placeholder="country"
        />
      </Modal>
      
      <Modal
        header="edit category"
        identifier="edit"
        showModal={showEditModal}
        toggleModal={toggleEditModal}
        onSubmit={handleEditSubmit}
        errors={errors.edit}
      >
        <Input
          label="name"
          type="text"
          value={editForm.name}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
          onChange={(event) =>
            setEditForm({ ...editForm, name: event.target.value })
          }
          placeholder="country"
        />

        <Input
          label="slug"
          type="text"
          value={editForm.slug}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
          onChange={(event) =>
            setEditForm({ ...editForm, slug: event.target.value })
          }
          placeholder="country"
        />
      </Modal>
    </>
  );
};

export default Categories;
