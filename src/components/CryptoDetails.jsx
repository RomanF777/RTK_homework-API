import React, { useState, useEffect, useContext } from 'react';
import HTMLReactParser from 'html-react-parser';
import { useParams } from 'react-router-dom';
import millify from 'millify';
import { Col, Row, Typography, Select, Card, Space } from 'antd';
import { MoneyCollectOutlined, DollarCircleOutlined, FundOutlined, ExclamationCircleOutlined, StopOutlined, TrophyOutlined, CheckOutlined, NumberOutlined, ThunderboltOutlined } from '@ant-design/icons';
import Loader from './Loader';
import { useGetCryptoDetailsQuery, useGetCryptoHistoryQuery } from '../services/cryptoApi';
import { TranslationContext } from "../context/TranslationContext";

const { Title, Text } = Typography;
const { Option } = Select;

const CryptoDetails = () => {
  const { translations } = useContext(TranslationContext);
  const { coinId } = useParams();
  const [timeperiod, setTimeperiod] = useState('7d');
  const { data, isFetching, error } = useGetCryptoDetailsQuery(coinId);
  const { data: coinHistory, isFetching: isHistoryFetching, error: historyError } = useGetCryptoHistoryQuery(
    { coinId, timeperiod },
    { skip: !coinId, refetchOnMountOrArgChange: true }
  );
  const cryptoDetails = data?.data?.coin;

  useEffect(() => {
    if (error) {
      console.error('Error fetching crypto details:', error);
    }
    if (historyError) {
      console.error('Error fetching crypto history:', historyError);
    }
  }, [error, historyError]);

  if (isFetching) return <Loader />;

  const prices = coinHistory?.data?.history.map((item) => parseFloat(item.price)) || [];
  const minPrice = prices.length > 0 ? Math.min(...prices).toFixed(2) : 'N/A';
  const maxPrice = prices.length > 0 ? Math.max(...prices).toFixed(2) : 'N/A';
  const avgPrice = prices.length > 0 ? (prices.reduce((sum, price) => sum + price, 0) / prices.length).toFixed(2) : 'N/A';

  const stats = [
    { title: translations.priceStatistics, value: `$ ${cryptoDetails?.price && millify(Number(cryptoDetails?.price))}`, icon: <DollarCircleOutlined /> },
    { title: translations.rank, value: cryptoDetails?.rank, icon: <NumberOutlined /> },
    { title: translations.total24hVolume, value: `$ ${cryptoDetails?.volume && millify(Number(cryptoDetails?.volume))}`, icon: <ThunderboltOutlined /> },
    { title: translations.marketCap, value: `$ ${cryptoDetails?.marketCap && millify(Number(cryptoDetails?.marketCap))}`, icon: <DollarCircleOutlined /> },
    { title: translations.allTimeHigh, value: `$ ${cryptoDetails?.allTimeHigh?.price && millify(Number(cryptoDetails?.allTimeHigh?.price))}`, icon: <TrophyOutlined /> },
  ];

  const genericStats = [
    { title: translations.numberOfMarkets, value: cryptoDetails?.numberOfMarkets, icon: <FundOutlined /> },
    { title: translations.numberOfExchanges, value: cryptoDetails?.numberOfExchanges, icon: <MoneyCollectOutlined /> },
    { title: translations.approvedSupply, value: cryptoDetails?.supply?.confirmed ? <CheckOutlined /> : <StopOutlined />, icon: <ExclamationCircleOutlined /> },
    { title: translations.totalSupply, value: `$ ${cryptoDetails?.supply?.total && millify(Number(cryptoDetails?.supply?.total))}`, icon: <ExclamationCircleOutlined /> },
    { title: translations.circulatingSupply, value: `$ ${cryptoDetails?.supply?.circulating && millify(Number(cryptoDetails?.supply?.circulating))}`, icon: <ExclamationCircleOutlined /> },
  ];

  return (
    <Row gutter={[24, 24]} style={{ padding: '24px' }}>
      <Col span={24}>
        <Card>
          <Title level={2} style={{ marginBottom: '0' }}>
            {cryptoDetails?.name} ({cryptoDetails?.symbol}) {translations.price}
          </Title>
          <Text type="secondary">{cryptoDetails?.name} {translations.livePriceInUSD}</Text>
        </Card>
      </Col>

      <Col span={24}>
        <Card title={`${translations.priceStatistics} ${timeperiod}`}>
          <Space direction="vertical">
            <Text>{translations.minimumPrice}: <strong>${minPrice}</strong></Text>
            <Text>{translations.maximumPrice}: <strong>${maxPrice}</strong></Text>
            <Text>{translations.averagePrice}: <strong>${avgPrice}</strong></Text>
          </Space>
        </Card>
      </Col>

      <Col span={24}>
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={12}>
            <Card title={`${cryptoDetails?.name} ${translations.valueStatistics}`}>
              {stats.map(({ icon, title, value }) => (
                <Row key={title} justify="space-between" style={{ marginBottom: '16px' }}>
                  <Col>
                    <Space>
                      {icon}
                      <Text>{title}</Text>
                    </Space>
                  </Col>
                  <Col>
                    <Text strong>{value}</Text>
                  </Col>
                </Row>
              ))}
            </Card>
          </Col>

          <Col xs={24} sm={12}>
            <Card title={translations.otherStatsInfo}>
              {genericStats.map(({ icon, title, value }) => (
                <Row key={title} justify="space-between" style={{ marginBottom: '16px' }}>
                  <Col>
                    <Space>
                      {icon}
                      <Text>{title}</Text>
                    </Space>
                  </Col>
                  <Col>
                    <Text strong>{value}</Text>
                  </Col>
                </Row>
              ))}
            </Card>
          </Col>
        </Row>
      </Col>

      <Col span={24}>
        <Row gutter={[24, 24]}>
          <Col xs={24} md={12}>
            <Card title={`${translations.whatIs} ${cryptoDetails?.name}?`}>
              {HTMLReactParser(cryptoDetails?.description || '')}
            </Card>
          </Col>

          <Col xs={24} md={12}>
            <Card title={`${cryptoDetails?.name} ${translations.links}`}>
              {cryptoDetails?.links?.map((link) => (
                <Row key={link.name} style={{ marginBottom: '16px' }}>
                  <Col span={24}>
                    <Row justify="space-between">
                      <Text>{link.type}</Text>
                      <a href={link.url} target="_blank" rel="noreferrer">{link.name}</a>
                    </Row>
                  </Col>
                </Row>
              ))}
            </Card>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default CryptoDetails;