// Categories.jsx
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../contexts/auth";
import Loading from "../../../components/Loading";
import axios from "../../../axios";
import Modal from "../../../components/Modal";
import { useNavigate } from "react-router-dom";
import Toast from "../../../components/Toast";
import ErrorHelper from "../../../helpers/errors";

const Categories = () => {
  const auth = useContext(AuthContext);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setEditShowModal] = useState(false);
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

  const navigate = useNavigate();

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const toggleEditModal = () => {
    setEditShowModal(!showEditModal);
  };

  const handleSubmit = async () => {
    console.log('editForm :>> ', editForm);
    axios
      .post(`/api/category`, form)
      .then((response) => {
        fetchCategories();
        toggleModal();
        Toast.notifyMessage("success", "category added");
      })
      .catch((error) => {
        const addErrors = ErrorHelper.extractErrorMessage(error);
        setErrors({ add: addErrors, edit: {} });
      });
  };

  const openEditForm = (id) => {
    axios
      .get(`/api/category/${id}`)
      .then((response) => {
        console.log('response :>> ', response.data.data);
        setEditForm(response.data.data);
        toggleEditModal();
      })
      .catch((error) => {
        Toast.notifyMessage('an error occur');
      });
  }

  const handleEditSubmit = () => {
    axios
      .put(`/api/category/${editForm.id}`, editForm)
      .then((response) => {
        fetchCategories();
        toggleEditModal();
        Toast.notifyMessage("success", "category updated");
      })
      .catch((error) => {
        const editErrors = ErrorHelper.extractErrorMessage(error);
        setErrors({ edit: editErrors, add: {} });
      });
  };

  const handleDelete = (id) => {
    axios
    .delete(`/api/category/${id}`)
    .then((response) => {
      fetchCategories();
      Toast.notifyMessage("success", "category delted");
    })
    .catch((error) => {
      Toast.notifyMessage('error',error.response?.data?.message,toString() ?? 'cant delete');
    });
  }

  const fetchCategories = async () => {
    !isLoading && setIsLoading(true);
    axios
      .get("/api/category")
      .then((response) => {
        setCategories(response.data.data);
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
      fetchCategories();
    }
  }, [auth.permissions]);

  return (
    <>
      <button
        className="inline-block rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white"
        onClick={toggleModal}
      >
        Add category
      </button>
      <div className="table-responsive m-3">
        <table className="table mt-4">
          <thead className="table-header-group">
            <tr className="bg-indigo-500 text-white">
              <th>name</th>
              <th>slug</th>
              <th>actions</th>
            </tr>
          </thead>
          {isLoading ? (
            <tbody>
              <tr>
                <td colspan="3">
                  <div className="flex items-center justify-center h-full">
                    <Loading centered={false} size="small" />
                  </div>
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {categories.length === 0 ? (
                <tr>
                  <td className="p-2">no categories</td>
                </tr>
              ) : (
                categories.map((category) => {
                  return (
                    <tr key={category.id}>
                      <td>{category.name}</td>
                      <td>{category.slug}</td>
                      <td>
                        <button
                          onClick={() => openEditForm(category.id)}
                          className="rounded px-4 py-1 text-sm border border-green-500 text-green-500 hover:bg-green-500 hover:text-indigo-100 duration-300"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(category.id)}
                          className="rounded px-4 py-1 text-sm border border-red-500 text-red-500 hover:bg-red-500 hover:text-indigo-100 duration-300">
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          )}
        </table>
      </div>
      <Modal
        identifier="add"
        errors={errors.add}
        header='add category'
        showModal={showModal}
        toggleModal={toggleModal}
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          onChange={(event) => setForm({ ...form, name: event.target.value })}
          placeholder="name"
        />
        <input
          type="text"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          onChange={(event) => setForm({ ...form, slug: event.target.value })}
          placeholder="slug"
        />
      </Modal>

      <Modal
        header='edit category'
        identifier="edit"
        showModal={showEditModal}
        toggleModal={toggleEditModal}
        onSubmit={handleEditSubmit}
      >
        <input
          type="text"
          value={editForm.name}  // Use editForm.name
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          onChange={(event) => setEditForm({ ...editForm, name: event.target.value })}  // Update editForm
          placeholder="name"
        />

        <input
          type="text"
          value={editForm.slug}  // Use editForm.slug
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          onChange={(event) => setEditForm({ ...editForm, slug: event.target.value })}  // Update editForm
          placeholder="slug"
        />

      </Modal>
    </>
  );
};

export default Categories;
