import { useContext, useEffect, useState } from "react";
import Loading from "../../../components/Loading";
import { Input } from "../../../components/input";
import createAxiosInstance from "../../../axios";
import { AuthContext } from "../../../contexts/auth";

export default function CreateProduct() {
  const [isLoading, setIsLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
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
    category_id: 1,
  });

  useEffect(() => {
    setProduct({ ...product, slug: product.name.replace(/\s+/g, "-") });
  }, [product.name]);

  const handleFileUpload = (event) => {
    setProduct({ ...product, images: event.target.files });
  };

  const [errors, setErrors] = useState([]);

  const handleSubmission = async (event) => {
    event.preventDefault();
    const formData = new FormData();

    for (const key in product) {
      if (key !== "images") {
        formData.append(key, product[key]);
      }
    }

    if (product.images) {
      Array.from(product.images).map((image) => {
        formData.append("images[]", image);
      });
    }

    axios
      .post("/api/product", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log("response :>> ", response);
      })
      .catch((error) => {
        console.log("error :>> ", error);
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
            label="avatar"
            type="file"
            name="file"
            multiple={true}
            error={errors?.avatar || null}
            onChange={(event) => handleFileUpload(event)}
            style={{ gridColumnStart: "1", gridColumnEnd: "3" }}
          />
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
