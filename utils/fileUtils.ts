
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result !== 'string') {
        return reject(new Error('FileReader did not return a string.'));
      }
      // The result includes the data URL prefix (e.g., "data:image/png;base64,").
      // We need to strip it for the Gemini API, which expects just the raw base64 data.
      const base64String = reader.result.split(',')[1];
      if (!base64String) {
          return reject(new Error('Could not extract base64 string from data URL.'));
      }
      resolve(base64String);
    };
    reader.onerror = (error) => reject(error);
  });
};
