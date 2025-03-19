import React, { useContext } from "react";
import millify from "millify";
import { Typography, Row, Col, Statistic, Button, Empty } from "antd";
import { Link } from "react-router-dom";
import { useGetCryptosQuery } from "../services/cryptoApi";
import { Cryptocurrencies, News } from "../components";
import Loader from "./Loader";
import { TranslationContext } from "../context/TranslationContext";

const { Title } = Typography;

const Homepage = () => {
  const { translations } = useContext(TranslationContext);
  const { data, isFetching } = useGetCryptosQuery(10);
  const globalStats = data?.data?.stats || {};

  if (isFetching) return <Loader />;

  const isDataAvailable = globalStats.total && globalStats.totalMarkets;

  return (
    <>
      <Title level={2} className="heading">{translations.globalStats}</Title>

      {isDataAvailable ? (
        <Row>
          <Col span={12}><Statistic title={translations.totalCryptos} value={globalStats.total} /></Col>
          <Col span={12}><Statistic title={translations.totalExchanges} value={millify(globalStats.totalExchanges)} /></Col>
          <Col span={12}><Statistic title={translations.totalMarketCap} value={millify(globalStats.totalMarketCap)} /></Col>
          <Col span={12}><Statistic title={translations.total24hVolume} value={millify(globalStats.total24hVolume)} /></Col>
          <Col span={12}><Statistic title={translations.totalMarkets} value={millify(globalStats.totalMarkets)} /></Col>
        </Row>
      ) : (
        <div style={{ textAlign: "center", marginTop: 40 }}>
          <Empty description={translations.failedToLoadData} />
          <Button type="primary" style={{ marginTop: 16 }} onClick={() => window.location.reload()}>
            {translations.tryAgain}
          </Button>
        </div>
      )}

      {isDataAvailable && (
        <>
          <div className="home-heading-container">
            <Title level={2} className="home-title">{translations.top10}</Title>
            <Title level={3} className="show-more"><Link to="/cryptocurrencies">{translations.showMore}</Link></Title>
          </div>
          <Cryptocurrencies simplified />

          <div className="home-heading-container">
            <Title level={2} className="home-title">{translations.latestNews}</Title>
            <Title level={3} className="show-more"><Link to="/news">{translations.showMore}</Link></Title>
          </div>
          <News simplified />
        </>
      )}
    </>
  );
};

export default Homepage;
