// import { useState, useEffect } from "react";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { fetchDataFromApi } from "./utils/api";
// import { useSelector, useDispatch } from "react-redux";
// import { getApiConfiguration, getGenres } from "./store/homeSlice";

// import Header from "./components/header/Header"
// import Footer from "./components/footer/Footer"
// import Home from "./pages/home/Home";
// import Details from "./pages/details/Details"
// import Explore from "./pages/explore/Explore"
// import SearchResult from "./pages/searchResult/SearchResult"
// import PageNotFound from "./pages/404/PageNotFound"

// function App() {
//   const dispatch = useDispatch()
//   const { url } = useSelector((state) =>
//     state.home
//   )
//   //console.log(url)

//   useEffect(() => {
//     fetchApiConfig();
//     genresCall();
//   }, []);

//   const fetchApiConfig = () => {
//     fetchDataFromApi("/configuration").then((res) => {
//       //console.log(res);

//       const url = {
//         backdrop: res.images.secure_base_url + "original",
//         poster: res.images.secure_base_url + "original",
//         profile: res.images.secure_base_url + "original",
//       }

//       dispatch(getApiConfiguration(url));
//     });
//   };

//   const genresCall = async () => {
//     let promises = []
//     let endPoints = ["tv", "movie"]
//     let allGenres = {}

//     endPoints.forEach((url) => {
//       promises.push(fetchDataFromApi(`/genre/${url}/list`))
//     })

//     const data = await Promise.all(promises);
//     // console.log(data)

//     data.map(({ genres }) => {
//       return genres.map((item) => (allGenres[item.id] = item))
//     })
//     // console.log(allGenres)
//     dispatch(getGenres(allGenres))
//   }

//   return (
//     <BrowserRouter>
//       <Header />
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/:mediaType/:id" element={<Details />} />
//         <Route path="/search/:query" element={<SearchResult />} />
//         <Route path="/explore/:mediaType" element={<Explore />} />
//         <Route path="*" element={<PageNotFound />} />
//       </Routes>
//       <Footer />
//     </BrowserRouter>
//   );
// }

// export default App;

import { useState, useEffect, useCallback } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { fetchDataFromApi } from "./utils/api";
import { useSelector, useDispatch } from "react-redux";
import { getApiConfiguration, getGenres } from "./store/homeSlice";

import Header from "./components/header/Header"
import Footer from "./components/footer/Footer"
import Home from "./pages/home/Home";
import Details from "./pages/details/Details"
import Explore from "./pages/explore/Explore"
import SearchResult from "./pages/searchResult/SearchResult"
import PageNotFound from "./pages/404/PageNotFound"

function App() {
  const dispatch = useDispatch();
  const { url } = useSelector((state) => state.home);

  const fetchApiConfig = useCallback(async () => {
    const res = await fetchDataFromApi("/configuration");
    const { secure_base_url } = res.images;
    const url = {
      backdrop: `${secure_base_url}original`,
      poster: `${secure_base_url}original`,
      profile: `${secure_base_url}original`,
    };
    dispatch(getApiConfiguration(url));
  }, [dispatch]);

  const genresCall = useCallback(async () => {
    const endPoints = ["tv", "movie"];
    let allGenres = {};

    const promises = endPoints.map((url) =>
      fetchDataFromApi(`/genre/${url}/list`)
    );

    const data = await Promise.all(promises);

    data.forEach(({ genres }) => {
      genres.forEach((item) => (allGenres[item.id] = item));
    });

    dispatch(getGenres(allGenres));
  }, [dispatch]);

  useEffect(() => {
    fetchApiConfig();
    genresCall();
  }, [fetchApiConfig, genresCall]);

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:mediaType/:id" element={<Details />} />
        <Route path="/search/:query" element={<SearchResult />} />
        <Route path="/explore/:mediaType" element={<Explore />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
