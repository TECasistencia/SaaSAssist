import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  TablePagination,
} from "@mui/material";
import { Link } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import "../styles/styleViewDataHistoryDate.css";
function ViewDataHistoryDate() {
  const { state } = useLocation();
  const data = [
    {
      id: 1,
      date: "2024-01-01",
      classroom: "Aula 101",
      teacher: "Profesor A",
    },
    {
      id: 2,
      date: "2024-01-02",
      classroom: "Aula 102",
      teacher: "Profesor B",
    },
    {
      id: 3,
      date: "2024-01-03",
      classroom: "Aula 103",
      teacher: "Profesor C",
    },
    {
      id: 4,
      date: "2024-01-04",
      classroom: "Aula 104",
      teacher: "Profesor D",
    },
    {
      id: 5,
      date: "2024-01-05",
      classroom: "Aula 105",
      teacher: "Profesor E",
    },
    {
      id: 6,
      date: "2024-01-06",
      classroom: "Aula 106",
      teacher: "Profesor E",
    },
    {
      id: 7,
      date: "2024-01-07",
      classroom: "Aula 107",
      teacher: "Profesor E",
    },
    {
      id: 8,
      date: "2024-01-08",
      classroom: "Aula 108",
      teacher: "Profesor E",
    },
    {
      id: 9,
      date: "2024-01-09",
      classroom: "Aula 109",
      teacher: "Profesor E",
    },
    {
      id: 10,
      date: "2024-01-10",
      classroom: "Aula 110",
      teacher: "Profesor E",
    },
  ];

  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("classroom");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredData = data.filter((row) => {
    if (filter === "classroom") {
      return row.classroom.toLowerCase().includes(searchQuery.toLowerCase());
    } else if (filter === "date") {
      return row.date.includes(searchQuery);
    } else if (filter === "teacher") {
      return row.teacher.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  return (
    <div className="contentDate">
      <Header />
      <h2>Nombre de la clase: {state?.className}</h2>
      <div className="contentInternDate">
        <TextField
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Buscar..."
          variant="outlined"
          style={{ marginRight: "1rem" }}
        />
        <FormControl variant="outlined">
          <InputLabel id="filter-label">Filtrar por</InputLabel>
          <Select
            labelId="filter-label"
            value={filter}
            onChange={handleFilterChange}
            label="Filtrar por"
          >
            <MenuItem value="classroom">Aula</MenuItem>
            <MenuItem value="date">Fecha</MenuItem>
            <MenuItem value="teacher">Profesor</MenuItem>
          </Select>
        </FormControl>
      </div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Fecha</TableCell>
              <TableCell>Aula</TableCell>
              <TableCell>Profesor</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.classroom}</TableCell>
                  <TableCell>{row.teacher}</TableCell>
                  <TableCell>
                    <Link
                      to={`/ViewDataHistoryAG/${row.id}`}
                      state={{
                        date: row.date,
                        className: state?.className,
                        classroom: row.classroom,
                        teacher: row.teacher,
                      }}
                    >
                      <Button variant="contained" color="primary">
                        Detalle
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <Footer />
    </div>
  );
}

export default ViewDataHistoryDate;
