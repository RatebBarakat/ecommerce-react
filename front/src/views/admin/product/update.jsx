import { useContext, useEffect, useState } from "react";
import Loading from "../../../components/Loading";
import { Input } from "../../../components/input";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../../contexts/auth";
import Toast from "../../../components/Toast";
import createAxiosInstance from "../../../axios";
import Select from "react-select";

export default function UpdateProduct() {
  const [isLoading, setIsLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [temporaryImages, setTemporaryImages] = useState([]);
  let { id } = useParams();
  const auth = useContext(AuthContext);
  const [tags, setTags] = useState([]);
  const axios = createAxiosInstance(auth);
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [categories, setCategories] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  const [product, setProduct] = useState({
    name: "",
    slug: "",
    small_description: "",
    description: "",
    price: "",
    quantity: "",
    images: [],
    tags : [],
    category_id: 12,
  });

  useEffect(() => {
    if (!id) return navigate("/user/products");
  }, [id]);

  const fetchProduct = () => {
    axios
      .get(`/api/product/${id}`)
      .then((response) => {
        const data = response.data.data;
        setProduct({
          ...data,
          category_id: data.category?.id,
          images:
            data.images?.map((image) => ({
              id: image.id,
              url: image.url,
              file: image.url,
            })) || [],
            tags : Array.from(data.tags?.map((tag) => {
              return {
                value : tag.id,
                label : tag.name,
              }
            }) || [])
        });
        setTemporaryImages(data.images);
      })
      .catch((error) => {
        if (error.response.status === 404) {
          Toast.notifyMessage("error", "Product not found");
          return navigate("/user/dashboard");
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    axios.get("api/category?type=all").then((response) => {
      setCategories(response.data.data);
      fetchProduct();
      axios.get("/api/tag").then((response) => {
        const tagsFromResponse = response.data.data.map((tag) => ({
          value: tag.id,
          label: tag.name,
        }));
        setSuggestions(tagsFromResponse);
      });
    });
  }, [id, auth.permissions]);

  const handleRemoveImage = (image) => {
    setProcessing(true);

    if (image.id !== null) {
      axios
        .post(`/api/product/deleteImage`, {
          id: id,
          image_id: image.id,
        })
        .then(() => {
          const updatedTemporaryImages = temporaryImages.filter(
            (img) => img.id !== image.id
          );
          setTemporaryImages(updatedTemporaryImages);
        })
        .catch((error) => {
          console.error("Error deleting image: ", error);
          Toast.notifyMessage("error", "Error deleting image");
        })
        .finally(() => {
          setProcessing(false);
        });
    } else {
      const updatedTemporaryImages = temporaryImages.filter(
        (img) => img.file !== image.file
      );
      setTemporaryImages(updatedTemporaryImages);
    }
  };

  const [errors, setErrors] = useState([]);

  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);

    if (temporaryImages.length + files.length > 5) {
      Toast.notifyMessage(
        "error",
        "you cannot upload more than  images for single product"
      );
      return;
    }

    const formData = new FormData();

    files.forEach((file) => {
      formData.append("images[]", file);
    });

    axios
      .post(`/api/product/uploadImage/${id}`, formData, {
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
        const uploadedImages = response.data.images;
        const imagesToAdd = uploadedImages.map((image) => ({
          id: image.id,
          url: image.url,
          file: image.url,
        }));

        setProduct((prevProduct) => ({
          ...prevProduct,
          images: [...prevProduct.images, ...imagesToAdd],
        }));
        setTemporaryImages([...temporaryImages, ...imagesToAdd]);
      })
      .catch((error) => {
        Toast.notify("error", error.response.data.message);
      })
      .finally(() => {
        setProgress(0);
      });
    event.target.value = "";
  };

  const handleTagChange = (selectedOptions) => {
    setProduct({
      ...product,
      tags: selectedOptions,
    });
  };

  useEffect(() => {
    setProduct({ ...product, slug: product.name.replace(/\s+/g, "-") });
  }, [product.name]);

  const handleSubmission = async (event) => {
    event.preventDefault();
    setProcessing(true);
    const formData = new FormData();

    formData.append("_method", "PUT");


    for (const key in product) {
      if (key !== "images" && key !== "tags") {
        formData.append(key, product[key]);
      }
    }

    if (product.tags) {
      console.log('product.tags :>> ', product.tags);
      Array.from(product.tags).map((image) => {
        formData.append("tags[]", image.value);
      });
    }

    formData.append("category_id", 1);
    axios
      .post(`/api/product/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        navigate("/user/products");
      })
      .catch((error) => {
        console.log("error: ", error);
      })
      .finally(() => {
        setProcessing(false);
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
          className="lg:w-3/4 sm:grid mt-3 rounded shadow-2xl sm:grid-cols-2 sm:gap-3 mx-auto justify-center p-4"
        >
          <h2
            className="text-center font-bold text-3xl text-indigo-600"
            style={{ gridColumnStart: "1", gridColumnEnd: "3" }}
          >
            Product
          </h2>
          <Input
            label="name"
            type="text"
            value={product.name}
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
              options={suggestions}
              value={product.tags}
              onChange={handleTagChange}
              styles={{
                control: (styles) => ({
                  ...styles,
                  borderRadius: "0.375rem",
                  border: "1px solid #D1D5DB",
                }),
                multiValue: (styles) => ({
                  ...styles,
                  borderRadius: "0.375rem",
                }),
              }}
            />
          </div>
          <div>
            <label
              for="countries"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Select an option
            </label>
            <select
              value={product.category_id}
              onChange={(event) =>
                setProduct({ ...product, category_id: event.target.value })
              }
              id="countries"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              <option selected>Choose a country</option>
              {categories &&
                categories.map((cat) => (
                  <option value={cat.id}>{cat.name}</option>
                ))}
            </select>
          </div>
          <Input
            label="images"
            type="file"
            name="file"
            multiple={true}
            error={errors?.images || null}
            onChange={handleFileUpload}
            style={{ gridColumnStart: "1", gridColumnEnd: "3" }}
          />
          <div
            className="flex gap-2 flex-wrap w-full"
            style={{ gridColumnStart: "1", gridColumnEnd: "3" }}
          >
            {temporaryImages.map((image) => (
              <div key={image.id ?? image.url} className="image-container">
                <img className="w-14 h-14" src={image.url} alt="display" />
                <button
                  type="button"
                  disabled={processing}
                  onClick={() => handleRemoveImage(image)}
                  className="bg-red-600 text-white px-1 mt-1 rounded disabled:bg-red-300 disabled:cursor-not-allowed"
                >
                  x
                </button>
              </div>
            ))}
          </div>
          {progress !== 0 && (
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div
                className="bg-indigo-600 h-2.5 rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          )}
          <button
            disabled={processing || progress !== 0}
            className="group !bg-indigo-600 disabled:cursor-not-allowed
             disabled:bg-indigo-400 relative py-2 px-4 border border-transparent
              text-sm font-medium rounded-md text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            type="submit"
            style={{ gridColumnStart: "1", gridColumnEnd: "3" }}
          >
            {processing || progress !== 0 ? "Updating..." : "Update Product"}
          </button>
        </form>
      )}
    </>
  );
}
