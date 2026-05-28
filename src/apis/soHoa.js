import fetcher from './fetcher';

export const getAllSoHoa = async () => {
  try {
    const response = await fetcher('')
  } catch (error) {
    throw error.response.data.message;
  }
};
