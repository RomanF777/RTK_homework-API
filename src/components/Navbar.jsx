import React, { useState, useEffect, useContext } from "react";
import { Menu, Typography, Avatar, Select, Row, Col } from "antd";
import { Link, useLocation } from "react-router-dom";
import { HomeOutlined, FundOutlined, BulbOutlined, MenuOutlined } from "@ant-design/icons";
import icon from "../images/guy.png";
import { TranslationContext } from "../context/TranslationContext";

const { Option } = Select;

const Navbar = () => {
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState(true);
  const [screenSize, setScreenSize] = useState(null);
  const { translations, language, setLanguage } = useContext(TranslationContext);

  useEffect(() => {
    const handleResize = () => setScreenSize(window.innerWidth);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (screenSize < 800) {
      setActiveMenu(false);
    } else {
      setActiveMenu(true);
    }
  }, [screenSize]);

  const menuItems = [
    { key: "/", icon: <HomeOutlined />, label: <Link to="/">{translations.home}</Link> },
    { key: "/cryptocurrencies", icon: <FundOutlined />, label: <Link to="/cryptocurrencies">{translations.cryptocurrencies}</Link> },
    { key: "/news", icon: <BulbOutlined />, label: <Link to="/news">{translations.news}</Link> },
  ];

  if (screenSize < 800) {
    menuItems.push({
      key: "language-selector",
      label: (
        <Select
          value={language}
          onChange={setLanguage}
          style={{ width: "100%", marginTop: "8px" }}
        >
          <Option value="en">🇬🇧 English</Option>
          <Option value="ru">🇷🇺 Русский</Option>
          <Option value="lv">🇱🇻 Latviešu</Option>
        </Select>
      ),
    });
  }

  return (
    <div className="nav-container">
      <div className="logo-container">
        <Avatar src={icon} size={40} />
        <Typography.Title level={2} className="logo">
          <Link to="/">Crypto App!</Link>
        </Typography.Title>
        <button className="menu-control-container" onClick={() => setActiveMenu(!activeMenu)}>
          <MenuOutlined />
        </button>
      </div>

      {screenSize >= 800 && (
        <Row justify="center" style={{ marginBottom: '16px' }}>
          <Col>
            <Select value={language} onChange={setLanguage} className="language-select" style={{ width: '100%' }}>
              <Option value="en">🇬🇧 English</Option>
              <Option value="lv">🇱🇻 Latviešu</Option>
              <Option value="ru">🇷🇺 Русский</Option>
            </Select>
          </Col>
        </Row>
      )}

      {activeMenu && (
        <Menu theme="dark" selectedKeys={[location.pathname]} items={menuItems} style={{padding: '3%'}} />
      )}
    </div>
  );
};

export default Navbar;