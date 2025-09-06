import axios from 'axios';

const submitForm = async (url, formData, token, setIsLoading, setError, isMultipart = false) => {
  setIsLoading(true);
  setError(null);

  const headers = {
    'Authorization': token,
    'Content-Type': isMultipart ? 'multipart/form-data' : 'application/json'
  };

  try {
    const response = await axios.post(url, formData, { headers });
    console.log('Response:', response.data);
    return response.data;
  } catch (err) {
    console.error('Error:', err);
    setError('An error occurred while submitting the form.');
    throw err;
  } finally {
    setIsLoading(false);
  }
};

const apiDataCall = async(url,data,token,method) => {
  const headers = {'Authorization': token,'Content-Type': 'application/json'};
  const axiosConfig = {method: method, url: url, headers: headers}
  if (method !== "GET"){
    axiosConfig.data = data
  }

  try {
    const reponse = await axios(axiosConfig);
    return reponse.data.data
  } catch (err) {
    console.error('Error:', err);
    throw err;
  }
}

export {apiDataCall, submitForm};
