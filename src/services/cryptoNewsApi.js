import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const rapidApiKey = process.env.REACT_APP_RAPID_API_KEY;

if (!rapidApiKey) {
    console.error('❌ RAPID_API_KEY not found!');
}

const cryptoNewsHeaders = {
    'x-rapidapi-host': 'news-api14.p.rapidapi.com',
    'x-rapidapi-key': rapidApiKey,
};

const baseUrl = 'https://news-api14.p.rapidapi.com';

const createRequest = (url) => ({ url, headers: cryptoNewsHeaders });

export const cryptoNewsApi = createApi({
    reducerPath: 'cryptoNewsApi',
    baseQuery: fetchBaseQuery({ baseUrl }),
    endpoints: (builder) => ({
        getCryptoNews: builder.query({
            query: ({ newsCategory, count }) => 
                createRequest(`/v2/search/articles?query=${newsCategory}&language=en&size=${count}`)
        })
    }) 
});

export const { useGetCryptoNewsQuery } = cryptoNewsApi;
