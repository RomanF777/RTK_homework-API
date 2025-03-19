import React, { useState, useContext, useEffect } from 'react';
import { Typography, Row, Col, Card, Input, Button, Empty } from 'antd';
import moment from 'moment';
import Loader from './Loader';
import { useGetCryptoNewsQuery } from '../services/cryptoNewsApi';
import { TranslationContext } from "../context/TranslationContext";

const { Text, Title } = Typography;

const News = ({ simplified = false }) => {
  const { translations } = useContext(TranslationContext);
  const count = simplified ? 10 : 100;
  const { data, isFetching } = useGetCryptoNewsQuery({ newsCategory: 'cryptocurrency', count });

  const [newsList, setNewsList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (data?.data) {
      const filteredData = data.data.filter((news) =>
        news.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setNewsList(filteredData);
    }
  }, [data, searchQuery]);

  if (isFetching) return <Loader />;

  const openBrowserSearch = () => {
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery || 'crypto news')}`;
    window.open(searchUrl, '_blank');
  };

  return (
    <>
      {!simplified && (
        <div className="search-news" style={{ textAlign: 'center', marginBottom: '20px' }}>
          <Input
            placeholder={translations.searchNews}
            onChange={(e) => setSearchQuery(e.target.value)}
            value={searchQuery}
            style={{ width: '250px' }}
          />
        </div>
      )}

      <Row gutter={[24, 24]}>
        {newsList.length > 0 ? (
          newsList.map((news, index) => (
            <Col xs={24} sm={12} lg={8} key={index}>
              <Card hoverable>
                <a href={news.url} target="_blank" rel="noopener noreferrer">
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img
                      src={news.thumbnail || 'https://via.placeholder.com/150'}
                      alt="news"
                      style={{ width: 80, height: 80, marginRight: 10 }}
                    />
                    <Title level={4}>{news.title}</Title>
                  </div>
                  <Text>{moment(news.date).format('MMMM Do YYYY, h:mm a')}</Text>
                </a>
              </Card>
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
            <Empty description={translations.didntFindNews} />
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

export default News;
