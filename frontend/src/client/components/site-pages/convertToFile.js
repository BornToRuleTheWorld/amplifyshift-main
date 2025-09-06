const convertUrlToFile = async (url, fileName) => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch file');
        }
        const blob = await response.blob();
        const file = new File([blob], fileName, { type: blob.type });
        return file;
    } catch (error) {
        console.error('Error converting URL to file:', error);
        return null;
    }
};

export default convertUrlToFile;