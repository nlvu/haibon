import { DataGrid } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { revenueStatistics, selectStatistical, soldProductsStatistics, soldProductsStatisticsById } from "../../feature/statistical/sliceStatistical";
import Loader from "../../components/Loader/Loader";

function Statistical () {
    const dispatch = useDispatch();
    const statistical = useSelector(selectStatistical);
    const loading = useSelector((state) => state.statistical.loading);
  
    useEffect(() => {
      dispatch(revenueStatistics());
      dispatch(soldProductsStatistics());
      dispatch(soldProductsStatisticsById());
    }, [dispatch]);

    const columns = [
        { field: "name", headerName: "Name", flex: 2},
        { field: "description", headerName: "Description", flex: 2 },
        { field: "price", headerName: "Price", flex: 1 },
        { field: "newPrice", headerName: "New Price", flex: 1 },
        { field: "category", headerName: "Category", flex: 2 },
        {
          field: "images",
          headerName: "Image",
          flex: 2,
          renderCell: (params) => (
            <div style={{ display: "flex" }}>
              {params.value?.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Image ${index}`}
                  style={{ width: "50px", height: "50px", marginRight: "5px" }}
                />
              ))}
            </div>
          ),
        },
        { field: "stock", headerName: "Stock", flex: 1 },
        { field: "sold", headerName: "Sold", flex: 1 },
    ];
    
    const rows = statistical.soldProductsStatisticsById.length > 0 && Array.isArray(statistical.soldProductsStatisticsById[0]?.productInfo)
    ? statistical.soldProductsStatisticsById.map((statis) => ({
        id: statis?._id,
        name: statis?.productInfo[0].name,
        description: statis?.productInfo[0].description,
        price: statis?.productInfo[0].price,
        newPrice: statis?.productInfo[0].newprice,
        category: statis?.productInfo[0].category,
        images: statis?.productInfo[0].images,
        stock: statis?.productInfo[0].stock,
        sold: statis?.totalQuantitySold,
      }))
    : [];

    if (loading) {
        return <Loader />;
    }

    return (
        <div className="statis__wrapper">
            <div className="statis__overview">
                <div className="statis__revenue">
                    <span className="statis__title">Tổng doanh thu của cửa hàng</span>
                    <span className="statis__content">{statistical.revenueStatistic.totalRevenue}$</span>
                </div>
                <div className="statis__product">
                    <span className="statis__title">Tổng số lượng sản phẩm đã bán</span>
                    <span className="statis__content">{statistical.soldProductsStatistic.totalSoldProducts}</span>
                </div>
            </div>
            <div className="statis__productdes">
                <h1 className="title__product">Chi tiết số lượng đã bán của từng sản phẩm: </h1>
                <div style={{ marginTop: "20px", width: "100%"}}>
                    <DataGrid rows={rows} columns={columns} pageSize={5} />
                </div>
            </div>
        </div>
    )
}

export default Statistical;