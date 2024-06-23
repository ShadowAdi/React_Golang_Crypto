import { useEffect, useState } from "react";
import { Layout } from "antd";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import Header from "./components/Header";
import Trending from "./pages/Trending";
import { MyContext } from "./context/context";
import Coin from "./pages/Coin";
import Saved from "./pages/Saved";
import Search from "./pages/Search";
import Register from "./pages/Register";
import Login from "./pages/Login";
const { Content } = Layout;

function App() {
  const [lovedCoins, setLovedCoins] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem("favoriteCoins"));
    if (savedFavorites) {
      setLovedCoins(savedFavorites);
    }
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  console.log(user)

  return (
    <MyContext.Provider value={{ lovedCoins, setLovedCoins, user, setUser }}>
      <BrowserRouter>
        <Layout
          style={{
            background: "#F2ECFF",
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
          }}
        >
          {user && <Header />}
          <Content
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: "2rem",
              height: "100%",
            }}
          >
            <Routes>
              {user && <Route path="/Trending" element={<Trending />} />}
              {user && <Route path="/Coin/:id" element={<Coin />} />}
             {user &&  <Route path="/Saved" element={<Saved />} />}
             {user && <Route path="/Search/:query" element={<Search />} />}
              {!user && <Route path="/Register" element={<Register />} />}
              {user ? (
                <Route path="/" element={<Home />} />
              ) : (
                <Route index path="/" element={<Login />} />
              )}
            </Routes>
          </Content>
        </Layout>
      </BrowserRouter>
    </MyContext.Provider>
  );
}

export default App;
