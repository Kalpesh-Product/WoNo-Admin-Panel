import { useState } from "react";
import AgTable from "../../components/AgTable";
import PrimaryButton from "../../components/PrimaryButton";
import AssetModal from "../Assets/AssetsCategory/AssetModal";
import { useQuery } from "@tanstack/react-query";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const ManageVisitors = () => {
  const axios = useAxiosPrivate();
  const [modalMode, setModalMode] = useState("add");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);

  const assetColumns = [
    { field: "id", headerName: "Name" },
    { field: "department", headerName: "Address" },
    // { field: "assetNumber", headerName: "Asset Number" },
    { field: "category", headerName: "Email" },
    { field: "brand", headerName: "Phone No" },
    { field: "price", headerName: "Purpose" },
    { field: "quantity", headerName: "To Meet" },
    { field: "purchaseDate", headerName: "Check In" },
    { field: "warranty", headerName: "Check Out" },
    {
      field: "actions",
      headerName: "Actions",
      cellRenderer: (params) => (
        <PrimaryButton
          title="Details"
          handleSubmit={() => handleDetailsClick(params.data)}
        />
      ),
    },
  ];

  const { data: assetsList = [] } = useQuery({
    queryKey: "assetsList",
    queryFn: async () => {
      try {
        const response = await axios.get("/api/assets/get-assets");
        return response.data;
      } catch (error) {
        throw new Error(error.response.data.message);
      }
    },
  });

  const assets = [
    {
      id: "John Doe",
      department: "Margao",
      assetNumber: "A1001",
      category: "email@gmail.com",
      brand: "9876543201",
      price: "Investor Meeting",
      quantity: "Abrar Shaikh",
      purchaseDate: "09:30",
      warranty: " ",
      modelName: "Inspiron 1522",
      location: "Office A",
      vendorName: "Dell Technologies India",
      // invalid URL
      assetImage:
        "https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/inspiron-notebooks/15-3520/media-gallery/notebook-inspiron-15-3520-gallery-1.psd?fmt=png-alpha&pscan=auto&scl=1&wid=3653&hei=2548&qlt=100,0&resMode=sharp2&size=3653,2548",
    },
    {
      id: "Jane Doe",
      department: "Margao",
      assetNumber: "A1001",
      category: "email@gmail.com",
      brand: "9876543201",
      price: "Client Demo",
      quantity: "Abrar Shaikh",
      purchaseDate: "09:30",
      warranty: " ",
      modelName: "Pavilion 15",
      location: "Office B",
      vendorName: "HP India Pvt Ltd",
      // valid URL as on 7 feb 2025
      assetImage:
        "https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/inspiron-notebooks/14-2-in-1-7440-intel/media-gallery/notebook-inspiron-14-7440-t-ice-blue-gallery-10.psd?fmt=pjpg&pscan=auto&scl=1&wid=3924&hei=2565&qlt=100,1&resMode=sharp2&size=3924,2565&chrss=full&imwidth=5000",
    },
    // {
    //   id: 3,
    //   department: "IT",
    //   assetNumber: "A1003",
    //   category: "Laptop",
    //   brand: "Apple",
    //   price: "120000",
    //   quantity: 8,
    //   purchaseDate: "01-02-2024",
    //   warranty: 36,
    //   modelName: "MacBook Pro 16",
    //   location: "Office A",
    //   vendorName: "Apple India Pvt Ltd",
    // },
    // {
    //   id: 4,
    //   department: "IT",
    //   assetNumber: "A1004",
    //   category: "Laptop",
    //   brand: "Lenovo",
    //   price: "40000",
    //   quantity: 15,
    //   purchaseDate: "20-01-2024",
    //   warranty: 12,
    //   modelName: "ThinkPad X1",
    //   location: "Warehouse",
    //   vendorName: "Lenovo India Pvt Ltd",
    // },
    // {
    //   id: 5,
    //   department: "IT",
    //   assetNumber: "A1005",
    //   category: "Laptop",
    //   brand: "Acer",
    //   price: "20000",
    //   quantity: 3,
    //   purchaseDate: "05-01-2024",
    //   warranty: 24,
    //   modelName: "Aspire 5",
    //   location: "Office B",
    //   vendorName: "Acer India Pvt Ltd",
    // },
    // {
    //   id: 6,
    //   department: "IT",
    //   assetNumber: "A1006",
    //   category: "Laptop",
    //   brand: "Asus",
    //   price: "60000",
    //   quantity: 12,
    //   purchaseDate: "05-02-2024",
    //   warranty: 18,
    //   modelName: "ZenBook 14",
    //   location: "Warehouse",
    //   vendorName: "Asus India Pvt Ltd",
    // },
    // {
    //   id: 7,
    //   department: "HR",
    //   assetNumber: "A1007",
    //   category: "Projector",
    //   brand: "Epson",
    //   price: "20000",
    //   quantity: 2,
    //   purchaseDate: "30-11-2023",
    //   warranty: 24,
    //   modelName: "PowerLite 1781W",
    //   location: "Office A",
    //   vendorName: "Epson India Pvt Ltd",
    // },
    // {
    //   id: 8,
    //   department: "Administration",
    //   assetNumber: "A1008",
    //   category: "Printer",
    //   brand: "HP",
    //   price: "5000",
    //   quantity: 6,
    //   purchaseDate: "15-12-2023",
    //   warranty: 36,
    //   modelName: "LaserJet Pro M15w",
    //   location: "Office B",
    //   vendorName: "HP India Pvt Ltd",
    // },
    // {
    //   id: 9,
    //   department: "Finance",
    //   assetNumber: "A1009",
    //   category: "Scanner",
    //   brand: "Canon",
    //   price: "6000",
    //   quantity: 4,
    //   purchaseDate: "28-01-2024",
    //   warranty: 24,
    //   modelName: "imageFORMULA R40",
    //   location: "Warehouse",
    //   vendorName: "Canon India Pvt Ltd",
    // },
  ];

  const handleDetailsClick = (asset) => {
    setSelectedAsset(asset);
    setModalMode("view");
    setIsModalOpen(true);
  };

  const handleAddAsset = () => {
    setModalMode("add");
    setSelectedAsset(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (assetData) => {
    if (modalMode === "add") {
      // Logic to add new asset
      try {
        // await axios.post('/api/assets', assetData);
      } catch (error) {
        console.error("Error adding asset:", error);
      }
    } else if (modalMode === "edit") {
      // Logic to update existing asset
      try {
        // await axios.put(`/api/assets/${assetData.id}`, assetData);
      } catch (error) {
        console.error("Error updating asset:", error);
      }
    }
  };

  return (
    <div className="p-4">
      <AgTable
        key={assets.length}
        search={true}
        searchColumn={"Asset Number"}
        tableTitle={"Visitors Today"}
        // buttonTitle={"Add Asset"}
        data={[
          ...assets.map((asset, index) => ({
            id: index + 1,
            department: asset.department,
            category: asset.category,
            brand: asset.brand,
            price: asset.price,
            quantity: asset.quantity,
            purchaseDate: asset.purchaseDate,
            warranty: asset.warranty,
            vendorName: asset.vendorName,
          })),
        ]}
        columns={assetColumns}
        handleClick={handleAddAsset}
      />

      <AssetModal
        mode={modalMode}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        assetData={selectedAsset}
        onModeChange={setModalMode}
      />
    </div>
  );
};

export default ManageVisitors;
