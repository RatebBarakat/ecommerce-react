import { useContext, useEffect, useState } from "react";
import Loading from "../../../components/Loading";
import { Input } from "../../../components/input";
import axios from "../../../axios";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../../contexts/auth";
import Toast from "../../../components/Toast";
import createAxiosInstance from "../../../axios";

export default function Updateproduct() {
  const [isLoading, setIsLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [temporaryImages, setTemporaryImages] = useState([]);
  let { id } = useParams();
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const axios = createAxiosInstance(auth);

  const [product, setProduct] = useState({
    name: "",
    slug: "",
    small_description: "",
    description: "",
    price: "",
    quantity: "",
    images: [],
    category_id: 12,
  });

  useEffect(() => {
    if (!id) return navigate("/user/products");
  }, [id, navigate]);

  const fetchProduct = () => {
    axios
      .get(`/api/product/${id}`)
      .then((response) => {
        const data = response.data.data;
        setProduct(() => ({
          ...data,
          images:
            data.images?.map((image) => ({
              id: image,
              url: image,
            })) || [],
        }));
        setTemporaryImages(data.images);
        console.log("temporaryImages :>> ", temporaryImages);
      })
      .catch((error) => {
        console.log("error.response.status :>> ", error.response.status);
        if (error.response.status == 404) {
          Toast.notifyMessage("error", "product not found");
          return navigate("/user/dashboard");
        }
        console.log("error :>> ", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchProduct();
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

  const handleFileUpload = (event) => {
    const uploadedImages = [];
    const files = Array.from(event.target.files);

    files.forEach((image) => {
      const imageUrl = URL.createObjectURL(image);
      uploadedImages.push({ id: null, url: imageUrl, file: image });
    });

    setProduct((prevProduct) => ({
      ...prevProduct,
      images: [...prevProduct.images, ...uploadedImages],
    }));
    setTemporaryImages([...temporaryImages, ...uploadedImages]);
  };

  useEffect(() => {
    setProduct({ ...product, slug: product.name.replace(/\s+/g, "-") });
  }, [product.name]);

  const handleSubmission = async (event) => {
    event.preventDefault();
    const formData = new FormData();

    formData.append("_method", "PUT");

    for (const key in product) {
      if (key != "images") {
        formData.append(key, product[key]);
      }
    }

    formData.append("category_id", 1);

    const newImages = product.images.filter((image) => image.id === null);
    console.log('newImages :>> ', newImages);

    if (newImages.length > 0) {
      product.images.forEach((image) => {
        formData.append("images[]", image.file);
      });
    }

    axios
      .post(`/api/product/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log("response: ", response);
      })
      .catch((error) => {
        console.log("error: ", error);
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
          <Input
            label="images"
            type="file"
            name="file"
            multiple={true}
            error={errors?.images || null}
            onChange={(event) => handleFileUpload(event)}
            style={{ gridColumnStart: "1", gridColumnEnd: "3" }}
          />
          <div
            className="flex gap-2 flex-wrap w-full"
            style={{ gridColumnStart: "1", gridColumnEnd: "3" }}
          >
            {temporaryImages &&
              temporaryImages.map((image) => {
                return (
                  <div key={image.id ?? image.url} className="image-container">
                    <img className="w-14 h-14" src={image.url} alt="display" />
                    <button
                      type="button"
                      disabled={processing}
                      onClick={() => handleRemoveImage(image)}
                      className="bg-red-600 text-white rounded disabled:bg-red-300 disabled:cursor-not-allowed"
                    >
                      x
                    </button>
                  </div>
                );
              })}
          </div>
          <button
            disabled={processing}
            className="group disabled:cursor-not-allowed disabled:!bg-indigo-400 relative py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white !bg-indigo-600 hover:!bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            type="submit"
            style={{ gridColumnStart: "1", gridColumnEnd: "3" }}
          >
            update product
          </button>
        </form>
      )}
    </>
  );
}
