import SearchIcon from "@mui/icons-material/Search";
import { IconButton, InputBase, Paper } from "@mui/material";
import React, { useState } from "react";

function Search({ handleSearch }) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchString = (event) => {
    setSearchTerm(event.target.value);
    handleSearch(event.target.value);
  };

  return (
    <Paper
      component="form"
      sx={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        margin: "16px auto 12px auto",
        zIndex: "1999",
        textAlign: "center",
        height: "44px",
        border: "1px solid #ccc",
      }}
    >
      <IconButton type="button" sx={{ p: "8px" }} aria-label="search">
        <SearchIcon />
      </IconButton>
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Search your favorite food"
        value={searchTerm}
        onChange={(e) => {
          handleSearchString(e);
        }}
        inputProps={{ "aria-label": "Search your favorite food" }}
      />
    </Paper>
  );
}

export default Search;
