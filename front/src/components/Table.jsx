import React, { useContext } from "react";
import Loading from "./Loading";
import { AuthContext } from "../contexts/auth";

export default function Table({
  columns,
  data,
  selected,
  canEdit,
  canDelete,
  handleEdit,
  handleDelete,
  handleCheckboxChange,
  isSelected,
  handleSelectAll,
  isLoading,
}) {
  const auth = useContext(AuthContext);

  const getNestedValue = (item, dataField) => {
    const properties = dataField.split(".");
    let value = item;
    for (const property of properties) {
      if (item[property]) {
        value = value[property];
      }
    }
    return value;
  };

  return (
    <div className="table-responsive m-3">
      <table className="mt-4 w-full">
        <thead className="bg-indigo-600 text-white">
          <tr>
            <th className="py-2 px-4">
              <input
                type="checkbox"
                className="accent-indigo-500"
                checked={selected.length === data.length}
                onChange={handleSelectAll}
              />
            </th>
            {Array.from(columns).map((column, index) => (
              <>
                <td key={index} className="px-4 text-sm">
                  {column["title"]}
                </td>
              </>
            ))}
            <th className="py-2 px-4">Actions</th>
          </tr>
        </thead>
        {isLoading ? (
          <tbody>
            <tr>
              <td colSpan={columns.length + 2}>
                <div className="flex items-center justify-center h-full">
                  <Loading centered={false} size="small" />
                </div>
              </td>
            </tr>
          </tbody>
        ) : (
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td className="p-2" colSpan={columns.length + 2}>
                  No data
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 border-b border-gray-200"
                >
                  <td className="px-3">
                    <input
                      type="checkbox"
                      className="accent-indigo-500"
                      value={item.id}
                      checked={isSelected(item.id)}
                      onChange={(event) => handleCheckboxChange(event)}
                    />
                  </td>
                  {Array.from(columns).map((column, index) => (
                    <td
                      key={index}
                      className="px-4 text-sm overflow-y-auto"
                      style={{ maxWidth: "200px" }}
                    >
                      {column.type === "image" ? (
                        item[column.dataField] ? (
                          <img
                            src={item[column.dataField]["url"]}
                            alt="Product"
                          />
                        ) : (
                          <p>no image</p>
                        )
                      ) : column.type === "array" ? (
                        getNestedValue(item, column.dataField)
                      ) : (
                        item[column.dataField]
                      )}
                    </td>
                  ))}
                  <td className="px-4">
                    {auth.permissions.includes(canEdit) && (
                      <button
                        onClick={() => handleEdit(item.id)}
                        className="
                        text-sm font-normal text-green-700 hover:text-white
                         border border-green-700 hover:bg-green-800 
                         focus:outline-none focus:ring-green-300 
                         rounded-lg px-5 py-1 text-center mr-2 mb-2
                          dark:border-green-500 dark:text-green-500
                           dark:hover:text-white dark:hover:bg-green-500"
                      >
                        Edit
                      </button>
                    )}
                    {auth.permissions.includes(canDelete) && (
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="
                        text-sm font-normal text-red-700 hover:text-white
                         border border-red-700 hover:bg-red-800 focus:ring-4 
                         focus:outline-none focus:ring-red-300 
                         rounded-lg px-5 py-1 text-center mr-2 mb-2checkbo
                          dark:border-red-500 dark:text-red-500
                           dark:hover:text-white dark:hover:bg-red-500
                            dark:focus:ring-red-800"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        )}
      </table>
    </div>
  );
}
