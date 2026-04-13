import sanityClient from '@sanity/client';

const client = sanityClient({
  projectId: process.env.PROJECT_ID,
  dataset: process.env.DATASET,
  apiVersion: process.env.API_VERSION || '2025-02-19',
  token: process.env.TOKEN,
  useCdn: false,
  ignoreBrowserTokenWarning: true,
});

export async function fetchSampleDocuments(limit = 10) {
  const query = '*[_type != null] { _id, _type, _createdAt, _rev }[0...$limit]';
  return client.fetch(query, { limit });
}

export default client;
