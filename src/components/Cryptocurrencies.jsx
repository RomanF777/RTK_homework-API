import React, { useEffect, useState, useContext } from 'react';
import millify from 'millify';
import { Link } from 'react-router-dom';
import { Card, Row, Col, Input, Button, Empty } from 'antd';
import { useGetCryptosQuery } from '../services/cryptoApi';
import Loader from './Loader';
import { TranslationContext } from "../context/TranslationContext";

const Cryptocurrencies = ({ simplified }) => {
  const { translations } = useContext(TranslationContext);
  const count = simplified ? 10 : 100;
  const { data: cryptosList, isFetching } = useGetCryptosQuery(count);
  const [cryptos, setCryptos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (cryptosList?.data?.coins) {
      const filteredData = cryptosList.data.coins.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setCryptos(filteredData);
    }
  }, [cryptosList, searchTerm]);

  if (isFetching) return <Loader />;

  const openBrowserSearch = () => {
    if (searchTerm.trim()) {
      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchTerm)}`;
      window.open(searchUrl, '_blank');
    } else {
      const searchUrl = `https://www.google.com/search?q=cryptocurrency`;
      window.open(searchUrl, '_blank');
    }
  };

  return (
    <>
      {!simplified && (
        <div className="search-crypto" style={{ textAlign: 'center', marginBottom: '20px' }}>
          <Input
            placeholder={translations.searchCryptocurrency}
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
            style={{ width: '250px' }}
          />
        </div>
      )}
      <Row gutter={[32, 32]} className="crypto-card-container">
        {cryptos.length > 0 ? (
          cryptos.map((currency) => (
            <Col xs={24} sm={12} lg={6} className="crypto-card" key={currency.uuid}>
              <Link to={`/crypto/${currency.uuid}`}>
                <Card
                  title={`${currency.rank}. ${currency.name}`}
                  extra={<img className="crypto-image" src={currency.iconUrl} alt={currency.name} />}
                  hoverable
                >
                  <p>{translations.price}: {millify(currency.price)}</p>
                  <p>{translations.marketCap}: {millify(currency.marketCap)}</p>
                  <p>{translations.dailyChange}: {currency.change}%</p>
                </Card>
              </Link>
            </Col>
          ))
        ) : (
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            textAlign: 'center', 
            minHeight: '60vh',
            width: '100%'
          }}>
            <Empty description={translations.didntFindCrypto} />
            <Button
              type="primary"
              style={{ marginTop: 16 }}
              onClick={openBrowserSearch}
            >
              {translations.searchOnGoogle}
            </Button>
            <img 
              src="animation google GIF by weinventyou.gif" 
              alt="Google animation" 
              style={{ width: '60vw', height: 'auto', marginTop: 20, maxWidth: '100%' }} 
            />
          </div>
        )}
      </Row>
    </>
  );
};

export default Cryptocurrencies;
