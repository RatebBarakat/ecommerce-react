import { useCallback, useContext, useEffect, useState } from "react";
import Loading from "../../../components/Loading";
import { Input } from "../../../components/input";
import createAxiosInstance from "../../../axios";
import { AuthContext } from "../../../contexts/auth";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import ErrorHelper from "../../../helpers/errors";

export default function CreateProduct() {
  const [isLoading, setIsLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [categories, setCategories] = useState([]);
  const auth = useContext(AuthContext);
  const [tags, setTags] = useState([]);
  const axios = createAxiosInstance(auth);
  const navigate = useNavigate();
  const [tagSuggestions, setTagSuggestions] = useState([]); // Store tag suggestions based on name
  const [product, setProduct] = useState({
    name: "",
    slug: "",
    small_description: "",
    description: "",
    price: "",
    quantity: "",
    images: [],
    category_id: 0,
    tags: [],
  });

  useEffect(() => {
    axios
      .get("api/category?type=all")
      .then((response) => {
        setCategories(response.data.data);
        axios.get("/api/tag?type=all").then((response) => {
          const tagsFromResponse = response.data.data.map((tag) => ({
            value: tag.id,
            label: tag.name,
          }));
          setTagSuggestions(tagsFromResponse);
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    setProduct({ ...product, slug: product.name.replace(/\s+/g, "-") });
  }, [product.name]);

  const handleFileUpload = (event) => {
    setProduct({ ...product, images: event.target.files });
  };

  const [errors, setErrors] = useState([]);

  const handleTagChange = (selectedOptions) => {
    setProduct({
      ...product,
      tags: selectedOptions,
    });
  };

  const handleSubmission = async (event) => {
    event.preventDefault();
    const formData = new FormData();

    for (const key in product) {
      if (key !== "images" && key !== "tags") {
        formData.append(key, product[key]);
      }
    }

    if (product.images) {
      Array.from(product.images).map((image) => {
        formData.append("images[]", image);
      });
    }

    if (product.tags) {
      Array.from(product.tags).map((tag) => {
        formData.append("tags[]", tag.value);
      });
    }

    axios
      .post("/api/product", formData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgress(percentCompleted);
        },
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        navigate("/admin/products");
      })
      .catch((error) => {
        let errorFromRequest = ErrorHelper.extractErrorMessage(error);
        errorFromRequest && setErrors(errorFromRequest);
      })
      .finally(() => {
        setProgress(0);
      });
  };

  return (
    <>
      {isLoading ? (
        <Loading size="large" />
      ) : (
        <form
          onSubmit={handleSubmission}
          action=""
          className="lg:!w-3/4 sm:grid mt-3 rounded shadow-2xl sm:grid-cols-2 sm:gap-3 mx-auto justify-center p-4"
        >
          <h2
            className="text-center font-bold text-3xl text-indigo-600"
            style={{ gridColumnStart: "1", gridColumnEnd: "3" }}
          >
            product
          </h2>
          <Input
            label="name"
            type="text"
            value={product.name}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            onChange={(event) =>
              setProduct({ ...product, name: event.target.value })
            }
            error={errors?.name || null}
            placeholder="name"
          />
          <Input
            label="slug"
            type="text"
            value={product.slug}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            onChange={(event) =>
              setProduct({ ...product, slug: event.target.value })
            }
            error={errors?.slug || null}
            placeholder="slug"
          />
          <Input
            label="small_description"
            type="text"
            value={product.small_description}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            onChange={(event) =>
              setProduct({ ...product, small_description: event.target.value })
            }
            error={errors?.small_description || null}
            placeholder="small_description"
          />
          <Input
            label="description"
            type="text"
            value={product.description}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            onChange={(event) =>
              setProduct({ ...product, description: event.target.value })
            }
            error={errors?.description || null}
            placeholder="description"
          />
          <Input
            label="price"
            type="number"
            value={product.price}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            onChange={(event) =>
              setProduct({ ...product, price: event.target.value })
            }
            error={errors?.price || null}
            placeholder="price"
          />
          <Input
            label="quantity"
            type="number"
            value={product.quantity}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            onChange={(event) =>
              setProduct({ ...product, quantity: event.target.value })
            }
            error={errors?.quantity || null}
            placeholder="quantity"
          />
          <div>
            <label
              htmlFor="tags"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Select tags
            </label>
            <Select
              isMulti
              options={tagSuggestions}
              value={product.tags}
              onChange={handleTagChange}
              styles={{
                control: (styles) => ({
                  ...styles,
                  borderRadius: "0.375rem",
                  border: "1px solid #D1D5DB",
                }),
                multiValueLabel: (styles) => ({
                  ...styles,
                  color: "white",
                }),
                multiValue: (styles) => ({
                  ...styles,
                  borderRadius: "0.375rem",
                  backgroundColor: "#4f46e5",
                  color: "white",
                  margin: "2px",
                  padding: "2px 4px",
                }),
              }}
            />
          </div>
          <div>
            <label
              for="categories"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Select a category
            </label>
            <select
              value={product.category_id}
              onChange={(event) =>
                setProduct({ ...product, category_id: event.target.value })
              }
              id="categories"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              <option selected>Choose a category</option>
              {categories &&
                categories.map((cat) => (
                  <option value={cat.id}>{cat.name}</option>
                ))}
            </select>
          </div>
          <Input
            label="avatar"
            type="file"
            name="file"
            multiple={true}
            error={errors?.avatar || null}
            onChange={handleFileUpload}
            style={{ gridColumnStart: "1", gridColumnEnd: "3" }}
          />
          {progress !== 0 && (
            <div
              className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700"
              style={{ gridColumnStart: "1", gridColumnEnd: "3" }}
            >
              <div
                className="bg-indigo-600 h-2.5 rounded-full"
                style={{
                  width: `${progress}%`,
                  gridColumnStart: "1",
                  gridColumnEnd: "3",
                }}
              ></div>
            </div>
          )}
          <button
            disabled={processing || progress !== 0}
            className="group disabled:cursor-not-allowed disabled:!bg-indigo-400 relative py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white !bg-indigo-600 hover:!bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            type="submit"
            style={{ gridColumnStart: "1", gridColumnEnd: "3" }}
          >
            Update Product
          </button>
        </form>
      )}
    </>
  );
}
