import {
  AppBar,
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  NativeSelect,
  Select,
  Toolbar,
} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import LinearProgress from "@mui/material/LinearProgress";
import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { NotificationManager } from "react-notifications";
import { useParams } from "react-router";
import {
  updateOrderStatus,
  startListeningToCollection,
} from "../services/orderService";
import "./RestaurantOrders.css";

const CustomNoRowsOverlay = (message) => {
  return (
    <div xs={12} style={{ textAlign: "center", paddingTop: "50px" }}>
      <Typography variant="h6" gutterBottom>
        {message}
      </Typography>
    </div>
  );
};

const CustomStatusCellRenderer = ({ params }) => {
  const rowId = params.row.id;
  const [selectedStatus, setSelectedStatus] = useState(params);

  const handleStatusChange = async (event) => {
    setSelectedStatus(event.target.value);
    try {
      const response = await updateOrderStatus(rowId, event.target.value);
      console.log(
        "🚀 ~ file: RestaurantOrders.js:46 ~ handleStatusChange ~ response:",
        response
      );
    } catch (error) {
      console.log(
        "🚀 ~ file: RestaurantOrders.js:47 ~ handleStatusChange ~ error:",
        error
      );
    }
  };

  return (
    <FormControl fullWidth size="small" variant="outlined">
      <InputLabel id="header-label">Status</InputLabel>
      <NativeSelect
        labelId="header-label"
        id="header-select"
        value={selectedStatus}
        onChange={handleStatusChange}
        label="Status"
        size="small"
      >
        {["Completed", "Pending", "Progress", "Cancelled"].map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </NativeSelect>
    </FormControl>
  );
};

const RestaurantOrders = () => {
  let completed =0;
  let pending = 0;
  let cancelled = 0;
  let progress =0;
  const [orders, setOrders] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [pageSize, setPageSize] = React.useState(3);
  const { restaurantId } = useParams();

  React.useEffect(() => {
    let unsubscribe;
    const handleNewOrder = (order) => {
      NotificationManager.info(
        `New order received for Table No. ${order.tableId}.`
      );
    };

    const fetchData = async () => {
      unsubscribe = await startListeningToCollection(
        restaurantId,
        handleNewOrderState,
        handleNewOrder,
        setIsLoading
      );
    };

    fetchData();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [restaurantId]);

  function handleNewOrderState(order) {
    setOrders(order);
  }

  // function setStatus(id, newStatus) {
  //   const result = updateOrderStatus(id, newStatus);
  //   console.log(
  //     "🚀 ~ file: RestaurantOrders.js:82 ~ setStatus ~ result:",
  //     result
  //   );
  // }
  // const statusUpdate = (e, params) => {
  //   const f = "" + e.target.value + "";
  //   setStatus(params._owner.key, f);
  // };
  orders.forEach((row) => {
    switch (row.status) {
      case "Completed":
        completed = completed + 1;
        break;
      case "Pending":
        pending = pending + 1;
        break;
      case "Progress":
        progress = progress + 1;
        break;
      case "Cancelled":
        cancelled = cancelled + 1;
        break;
      default:
        console.log(`Sorry, we are out of .`);
    }
  });

  const columns = [
    {
      field: "tableId",
      headerName: "Table No.",
      width: 100,
      sortable: true,
    },
    {
      field: "porterName",
      headerName: "Porters",
      width: 200,
      sortable: true,
      renderCell: (params) => {
        return (
          <>
            <Chip
              avatar={<Avatar src="/broken-image.jpg" />}
              label={
                params.row.porterName !== ""
                  ? params.row.porterName
                  : "Not assigned"
              }
              variant={params.row.porterName !== "" ? "default" : "outlined"}
              color={params.row.porterName !== "" ? "primary" : "secondary"}
              size="small"
            />
          </>
        );
      },
    },
    {
      field: "menuItems",
      headerName: "Food Items",
      width: 400,
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <ul style={{ listStyleType: "none", padding: 0 }}>
              {params.row.menuItems.map((d, index) => (
                <li
                  key={d.id}
                  style={{
                    marginBottom: "4px",
                    height: "100%",
                    overflow: "auto",
                  }}
                >
                  <Chip
                    avatar={<Avatar>{`${index + 1}`}</Avatar>}
                    label={`${d.foodName ? d.foodName : "Loading..."}`}
                    sx={{ minWidth: "50px" }}
                    size="small"
                    variant="default"
                  />
                </li>
              ))}
            </ul>
          </>
        );
      },
    },
    {
      field: "qty",
      headerName: "Quantity",
      width: 100,
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <ul style={{ listStyleType: "none", padding: 0 }}>
              {params.row.menuItems.map((d) => (
                <li key={d.id} style={{ marginBottom: "4px" }}>
                  <Chip label={`${d.qty}`} size="small" variant="default" />
                </li>
              ))}
            </ul>
          </>
        );
      },
    },
    {
      field: "status",
      headerName: "Status",
      width: 200,
      sortable: true,
      renderCell: (params) => <CustomStatusCellRenderer params={params} />,
    },
  ];

  return (
    <React.Fragment>
      <AppBar>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Order Status
          </Typography>
        </Toolbar>
      </AppBar>
      <Container>
        <Box style={{ marginTop: "72px" }}>
          <div
            style={{
              height: "100%",
              maxHeight: "80vh",
              overflow: "auto",
            }}
          >
            <DataGrid
              AutoGenerateColumns="False"
              rows={orders}
              columns={columns}
              pageSize={pageSize}
              onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
              components={{
                NoRowsOverlay: () => CustomNoRowsOverlay("No Rows found."),
                LoadingOverlay: LinearProgress,
              }}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 100 },
                },
              }}
              loading={isLoading}
              autoHeight
              pageSizeOptions={[5, 10]}
              getRowHeight={() => "auto"}
              rowSpacingType="border"
              sx={{
                backgroundColor: "#fff",
                "& .MuiDataGrid-row": {
                  borderTopColor: "#fafafa",
                  borderTopStyle: "solid",
                },
              }}
              getRowId={(row) => row.id}
              rowKeyGetter={(row) => row.id}
            />
          </div>
        </Box>
        <Toolbar
          elevation={1}
          style={{
            border: "1px solid #ccc",
          }}
        >
          <Box
            style={{
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
              width: "100%",
              flexWrap: "wrap",
            }}
          >
            <Typography variant="subtitle2">
              Total | Number of Orders : <strong>{orders.length}</strong>
            </Typography>
            <Divider offset="horizontal" />
            <Typography variant="subtitle2">
              Completed Orders : <strong>{completed}</strong>
            </Typography>
            <Divider offset="horizontal" />

            <Typography variant="subtitle2">
              Pending Orders : <strong>{pending}</strong>
            </Typography>
            <Divider offset="horizontal" />

            <Typography variant="subtitle2">
              Cancelled Orders : <strong>{cancelled}</strong>
            </Typography>
            <Divider offset="horizontal" />

            <Typography variant="subtitle2">
              Progressing Orders : <strong>{progress}</strong>
            </Typography>
          </Box>
        </Toolbar>
      </Container>
    </React.Fragment>
  );
};

RestaurantOrders.propTypes = {};

RestaurantOrders.defaultProps = {};

export default RestaurantOrders;